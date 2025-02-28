module prediction_market::prediction_market_v3 {
    use std::signer;
    use std::error;
    use std::vector;
    use std::string::String;
    use aptos_framework::event::{Self, EventHandle};
    use aptos_framework::account;
    use aptos_framework::timestamp;
    
    // Import the Custody Wallet module to use it
    use custody_wallet::custody_wallet;
    
    /// Errors
    const E_NOT_AUTHORIZED: u64 = 1;
    const E_MARKET_ALREADY_EXISTS: u64 = 2;
    const E_MARKET_DOES_NOT_EXIST: u64 = 3;
    const E_MARKET_ALREADY_CLOSED: u64 = 4;
    const E_MARKET_STILL_ACTIVE: u64 = 5;
    const E_MARKET_ALREADY_RESOLVED: u64 = 6;
    const E_INVALID_OUTCOME: u64 = 7;
    const E_INSUFFICIENT_BALANCE: u64 = 8;
    const E_MARKET_NOT_RESOLVED: u64 = 9;
    const E_NO_POSITION: u64 = 10;
    const E_INVALID_FEE_PERCENTAGE: u64 = 11;
    const E_ZERO_AMOUNT: u64 = 12;
    const E_INVALID_WEIGHTS: u64 = 13;
    const E_PRICE_IMPACT_TOO_HIGH: u64 = 14;
    const E_NOT_GROUP_MEMBER: u64 = 15;
    const E_GROUP_ALREADY_EXISTS: u64 = 16;
    const E_GROUP_DOES_NOT_EXIST: u64 = 17;
    const E_ALREADY_GROUP_MEMBER: u64 = 18;
    const E_EMPTY_GROUP_NAME: u64 = 19;
    const E_EMPTY_CHALLENGE_NAME: u64 = 20;
    const E_INVALID_DEADLINE: u64 = 21;
    const E_VERIFICATION_REQUIRED: u64 = 22;
    
    /// Fee configuration - reduced for social betting
    const PLATFORM_FEE_PERCENTAGE: u64 = 100; // 1.00% (in basis points - 10000 = 100%)
    const LIQUIDITY_PROVIDER_FEE_PERCENTAGE: u64 = 0; // 0% (not using LP in social context)
    const BASIS_POINTS: u64 = 10000; // 100%
    
    /// AMM constants
    const INITIAL_LIQUIDITY_PER_SIDE: u64 = 100000; // Initial liquidity per side (lower for social betting)
    const PRICE_IMPACT_LIMIT: u64 = 3000; // 30% maximum price impact (higher for social betting)
    
    /// Market status
    struct MarketStatus has copy, drop, store {
        is_active: bool,
        is_resolved: bool,
        winning_outcome: u8 // 0=not determined yet, 1=Yes, 2=No
    }
    
    /// User position
    struct Position has copy, drop, store {
        user: address,
        yes_amount: u64,
        no_amount: u64
    }
    
    /// AMM pool state
    struct AMMPoolState has copy, drop, store {
        yes_pool: u64,          // Liquidity in YES pool
        no_pool: u64,           // Liquidity in NO pool
        total_fees_collected: u64, // Total fees collected
        lp_fees_collected: u64,  // Fees allocated to liquidity providers
    }
    
    /// Social group member
    struct GroupMember has copy, drop, store {
        member_address: address,
        join_time: u64,
        // Could add more member attributes here
    }
    
    /// Social group for friends
    struct FriendsGroup has key {
        creator: address,
        name: String,
        description: String,
        members: vector<GroupMember>,
        markets: vector<address>, // List of markets created in this group
        creation_time: u64,
        add_member_events: EventHandle<AddMemberEvent>,
        create_challenge_events: EventHandle<CreateChallengeEvent>
    }
    
    /// Challenge metadata (social context for betting)
    struct ChallengeMetadata has copy, drop, store {
        group_id: address, // Group this challenge belongs to
        challenge_type: u8, // 1=weight loss, 2=sales goals, 3=custom, etc.
        participants: vector<address>, // People participating in the challenge
        verification_required: bool, // Whether proof is required
        deadline_type: u8, // 1=one-time, 2=weekly, 3=monthly
    }
    
    /// Prediction market basic structure
    struct PredictionMarket has key {
        creator: address,
        question: String,
        description: String,
        end_time: u64,
        total_liquidity: u64,
        amm_state: AMMPoolState,
        positions: vector<Position>,
        status: MarketStatus,
        // Social context metadata
        challenge_metadata: ChallengeMetadata,
        // Events
        create_market_events: EventHandle<CreateMarketEvent>,
        place_bet_events: EventHandle<PlaceBetEvent>,
        resolve_market_events: EventHandle<ResolveMarketEvent>,
        claim_winnings_events: EventHandle<ClaimWinningsEvent>,
        add_liquidity_events: EventHandle<AddLiquidityEvent>,
        fee_collection_events: EventHandle<FeeCollectionEvent>,
        comment_events: EventHandle<CommentEvent>
    }
    
    /// Add member event
    struct AddMemberEvent has drop, store {
        group_id: address,
        member: address,
        adder: address,
        timestamp: u64
    }
    
    /// Create challenge event
    struct CreateChallengeEvent has drop, store {
        group_id: address,
        challenge_id: address,
        creator: address,
        challenge_name: String,
        timestamp: u64
    }
    
    /// Market creation event
    struct CreateMarketEvent has drop, store {
        creator: address,
        question: String,
        end_time: u64,
        timestamp: u64,
        group_id: address // Added group context
    }
    
    /// Bet placement event
    struct PlaceBetEvent has drop, store {
        user: address,
        market_creator: address,
        question: String,
        outcome: u8,         // 1=Yes, 2=No
        amount: u64,
        fee_paid: u64,       // Fee paid for this bet
        pre_price: u64,      // Price before trade (basis points)
        post_price: u64,     // Price after trade (basis points)
        timestamp: u64
    }
    
    /// Comment event for social interaction
    struct CommentEvent has drop, store {
        user: address,
        market_creator: address,
        comment: String,
        timestamp: u64
    }
    
    /// Market resolution event
    struct ResolveMarketEvent has drop, store {
        resolver: address,
        market_creator: address,
        question: String,
        winning_outcome: u8,
        timestamp: u64
    }
    
    /// Claim winnings event
    struct ClaimWinningsEvent has drop, store {
        user: address,
        market_creator: address,
        question: String,
        amount: u64,
        timestamp: u64
    }
    
    /// Add liquidity event
    struct AddLiquidityEvent has drop, store {
        provider: address,
        market_creator: address,
        question: String,
        amount: u64,
        timestamp: u64
    }
    
    /// Fee collection event
    struct FeeCollectionEvent has drop, store {
        collector: address,
        market_creator: address,
        amount: u64,
        timestamp: u64
    }
    
    /// Create a new friends group
    public entry fun create_friends_group(
        creator: &signer,
        name: String,
        description: String
    ) {
        let creator_addr = signer::address_of(creator);
        
        // Validate input
        assert!(!exists<FriendsGroup>(creator_addr), error::already_exists(E_GROUP_ALREADY_EXISTS));
        assert!(std::string::length(&name) > 0, error::invalid_argument(E_EMPTY_GROUP_NAME));
        
        // Create initial member (creator)
        let creator_member = GroupMember {
            member_address: creator_addr,
            join_time: timestamp::now_seconds()
        };
        
        let members = vector::empty<GroupMember>();
        vector::push_back(&mut members, creator_member);
        
        // Create the group
        let group = FriendsGroup {
            creator: creator_addr,
            name,
            description,
            members,
            markets: vector::empty<address>(),
            creation_time: timestamp::now_seconds(),
            add_member_events: account::new_event_handle<AddMemberEvent>(creator),
            create_challenge_events: account::new_event_handle<CreateChallengeEvent>(creator)
        };
        
        // Move group to creator's account
        move_to(creator, group);
    }
    
    /// Add member to friends group
    public entry fun add_group_member(
        adder: &signer,
        group_id: address,
        new_member: address
    ) acquires FriendsGroup {
        let adder_addr = signer::address_of(adder);
        
        // Check if group exists
        assert!(exists<FriendsGroup>(group_id), error::not_found(E_GROUP_DOES_NOT_EXIST));
        
        // Get group
        let group = borrow_global_mut<FriendsGroup>(group_id);
        
        // Check if adder is a member
        let is_member = is_group_member(group, adder_addr);
        assert!(is_member, error::permission_denied(E_NOT_GROUP_MEMBER));
        
        // Check if new member is already in the group
        let already_member = is_group_member(group, new_member);
        assert!(!already_member, error::already_exists(E_ALREADY_GROUP_MEMBER));
        
        // Add new member
        let new_member_struct = GroupMember {
            member_address: new_member,
            join_time: timestamp::now_seconds()
        };
        
        vector::push_back(&mut group.members, new_member_struct);
        
        // Emit event
        event::emit_event(&mut group.add_member_events, AddMemberEvent {
            group_id,
            member: new_member,
            adder: adder_addr,
            timestamp: timestamp::now_seconds()
        });
    }
    
    /// Create a new challenge within a group
    public entry fun create_challenge<CoinType>(
        creator: &signer,
        group_id: address,
        question: String,
        description: String,
        end_time: u64,
        challenge_type: u8,
        verification_required: bool,
        deadline_type: u8
    ) acquires FriendsGroup {
        let creator_addr = signer::address_of(creator);
        
        // Validate inputs
        assert!(exists<FriendsGroup>(group_id), error::not_found(E_GROUP_DOES_NOT_EXIST));
        assert!(std::string::length(&question) > 0, error::invalid_argument(E_EMPTY_CHALLENGE_NAME));
        
        let now = timestamp::now_seconds();
        assert!(end_time > now, error::invalid_argument(E_INVALID_DEADLINE));
        
        // Get group
        let group = borrow_global_mut<FriendsGroup>(group_id);
        
        // Check if creator is a member
        let is_member = is_group_member(group, creator_addr);
        assert!(is_member, error::permission_denied(E_NOT_GROUP_MEMBER));
        
        // Store question for event
        let question_copy = question;
        
        // Initialize AMM state with equal liquidity in both pools
        let amm_state = AMMPoolState {
            yes_pool: INITIAL_LIQUIDITY_PER_SIDE,
            no_pool: INITIAL_LIQUIDITY_PER_SIDE,
            total_fees_collected: 0,
            lp_fees_collected: 0
        };
        
        // Create empty participants vector
        let participants = vector::empty<address>();
        vector::push_back(&mut participants, creator_addr); // Creator is first participant
        
        // Create challenge metadata
        let challenge_metadata = ChallengeMetadata {
            group_id,
            challenge_type,
            participants,
            verification_required,
            deadline_type
        };
        
        // Create new market
        let market = PredictionMarket {
            creator: creator_addr,
            question,
            description,
            end_time,
            total_liquidity: INITIAL_LIQUIDITY_PER_SIDE * 2, // Total initial liquidity
            amm_state,
            positions: vector::empty<Position>(),
            status: MarketStatus {
                is_active: true,
                is_resolved: false,
                winning_outcome: 0
            },
            challenge_metadata,
            create_market_events: account::new_event_handle<CreateMarketEvent>(creator),
            place_bet_events: account::new_event_handle<PlaceBetEvent>(creator),
            resolve_market_events: account::new_event_handle<ResolveMarketEvent>(creator),
            claim_winnings_events: account::new_event_handle<ClaimWinningsEvent>(creator),
            add_liquidity_events: account::new_event_handle<AddLiquidityEvent>(creator),
            fee_collection_events: account::new_event_handle<FeeCollectionEvent>(creator),
            comment_events: account::new_event_handle<CommentEvent>(creator)
        };
        
        // Add market to group's market list
        vector::push_back(&mut group.markets, creator_addr);
        
        // Publish market creation event
        event::emit_event(&mut market.create_market_events, CreateMarketEvent {
            creator: creator_addr,
            question: question_copy,
            end_time,
            timestamp: now,
            group_id
        });
        
        // Emit challenge creation event
        event::emit_event(&mut group.create_challenge_events, CreateChallengeEvent {
            group_id,
            challenge_id: creator_addr,
            creator: creator_addr,
            challenge_name: question_copy,
            timestamp: now
        });
        
        // Move market resource to creator account
        move_to(creator, market);
    }
    
    /// Post a comment on a challenge (social interaction)
    public entry fun post_comment(
        user: &signer,
        market_creator: address,
        comment: String
    ) acquires PredictionMarket, FriendsGroup {
        let user_addr = signer::address_of(user);
        
        // Make sure the market exists
        assert!(exists<PredictionMarket>(market_creator), error::not_found(E_MARKET_DOES_NOT_EXIST));
        
        // Use borrow_global_mut to get the market
        let market = borrow_global_mut<PredictionMarket>(market_creator);
        
        // Get group ID from market
        let group_id = market.challenge_metadata.group_id;
        
        // Verify user is in the group
        let group = borrow_global<FriendsGroup>(group_id);
        let is_member = is_group_member(group, user_addr);
        assert!(is_member, error::permission_denied(E_NOT_GROUP_MEMBER));
        
        // Emit comment event
        event::emit_event(&mut market.comment_events, CommentEvent {
            user: user_addr,
            market_creator,
            comment,
            timestamp: timestamp::now_seconds()
        });
    }
    
    /// Calculate spot price for an outcome (in basis points 0-10000)
    public fun get_spot_price(yes_pool: u64, no_pool: u64, outcome: u8): u64 {
        // Validate outcome
        assert!(outcome == 1 || outcome == 2, error::invalid_argument(E_INVALID_OUTCOME));
        
        let total_liquidity = yes_pool + no_pool;
        
        if (outcome == 1) {
            // YES price = yes_pool / total_liquidity (as percentage in basis points)
            ((yes_pool as u128) * (BASIS_POINTS as u128) / (total_liquidity as u128)) as u64
        } else {
            // NO price = no_pool / total_liquidity (as percentage in basis points)
            ((no_pool as u128) * (BASIS_POINTS as u128) / (total_liquidity as u128)) as u64
        }
    }
    
    /// Calculate buy amount after fees
    public fun calculate_buy_amount_after_fees(amount: u64): u64 {
        let platform_fee = (amount as u128) * (PLATFORM_FEE_PERCENTAGE as u128) / (BASIS_POINTS as u128);
        let lp_fee = (amount as u128) * (LIQUIDITY_PROVIDER_FEE_PERCENTAGE as u128) / (BASIS_POINTS as u128);
        let amount_after_fees = (amount as u128) - platform_fee - lp_fee;
        
        amount_after_fees as u64
    }
    
    /// Calculate trade outcome based on AMM constant sum formula
    public fun calculate_trade_outcome(
        yes_pool: u64, 
        no_pool: u64, 
        bet_amount: u64, 
        outcome: u8
    ): (u64, u64, u64, u64) {
        // Get amount after fees
        let amount_after_fees = calculate_buy_amount_after_fees(bet_amount);
        let total_fee = bet_amount - amount_after_fees;
        let lp_fee = (bet_amount as u128) * (LIQUIDITY_PROVIDER_FEE_PERCENTAGE as u128) / (BASIS_POINTS as u128);
        let platform_fee = total_fee - (lp_fee as u64);
        
        // Get price before trade
        let pre_price = get_spot_price(yes_pool, no_pool, outcome);
        
        // Update pools based on the outcome
        let new_yes_pool;
        let new_no_pool;
        
        if (outcome == 1) {
            // YES outcome
            new_yes_pool = yes_pool + amount_after_fees;
            new_no_pool = no_pool;
        } else {
            // NO outcome
            new_yes_pool = yes_pool;
            new_no_pool = no_pool + amount_after_fees;
        };
        
        // Get price after trade
        let post_price = get_spot_price(new_yes_pool, new_no_pool, outcome);
        
        // Calculate price impact in basis points
        let price_impact = if (pre_price > post_price) {
            ((pre_price - post_price) as u128) * (BASIS_POINTS as u128) / (pre_price as u128)
        } else {
            ((post_price - pre_price) as u128) * (BASIS_POINTS as u128) / (pre_price as u128)
        };
        
        // Check that price impact is within limits
        assert!((price_impact as u64) <= PRICE_IMPACT_LIMIT, error::invalid_argument(E_PRICE_IMPACT_TOO_HIGH));
        
        (new_yes_pool, new_no_pool, pre_price, post_price)
    }
    
    /// Place a bet on a friend's challenge
    public entry fun place_bet<CoinType>(
        user: &signer,
        market_creator: address,
        amount: u64,
        outcome: u8  // 1=Yes, 2=No
    ) acquires PredictionMarket, FriendsGroup {
        let user_addr = signer::address_of(user);
        
        // Validate parameters
        assert!(amount > 0, error::invalid_argument(E_ZERO_AMOUNT));
        assert!(outcome == 1 || outcome == 2, error::invalid_argument(E_INVALID_OUTCOME));
        
        // Make sure the market exists
        assert!(exists<PredictionMarket>(market_creator), error::not_found(E_MARKET_DOES_NOT_EXIST));
        
        // Use borrow_global_mut to get the market
        let market = borrow_global_mut<PredictionMarket>(market_creator);
        
        // Check if the market is active
        assert!(market.status.is_active, error::invalid_state(E_MARKET_ALREADY_CLOSED));
        
        // Verify user is in the group
        let group_id = market.challenge_metadata.group_id;
        let group = borrow_global<FriendsGroup>(group_id);
        let is_member = is_group_member(group, user_addr);
        assert!(is_member, error::permission_denied(E_NOT_GROUP_MEMBER));
        
        // Check if the user has sufficient balance in custody wallet
        let user_balance = custody_wallet::check_balance<CoinType>(user_addr);
        assert!(user_balance >= amount, error::invalid_argument(E_INSUFFICIENT_BALANCE));
        
        // Calculate trade outcome using AMM formula
        let (new_yes_pool, new_no_pool, pre_price, post_price) = calculate_trade_outcome(
            market.amm_state.yes_pool,
            market.amm_state.no_pool,
            amount,
            outcome
        );
        
        // Calculate fees
        let amount_after_fees = calculate_buy_amount_after_fees(amount);
        let total_fee = amount - amount_after_fees;
        let lp_fee = (amount as u128) * (LIQUIDITY_PROVIDER_FEE_PERCENTAGE as u128) / (BASIS_POINTS as u128);
        let platform_fee = total_fee - (lp_fee as u64);
        
        // Update AMM state
        market.amm_state.yes_pool = new_yes_pool;
        market.amm_state.no_pool = new_no_pool;
        market.amm_state.total_fees_collected = market.amm_state.total_fees_collected + total_fee;
        market.amm_state.lp_fees_collected = market.amm_state.lp_fees_collected + (lp_fee as u64);
        
        // Update market total liquidity
        market.total_liquidity = market.total_liquidity + amount_after_fees;
        
        // Save the bet in user's position
        let position_index = find_position(market, user_addr);
        if (position_index == vector::length(&market.positions)) {
            // Create new position
            let new_position = Position {
                user: user_addr,
                yes_amount: if (outcome == 1) amount_after_fees else 0,
                no_amount: if (outcome == 2) amount_after_fees else 0
            };
            vector::push_back(&mut market.positions, new_position);
        } else {
            // Update existing position
            let position = vector::borrow_mut(&mut market.positions, position_index);
            if (outcome == 1) {
                position.yes_amount = position.yes_amount + amount_after_fees;
            } else {
                position.no_amount = position.no_amount + amount_after_fees;
            }
        };
        
        // Make a copy of question for the event
        let question_copy = *&market.question;
        
        // Publish bet placement event
        event::emit_event(&mut market.place_bet_events, PlaceBetEvent {
            user: user_addr,
            market_creator,
            question: question_copy,
            outcome,
            amount,
            fee_paid: total_fee,
            pre_price,
            post_price,
            timestamp: timestamp::now_seconds()
        });
    }
    
    /// Add liquidity to the market (equal amounts to both pools)
    public entry fun add_liquidity<CoinType>(
        provider: &signer,
        market_creator: address,
        amount: u64
    ) acquires PredictionMarket, FriendsGroup {
        let provider_addr = signer::address_of(provider);
        
        // Validate parameters
        assert!(amount > 0, error::invalid_argument(E_ZERO_AMOUNT));
        
        // Make sure the market exists
        assert!(exists<PredictionMarket>(market_creator), error::not_found(E_MARKET_DOES_NOT_EXIST));
        
        // Use borrow_global_mut to get the market
        let market = borrow_global_mut<PredictionMarket>(market_creator);
        
        // Check if the market is active
        assert!(market.status.is_active, error::invalid_state(E_MARKET_ALREADY_CLOSED));
        
        // Verify user is in the group
        let group_id = market.challenge_metadata.group_id;
        let group = borrow_global<FriendsGroup>(group_id);
        let is_member = is_group_member(group, provider_addr);
        assert!(is_member, error::permission_denied(E_NOT_GROUP_MEMBER));
        
        // Check if the provider has sufficient balance in custody wallet
        let provider_balance = custody_wallet::check_balance<CoinType>(provider_addr);
        assert!(provider_balance >= amount, error::invalid_argument(E_INSUFFICIENT_BALANCE));
        
        // Add liquidity equally to both pools
        let amount_per_pool = amount / 2;
        market.amm_state.yes_pool = market.amm_state.yes_pool + amount_per_pool;
        market.amm_state.no_pool = market.amm_state.no_pool + amount_per_pool;
        
        // Update market total liquidity
        market.total_liquidity = market.total_liquidity + amount;
        
        // Make a copy of question for the event
        let question_copy = *&market.question;
        
        // Publish add liquidity event
        event::emit_event(&mut market.add_liquidity_events, AddLiquidityEvent {
            provider: provider_addr,
            market_creator,
            question: question_copy,
            amount,
            timestamp: timestamp::now_seconds()
        });
    }
    
    /// Collect platform fees (only creator can do this)
    public entry fun collect_platform_fees<CoinType>(
        collector: &signer,
        market_creator: address
    ) acquires PredictionMarket {
        let collector_addr = signer::address_of(collector);
        
        // Make sure the market exists
        assert!(exists<PredictionMarket>(market_creator), error::not_found(E_MARKET_DOES_NOT_EXIST));
        
        // Use borrow_global_mut to get the market
        let market = borrow_global_mut<PredictionMarket>(market_creator);
        
        // Make sure only the creator can collect fees
        assert!(collector_addr == market.creator, error::permission_denied(E_NOT_AUTHORIZED));
        
        // Calculate platform fees (total fees - LP fees)
        let platform_fees = market.amm_state.total_fees_collected - market.amm_state.lp_fees_collected;
        
        // Reset platform fees
        market.amm_state.total_fees_collected = market.amm_state.lp_fees_collected;
        
        // Make a copy of question for the event
        let question_copy = *&market.question;
        
        // Publish fee collection event
        event::emit_event(&mut market.fee_collection_events, FeeCollectionEvent {
            collector: collector_addr,
            market_creator,
            amount: platform_fees,
            timestamp: timestamp::now_seconds()
        });
        
        // Note: In a real application, you would transfer the fees to the collector
        // through the custody wallet or another mechanism
    }
    
    /// Resolve a challenge (only creator or participant with verification can do this)
    public entry fun resolve_market(
        resolver: &signer,
        market_creator: address,
        winning_outcome: u8 // 1=Yes, 2=No
    ) acquires PredictionMarket {
        let resolver_addr = signer::address_of(resolver);
        
        // Make sure the market exists
        assert!(exists<PredictionMarket>(market_creator), error::not_found(E_MARKET_DOES_NOT_EXIST));
        
        // Use borrow_global_mut to get the market
        let market = borrow_global_mut<PredictionMarket>(market_creator);
        
        // Make sure only the creator can resolve the market (or add verification logic)
        assert!(resolver_addr == market.creator, error::permission_denied(E_NOT_AUTHORIZED));
        
        // Check if verification is required
        if (market.challenge_metadata.verification_required) {
            // In a real implementation, you would check for proof or verification
            // For now, we're simplifying to just allow the creator
            assert!(resolver_addr == market.creator, error::permission_denied(E_VERIFICATION_REQUIRED));
        };
        
        // Make sure the market hasn't been resolved already
        assert!(!market.status.is_resolved, error::invalid_state(E_MARKET_ALREADY_RESOLVED));
        
        // Check if the winning outcome is valid
        assert!(winning_outcome == 1 || winning_outcome == 2, error::invalid_argument(E_INVALID_OUTCOME));
        
        // Resolve the market
        market.status.is_active = false;
        market.status.is_resolved = true;
        market.status.winning_outcome = winning_outcome;
        
        // Make a copy of question for the event
        let question_copy = *&market.question;
        
        // Publish market resolution event
        event::emit_event(&mut market.resolve_market_events, ResolveMarketEvent {
            resolver: resolver_addr,
            market_creator,
            question: question_copy,
            winning_outcome,
            timestamp: timestamp::now_seconds()
        });
    }
    
    /// Claim winnings from a challenge
    public entry fun claim_winnings<CoinType>(
        user: &signer,
        market_creator: address
    ) acquires PredictionMarket, FriendsGroup {
        let user_addr = signer::address_of(user);
        
        // Make sure the market exists
        assert!(exists<PredictionMarket>(market_creator), error::not_found(E_MARKET_DOES_NOT_EXIST));
        
        // Use borrow_global_mut to get the market
        let market = borrow_global_mut<PredictionMarket>(market_creator);
        
        // Verify user is in the group
        let group_id = market.challenge_metadata.group_id;
        let group = borrow_global<FriendsGroup>(group_id);
        let is_member = is_group_member(group, user_addr);
        assert!(is_member, error::permission_denied(E_NOT_GROUP_MEMBER));
        
       // Make sure the market has been resolved
        assert!(market.status.is_resolved, error::invalid_state(E_MARKET_NOT_RESOLVED));
        
        // Find the user's position
        let position_index = find_position(market, user_addr);
        assert!(position_index < vector::length(&market.positions), error::not_found(E_NO_POSITION));
        
        let position = vector::borrow(&market.positions, position_index);
        let winning_outcome = market.status.winning_outcome;
        
        // Check if the user has a bet on the winning outcome
        let winning_amount = if (winning_outcome == 1) {
            position.yes_amount
        } else {
            position.no_amount
        };
        
        assert!(winning_amount > 0, error::invalid_state(E_NO_POSITION));
        
        // Calculate total winnings using AMM-based formula
        let winning_pool = if (winning_outcome == 1) market.amm_state.yes_pool else market.amm_state.no_pool;
        let payout_ratio = (winning_amount as u128) * (BASIS_POINTS as u128) / (winning_pool as u128);
        let payout = ((market.total_liquidity as u128) * payout_ratio / (BASIS_POINTS as u128)) as u64;
        
        // Make a copy of question for the event
        let question_copy = *&market.question;
        
        // Publish claim winnings event
        event::emit_event(&mut market.claim_winnings_events, ClaimWinningsEvent {
            user: user_addr,
            market_creator,
            question: question_copy,
            amount: payout,
            timestamp: timestamp::now_seconds()
        });
        
        // Reset user's position (to prevent claiming again)
        let position = vector::borrow_mut(&mut market.positions, position_index);
        if (winning_outcome == 1) {
            position.yes_amount = 0;
        } else {
            position.no_amount = 0;
        };
        
        // Note: In a real application, you would need to transfer the winnings
        // to the user through the custody wallet or another mechanism
    }
    
    /// Check if an address is a member of a group
    fun is_group_member(group: &FriendsGroup, addr: address): bool {
        let i = 0;
        let len = vector::length(&group.members);
        
        while (i < len) {
            let member = vector::borrow(&group.members, i);
            if (member.member_address == addr) {
                return true
            };
            i = i + 1;
        };
        
        false
    }
    
    /// Find user's position
    fun find_position(market: &PredictionMarket, user_addr: address): u64 {
        let i = 0;
        let len = vector::length(&market.positions);
        
        while (i < len) {
            let position = vector::borrow(&market.positions, i);
            if (position.user == user_addr) {
                return i
            };
            i = i + 1;
        };
        
        // Position not found, return vector length
        len
    }
    
    #[view]
    public fun view_market(market_creator: address): (String, String, u64, u64, u64, u64, bool, bool, u8, address, u8, bool) 
    acquires PredictionMarket {
        assert!(exists<PredictionMarket>(market_creator), error::not_found(E_MARKET_DOES_NOT_EXIST));
        
        let market = borrow_global<PredictionMarket>(market_creator);
        
        (
            *&market.question,
            *&market.description,
            market.end_time,
            market.amm_state.yes_pool,
            market.amm_state.no_pool,
            market.amm_state.total_fees_collected,
            market.status.is_active,
            market.status.is_resolved,
            market.status.winning_outcome,
            market.challenge_metadata.group_id,  // Group ID
            market.challenge_metadata.challenge_type, // Challenge type
            market.challenge_metadata.verification_required // Whether verification is required
        )
    }
    
    #[view]
    public fun view_position(market_creator: address, user_addr: address): (u64, u64) 
    acquires PredictionMarket {
        assert!(exists<PredictionMarket>(market_creator), error::not_found(E_MARKET_DOES_NOT_EXIST));
        
        let market = borrow_global<PredictionMarket>(market_creator);
        let position_index = find_position(market, user_addr);
        
        if (position_index < vector::length(&market.positions)) {
            let position = vector::borrow(&market.positions, position_index);
            (position.yes_amount, position.no_amount)
        } else {
            (0, 0)
        }
    }
    
    #[view]
    public fun view_current_odds(market_creator: address): (u64, u64) 
    acquires PredictionMarket {
        assert!(exists<PredictionMarket>(market_creator), error::not_found(E_MARKET_DOES_NOT_EXIST));
        
        let market = borrow_global<PredictionMarket>(market_creator);
        
        // Calculate current odds for YES and NO outcomes (in basis points)
        let yes_price = get_spot_price(market.amm_state.yes_pool, market.amm_state.no_pool, 1);
        let no_price = get_spot_price(market.amm_state.yes_pool, market.amm_state.no_pool, 2);
        
        (yes_price, no_price)
    }
    
    #[view]
    public fun view_fees_info(): (u64, u64, u64) {
        // Return fee percentages and basis points
        (PLATFORM_FEE_PERCENTAGE, LIQUIDITY_PROVIDER_FEE_PERCENTAGE, BASIS_POINTS)
    }
    
    #[view]
    public fun view_group(group_id: address): (String, String, u64, u64) 
    acquires FriendsGroup {
        assert!(exists<FriendsGroup>(group_id), error::not_found(E_GROUP_DOES_NOT_EXIST));
        
        let group = borrow_global<FriendsGroup>(group_id);
        
        (
            *&group.name,
            *&group.description,
            vector::length(&group.members),
            vector::length(&group.markets)
        )
    }
    
    #[view]
    public fun view_group_members(group_id: address): vector<address> 
    acquires FriendsGroup {
        assert!(exists<FriendsGroup>(group_id), error::not_found(E_GROUP_DOES_NOT_EXIST));
        
        let group = borrow_global<FriendsGroup>(group_id);
        let len = vector::length(&group.members);
        let result = vector::empty<address>();
        
        let i = 0;
        while (i < len) {
            let member = vector::borrow(&group.members, i);
            vector::push_back(&mut result, member.member_address);
            i = i + 1;
        };
        
        result
    }
    
    #[view]
    public fun view_group_markets(group_id: address): vector<address> 
    acquires FriendsGroup {
        assert!(exists<FriendsGroup>(group_id), error::not_found(E_GROUP_DOES_NOT_EXIST));
        
        let group = borrow_global<FriendsGroup>(group_id);
        *&group.markets
    }
    
    #[view]
    public fun is_member(group_id: address, user_addr: address): bool 
    acquires FriendsGroup {
        if (!exists<FriendsGroup>(group_id)) {
            return false
        };
        
        let group = borrow_global<FriendsGroup>(group_id);
        is_group_member(group, user_addr)
    }
    
    #[view]
    public fun get_challenge_participants(market_creator: address): vector<address> 
    acquires PredictionMarket {
        assert!(exists<PredictionMarket>(market_creator), error::not_found(E_MARKET_DOES_NOT_EXIST));
        
        let market = borrow_global<PredictionMarket>(market_creator);
        *&market.challenge_metadata.participants
    }
}
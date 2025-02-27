module prediction_market::prediction_market {
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
    
    /// Prediction market basic structure
    struct PredictionMarket has key {
        creator: address,
        question: String,
        description: String,
        end_time: u64,
        total_liquidity: u64,
        yes_pool: u64,
        no_pool: u64,
        positions: vector<Position>,
        status: MarketStatus,
        create_market_events: EventHandle<CreateMarketEvent>,
        place_bet_events: EventHandle<PlaceBetEvent>,
        resolve_market_events: EventHandle<ResolveMarketEvent>,
        claim_winnings_events: EventHandle<ClaimWinningsEvent>
    }
    
    /// Market creation event
    struct CreateMarketEvent has drop, store {
        creator: address,
        question: String,
        end_time: u64,
        timestamp: u64
    }
    
    /// Bet placement event
    struct PlaceBetEvent has drop, store {
        user: address,
        market_creator: address,
        question: String,
        outcome: u8,  // 1=Yes, 2=No
        amount: u64,
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
    
    /// Create a new prediction market
    public entry fun create_market<CoinType>(
        creator: &signer,
        question: String,
        description: String,
        end_time: u64
    ) {
        let creator_addr = signer::address_of(creator);
        
        // Make sure the market hasn't been created before
        assert!(!exists<PredictionMarket>(creator_addr), error::already_exists(E_MARKET_ALREADY_EXISTS));
        
        let now = timestamp::now_seconds();
        assert!(end_time > now, error::invalid_argument(E_MARKET_ALREADY_CLOSED));
        
        // Store question for event
        let question_copy = question;
        
        // Create new market
        let market = PredictionMarket {
            creator: creator_addr,
            question,
            description,
            end_time,
            total_liquidity: 0,
            yes_pool: 0,
            no_pool: 0,
            positions: vector::empty<Position>(),
            status: MarketStatus {
                is_active: true,
                is_resolved: false,
                winning_outcome: 0
            },
            create_market_events: account::new_event_handle<CreateMarketEvent>(creator),
            place_bet_events: account::new_event_handle<PlaceBetEvent>(creator),
            resolve_market_events: account::new_event_handle<ResolveMarketEvent>(creator),
            claim_winnings_events: account::new_event_handle<ClaimWinningsEvent>(creator)
        };
        
        // Publish market creation event
        event::emit_event(&mut market.create_market_events, CreateMarketEvent {
            creator: creator_addr,
            question: question_copy,
            end_time,
            timestamp: now
        });
        
        // Move market resource to creator account
        move_to(creator, market);
    }
    
    /// Place a bet on a specific outcome
    public entry fun place_bet<CoinType>(
        user: &signer,
        market_creator: address,
        amount: u64,
        outcome: u8  // 1=Yes, 2=No
    ) acquires PredictionMarket {
        let user_addr = signer::address_of(user);
        
        // Make sure the market exists
        assert!(exists<PredictionMarket>(market_creator), error::not_found(E_MARKET_DOES_NOT_EXIST));
        
        // Use borrow_global_mut to get the market
        let market = borrow_global_mut<PredictionMarket>(market_creator);
        
        // Check if the market is active
        assert!(market.status.is_active, error::invalid_state(E_MARKET_ALREADY_CLOSED));
        
        // Check if the outcome is valid (1=Yes, 2=No)
        assert!(outcome == 1 || outcome == 2, error::invalid_argument(E_INVALID_OUTCOME));
        
        // Check if the user has sufficient balance in custody wallet
        let user_balance = custody_wallet::check_balance<CoinType>(user_addr);
        assert!(user_balance >= amount, error::invalid_argument(E_INSUFFICIENT_BALANCE));
        
        // Save the bet
        let position_index = find_position(market, user_addr);
        if (position_index == vector::length(&market.positions)) {
            // Create new position
            let new_position = Position {
                user: user_addr,
                yes_amount: if (outcome == 1) amount else 0,
                no_amount: if (outcome == 2) amount else 0
            };
            vector::push_back(&mut market.positions, new_position);
        } else {
            // Update existing position
            let position = vector::borrow_mut(&mut market.positions, position_index);
            if (outcome == 1) {
                position.yes_amount = position.yes_amount + amount;
            } else {
                position.no_amount = position.no_amount + amount;
            }
        };
        
        // Update pools
        if (outcome == 1) {
            market.yes_pool = market.yes_pool + amount;
        } else {
            market.no_pool = market.no_pool + amount;
        };
        
        market.total_liquidity = market.total_liquidity + amount;
        
        // Make a copy of question for the event
        let question_copy = *&market.question;
        
        // Publish bet placement event
        event::emit_event(&mut market.place_bet_events, PlaceBetEvent {
            user: user_addr,
            market_creator,
            question: question_copy,
            outcome,
            amount,
            timestamp: timestamp::now_seconds()
        });
    }
    
    /// Resolve the market (only creator can do this)
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
        
        // Make sure only the creator can resolve the market
        assert!(resolver_addr == market.creator, error::permission_denied(E_NOT_AUTHORIZED));
        
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
    
    /// Claim winnings
    public entry fun claim_winnings<CoinType>(
        user: &signer,
        market_creator: address
    ) acquires PredictionMarket {
        let user_addr = signer::address_of(user);
        
        // Make sure the market exists
        assert!(exists<PredictionMarket>(market_creator), error::not_found(E_MARKET_DOES_NOT_EXIST));
        
        // Use borrow_global_mut to get the market
        let market = borrow_global_mut<PredictionMarket>(market_creator);
        
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
        
        // Calculate total winnings
        // Here we use a simple formula: take total liquidity proportional to share in winning pool
        let winning_pool = if (winning_outcome == 1) market.yes_pool else market.no_pool;
        let payout_ratio = (winning_amount as u128) * 1000000 / (winning_pool as u128); // 6 decimal places precision
        let payout = ((market.total_liquidity as u128) * payout_ratio / 1000000) as u64;
        
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
    public fun view_market(market_creator: address): (String, String, u64, u64, u64, bool, bool, u8) acquires PredictionMarket {
        assert!(exists<PredictionMarket>(market_creator), error::not_found(E_MARKET_DOES_NOT_EXIST));
        
        let market = borrow_global<PredictionMarket>(market_creator);
        
        (
            *&market.question,
            *&market.description,
            market.end_time,
            market.yes_pool,
            market.no_pool,
            market.status.is_active,
            market.status.is_resolved,
            market.status.winning_outcome
        )
    }
    
    #[view]
    public fun view_position(market_creator: address, user_addr: address): (u64, u64) acquires PredictionMarket {
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
}
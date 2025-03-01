# Welcome to our GangBet app 👋


## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

## Join the community

Join our community of developers creating universal apps.

- [GangBet on GitHub](https://github.com/oguzhandoganoglu/gangbet): Take a look at our project.
- [GangBet on Twitter](https://x.com/GangOnMovement): Don't stay away from innovations





# GangBet: Social Prediction Market

## Technical Documentation

## Table of Contents

1. [Introduction](https://www.notion.so/1a9a9e7b209780868fe6fe062b2faca0?pvs=21)
2. [System Architecture](https://www.notion.so/1a9a9e7b209780868fe6fe062b2faca0?pvs=21)
3. [Smart Contract Structure](https://www.notion.so/1a9a9e7b209780868fe6fe062b2faca0?pvs=21)
    - [Data Structures](https://www.notion.so/1a9a9e7b209780868fe6fe062b2faca0?pvs=21)
    - [Main Functions](https://www.notion.so/1a9a9e7b209780868fe6fe062b2faca0?pvs=21)
    - [Helper Functions](https://www.notion.so/1a9a9e7b209780868fe6fe062b2faca0?pvs=21)
    - [View Functions](https://www.notion.so/1a9a9e7b209780868fe6fe062b2faca0?pvs=21)
4. [AMM Mechanism](https://www.notion.so/1a9a9e7b209780868fe6fe062b2faca0?pvs=21)
5. [Fee System](https://www.notion.so/1a9a9e7b209780868fe6fe062b2faca0?pvs=21)
6. [Group Management](https://www.notion.so/1a9a9e7b209780868fe6fe062b2faca0?pvs=21)
7. [Challenge Workflow](https://www.notion.so/1a9a9e7b209780868fe6fe062b2faca0?pvs=21)
8. [Custody Wallet Integration](https://www.notion.so/1a9a9e7b209780868fe6fe062b2faca0?pvs=21)
9. [Security Considerations](https://www.notion.so/1a9a9e7b209780868fe6fe062b2faca0?pvs=21)
10. [API Documentation](https://www.notion.so/1a9a9e7b209780868fe6fe062b2faca0?pvs=21)
11. [Example Use Cases](https://www.notion.so/1a9a9e7b209780868fe6fe062b2faca0?pvs=21)
12. [Deployment Instructions](https://www.notion.so/1a9a9e7b209780868fe6fe062b2faca0?pvs=21)
13. [Future Developments](https://www.notion.so/1a9a9e7b209780868fe6fe062b2faca0?pvs=21)

## Introduction

GangBet is a blockchain-based social prediction market platform that enables friend groups to bet on personal goals or outcomes. Developed on the Movement (Aptos) blockchain, the platform is designed to provide friendly competition, social accountability, and motivation among friends.

The platform supports various personal challenges, from weight loss competitions to sales goals, and simplifies complex crypto mechanisms to provide a user-friendly experience.

### Key Features

- **Group-Based Social Betting**: Private challenges accessible only to specific friend groups
- **AMM (Automated Market Maker)**: Dynamic odds generation mechanism
- **Social Interaction**: Comment and support features for friends
- **Custody Wallet Integration**: Secure asset management
- **Low Platform Fees**: Fee structure optimized for social use
- **Challenge Varieties**: Different goal types and verification requirements

## System Architecture

The GangBet system consists of two main components:

1. **Custody Wallet Module**: Ensures secure management of user assets
2. **Prediction Market v3 Module**: Contains the core logic of the social betting platform

These modules run on the Movement (Aptos) blockchain and interact with each other.

```
┌───────────────────────┐      ┌───────────────────────┐
│                       │      │                       │
│   Custody Wallet      │<─────│   Prediction Market   │
│       Module          │      │       v3 Module       │
│                       │      │                       │
└───────────────────────┘      └───────────────────────┘
           ▲                              ▲
           │                              │
           │                              │
           │                              │
           ▼                              ▼
┌───────────────────────────────────────────────────────┐
│                                                       │
│                 Movement Blockchain                   │
│                                                       │
└───────────────────────────────────────────────────────┘

```

## Smart Contract Structure

The GangBet platform operates with smart contracts written in the Move programming language. The main module is named `prediction_market::prediction_market_v3`.

### Data Structures

The main data structures used in the system are:

### 1. MarketStatus

```
struct MarketStatus has copy, drop, store {
    is_active: bool,
    is_resolved: bool,
    winning_outcome: u8 // 0=not determined yet, 1=Yes, 2=No
}

```

This structure tracks the current status of a prediction market.

### 2. Position

```
struct Position has copy, drop, store {
    user: address,
    yes_amount: u64,
    no_amount: u64
}

```

Tracks the bets users have placed on "Yes" and "No" options.

### 3. AMMPoolState

```
struct AMMPoolState has copy, drop, store {
    yes_pool: u64,
    no_pool: u64,
    total_fees_collected: u64,
    lp_fees_collected: u64
}

```

Manages AMM (Automated Market Maker) pools and collected fees.

### 4. FriendsGroup

```
struct FriendsGroup has key {
    creator: address,
    name: String,
    description: String,
    members: vector<GroupMember>,
    markets: vector<address>,
    creation_time: u64,
    add_member_events: EventHandle<AddMemberEvent>,
    create_challenge_events: EventHandle<CreateChallengeEvent>
}

```

Manages social groups for betting.

### 5. PredictionMarket

```
struct PredictionMarket has key {
    creator: address,
    question: String,
    description: String,
    end_time: u64,
    total_liquidity: u64,
    amm_state: AMMPoolState,
    positions: vector<Position>,
    status: MarketStatus,
    challenge_metadata: ChallengeMetadata,
    // Events...
}

```

The main prediction market structure that contains all market data and states.

### Main Functions

### Group Management

```
public entry fun create_friends_group(creator: &signer, name: String, description: String)

```

Creates a new friend group.

```
public entry fun add_group_member(adder: &signer, group_id: address, new_member: address)

```

Adds a new member to a group.

### Challenge Management

```
public entry fun create_challenge<CoinType>(
    creator: &signer,
    group_id: address,
    question: String,
    description: String,
    end_time: u64,
    challenge_type: u8,
    verification_required: bool,
    deadline_type: u8
)

```

Creates a new challenge.

```
public entry fun post_comment(user: &signer, market_creator: address, comment: String)

```

Adds a comment to a challenge.

### Betting Operations

```
public entry fun place_bet<CoinType>(
    user: &signer,
    market_creator: address,
    amount: u64,
    outcome: u8
)

```

Places a bet on an outcome.

```
public entry fun add_liquidity<CoinType>(
    provider: &signer,
    market_creator: address,
    amount: u64
)

```

Adds liquidity to the liquidity pool.

### Resolution and Reward Operations

```
public entry fun resolve_market(
    resolver: &signer,
    market_creator: address,
    winning_outcome: u8
)

```

Resolves a challenge.

```
public entry fun claim_winnings<CoinType>(
    user: &signer,
    market_creator: address
)

```

Claims winnings.

### Helper Functions

```
fun is_group_member(group: &FriendsGroup, addr: address): bool

```

Checks if an address is a group member.

```
fun find_position(market: &PredictionMarket, user_addr: address): u64

```

Finds a user's position.

```
public fun calculate_trade_outcome(
    yes_pool: u64,
    no_pool: u64,
    bet_amount: u64,
    outcome: u8
): (u64, u64, u64, u64)

```

Calculates the outcome of a trade transaction.

### View Functions

```
#[view]
public fun view_market(market_creator: address): (String, String, u64, u64, u64, u64, bool, bool, u8, address, u8, bool)

```

Displays market details.

```
#[view]
public fun view_position(market_creator: address, user_addr: address): (u64, u64)

```

Displays a user's position.

```
#[view]
public fun view_current_odds(market_creator: address): (u64, u64)

```

Displays current odds.

## AMM Mechanism

FriendsBet uses a simplified Automated Market Maker (AMM). This provides a user-friendly experience optimized for social betting.

### Price Calculation

The prices of outcomes are calculated using the following formula:

```
YES price = yes_pool / (yes_pool + no_pool)
NO price = no_pool / (yes_pool + no_pool)

```

Prices are expressed in basis points (bps) (10000 = 100%).

### Liquidity Pools

Each challenge has two liquidity pools:

- YES pool
- NO pool

Each bet adds the bet amount to the corresponding pool.

### Price Impact

To be more flexible in social settings, the price impact limit is set high (30%), allowing larger price movements within small groups.

```
const PRICE_IMPACT_LIMIT: u64 = 3000; // 30% maximum price impact

```

## Fee System

FriendsBet uses a simplified fee system:

```
const PLATFORM_FEE_PERCENTAGE: u64 = 100; // 1.00% (in basis points - 10000 = 100%)
const LIQUIDITY_PROVIDER_FEE_PERCENTAGE: u64 = 0; // 0% (not using LP in social context)

```

- **Platform Fee**: 1% fee taken from each bet
- **LP Fee**: Set to 0% as it's not used in the social context

Fees can be collected using the `collect_platform_fees` function.

## Group Management

### Group Creation

Groups are created using the `create_friends_group` function. Each group has:

- A name and description
- A list of members
- A list of challenges created

### Member Management

Members can be added using the `add_group_member` function. Only existing members can add new members.

### Access Control

All betting operations and challenges are restricted based on group membership. Non-members cannot:

- Place bets
- Post comments
- Claim winnings

## Challenge Workflow

1. **Creation**: A group member creates a new challenge by calling the `create_challenge` function
2. **Betting**: Group members place bets on outcomes
3. **Social Interaction**: Members add comments using `post_comment`
4. **Resolution**: The creator resolves the challenge using `resolve_market`
5. **Claiming Winnings**: Those who bet on the winning side claim their winnings using `claim_winnings`

### Challenge Types

Challenges can be of different types:

- Weight loss competitions (challenge_type = 1)
- Sales goals (challenge_type = 2)
- Custom challenges (challenge_type = 3)

### Verification

Challenges may require verification:

```
verification_required: bool

```

When verification is required, only the creator can determine the outcome.

## Custody Wallet Integration

FriendsBet uses the Custody Wallet module to manage user assets:

```
use custody_wallet::custody_wallet;

```

The integration covers the following functions:

- Balance checking
- Locking assets for betting
- Processing winning claims

## Security Considerations

### Access Control

- Group membership checks
- Market creation and resolution permissions
- Fee collection permissions

### Protection Mechanisms

- Pre-transaction balance checks
- Price impact limits
- Prevention of multiple claims

### Improvements

- Verification mechanisms should be enhanced
- Multi-signature should be supported
- Time-locked transactions should be added

## API Documentation

### Group Operations

| Function | Parameters | Description |
| --- | --- | --- |
| create_friends_group | creator, name, description | Creates a new friend group |
| add_group_member | adder, group_id, new_member | Adds a new member to a group |
| view_group | group_id | Displays group information |
| view_group_members | group_id | Lists group members |
| is_member | group_id, user_addr | Checks membership |

### Challenge Operations

| Function | Parameters | Description |
| --- | --- | --- |
| create_challenge | creator, group_id, question, description, end_time, challenge_type, verification_required, deadline_type | Creates a new challenge |
| post_comment | user, market_creator, comment | Adds a comment |
| view_market | market_creator | Displays market details |

### Betting Operations

| Function | Parameters | Description |
| --- | --- | --- |
| place_bet | user, market_creator, amount, outcome | Places a bet |
| view_position | market_creator, user_addr | Displays position |
| view_current_odds | market_creator | Displays odds |
| add_liquidity | provider, market_creator, amount | Adds liquidity |

### Resolution and Reward Operations

| Function | Parameters | Description |
| --- | --- | --- |
| resolve_market | resolver, market_creator, winning_outcome | Resolves a market |
| claim_winnings | user, market_creator | Claims winnings |
| collect_platform_fees | collector, market_creator | Collects fees |

## Example Use Cases

### Scenario 1: Weight Loss Competition

1. Group creation:

```bash
aptos move run --function-id 0xADDRESS::prediction_market_v3::create_friends_group --args 'string:Fitness Group' 'string:Our weight loss goals'

```

1. Adding a member:

```bash
aptos move run --function-id 0xADDRESS::prediction_market_v3::add_group_member --args address:0xGROUP_ID address:0xNEW_MEMBER

```

1. Creating a challenge:

```bash
aptos move run --function-id 0xADDRESS::prediction_market_v3::create_challenge --type-args 0x1::aptos_coin::AptosCoin --args address:0xGROUP_ID 'string:5 Pounds in 1 Month' 'string:Who will lose 5 pounds in 1 month?' u64:1735689600 u8:1 bool:true u8:1

```

1. Placing a bet:

```bash
aptos move run --function-id 0xADDRESS::prediction_market_v3::place_bet --type-args 0x1::aptos_coin::AptosCoin --args address:0xCHALLENGE u64:1000000 u8:1

```

### Scenario 2: Sales Goals

Betting on monthly targets for a sales team:

1. Group creation:

```bash
aptos move run --function-id 0xADDRESS::prediction_market_v3::create_friends_group --args 'string:Sales Team' 'string:Our monthly sales goals'

```

1. Creating a challenge:

```bash
aptos move run --function-id 0xADDRESS::prediction_market_v3::create_challenge --type-args 0x1::aptos_coin::AptosCoin --args address:0xGROUP_ID 'string:April Target' 'string:Will we meet the sales target in April?' u64:1735689600 u8:2 bool:true u8:3

```

## Deployment Instructions

1. **Environment Preparation**:

```bash
cd ~/Desktop/custody/sources
nano prediction_market_v3.move

```

1. **Copy the Code**:
    - Paste the entire contract code into the file
2. **Edit Move.toml**:

```toml
[package]
name = "custody_wallet"
version = "0.0.1"

[addresses]
custody_wallet = "0xf3648367f126b5408e0d9dae774ac7f857f6e4e10df0de6ce448fb5d62cecb14"
prediction_market = "0xf3648367f126b5408e0d9dae774ac7f857f6e4e10df0de6ce448fb5d62cecb14"

[dependencies]
AptosFramework = { git = "https://github.com/aptos-labs/aptos-core.git", rev = "mainnet", subdir = "aptos-move/framework/aptos-framework" }

```

1. **Compilation**:

```bash
aptos move compile

```

1. **Deployment**:

```bash
aptos move publish

```

## Future Developments

1. **Enhanced Verification Mechanisms**:
    - Third-party verifiers
    - Proof uploading and verification
2. **User Interface**:
    - Web application
    - Mobile application
3. **Tokenized Badges**:
    - NFT achievement badges
    - Leaderboards
4. **More Complex Bet Types**:
    - Multi-option bets
    - Range-based challenges
    - Team challenges
5. **Integrations**:
    - Fitness applications
    - Sales CRM systems
    - Social media platforms

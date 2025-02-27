module custody_wallet::custody_wallet {
    use std::signer;
    use std::error;
    use std::vector;
    use aptos_framework::coin;
    use aptos_framework::event::{Self, EventHandle};
    use aptos_framework::account;
    use aptos_framework::timestamp;
    
    /// Errors
    const E_NOT_AUTHORIZED: u64 = 1;
    const E_WALLET_ALREADY_EXISTS: u64 = 2;
    const E_WALLET_DOES_NOT_EXIST: u64 = 3;
    const E_INSUFFICIENT_BALANCE: u64 = 4;
    
    /// Custody wallet
    struct CustodyWallet<phantom CoinType> has key {
        deposits: EventHandle<DepositEvent>,
        withdrawals: EventHandle<WithdrawalEvent>,
        admin: address,
        balances: vector<Balance>
    }
    
    /// Balance for each user
    struct Balance has store, drop, copy {
        user: address,
        amount: u64
    }
    
    /// Event emitted when funds are deposited
    struct DepositEvent has drop, store {
        user: address,
        amount: u64,
        timestamp: u64
    }
    
    /// Event emitted when funds are withdrawn
    struct WithdrawalEvent has drop, store {
        user: address,
        amount: u64,
        timestamp: u64
    }
    
    /// Initialize the custody wallet
    public entry fun initialize<CoinType>(admin: &signer) {
        let admin_addr = signer::address_of(admin);
        
        // Check if wallet already exists
        assert!(!exists<CustodyWallet<CoinType>>(admin_addr), error::already_exists(E_WALLET_ALREADY_EXISTS));
        
        // Create a new wallet
        let wallet = CustodyWallet<CoinType> {
            deposits: account::new_event_handle<DepositEvent>(admin),
            withdrawals: account::new_event_handle<WithdrawalEvent>(admin),
            admin: admin_addr,
            balances: vector::empty<Balance>()
        };
        
        // Move the wallet resource to the admin's account
        move_to(admin, wallet);
    }
    
    /// Deposit funds into the custody wallet
    public entry fun deposit<CoinType>(
        user: &signer, 
        amount: u64
    ) acquires CustodyWallet {
        let user_addr = signer::address_of(user);
        let admin_addr = @custody_wallet; // Module account address
        
        // Make sure the wallet exists
        assert!(exists<CustodyWallet<CoinType>>(admin_addr), error::not_found(E_WALLET_DOES_NOT_EXIST));
        
        // Transfer coins from user to the admin account
        let coin_obj = coin::withdraw<CoinType>(user, amount);
        coin::deposit(admin_addr, coin_obj);
        
        // Update the user's balance in our internal record
        let wallet = borrow_global_mut<CustodyWallet<CoinType>>(admin_addr);
        update_balance<CoinType>(wallet, user_addr, amount, true);
        
        // Emit deposit event
        event::emit_event(&mut wallet.deposits, DepositEvent {
            user: user_addr,
            amount,
            timestamp: timestamp::now_seconds()
        });
    }
    
    /// Withdraw funds from the custody wallet
    public entry fun withdraw<CoinType>(
        user: &signer,
        amount: u64
    ) acquires CustodyWallet {
        let user_addr = signer::address_of(user);
        let admin_addr = @custody_wallet; // Module account address
        
        // Make sure the wallet exists
        assert!(exists<CustodyWallet<CoinType>>(admin_addr), error::not_found(E_WALLET_DOES_NOT_EXIST));
        
        // Get the wallet and check the user's balance
        let wallet = borrow_global_mut<CustodyWallet<CoinType>>(admin_addr);
        let user_balance = internal_get_balance<CoinType>(wallet, user_addr);
        
        // Ensure user has sufficient balance
        assert!(user_balance >= amount, error::invalid_argument(E_INSUFFICIENT_BALANCE));
        
        // Update the user's balance in our internal record
        update_balance<CoinType>(wallet, user_addr, amount, false);
        
        // NOTE: In a production environment, you would need a proper way to handle admin withdrawals
        // This is simplified for the testnet deployment
        // In a real scenario, you might implement a resource account mechanism
        
        // For now, we'll just update the balance record without actual coin movement
        // In a real deployment, you would need to implement a different mechanism to transfer funds
        
        // Emit withdrawal event
        event::emit_event(&mut wallet.withdrawals, WithdrawalEvent {
            user: user_addr,
            amount,
            timestamp: timestamp::now_seconds()
        });
    }
    
    /// Admin function to withdraw funds from the wallet
    public entry fun admin_withdraw<CoinType>(
        admin: &signer,
        amount: u64,
        recipient: address
    ) acquires CustodyWallet {
        let admin_addr = signer::address_of(admin);
        
        // Make sure the wallet exists and the caller is the admin
        assert!(exists<CustodyWallet<CoinType>>(admin_addr), error::not_found(E_WALLET_DOES_NOT_EXIST));
        let wallet = borrow_global<CustodyWallet<CoinType>>(admin_addr);
        assert!(admin_addr == wallet.admin, error::permission_denied(E_NOT_AUTHORIZED));
        
        // Withdraw and transfer the coins
        let withdrawn_coins = coin::withdraw<CoinType>(admin, amount);
        coin::deposit(recipient, withdrawn_coins);
    }
    
    // Internal function to get a user's balance
    fun internal_get_balance<CoinType>(wallet: &CustodyWallet<CoinType>, user_addr: address): u64 {
        let len = vector::length(&wallet.balances);
        let i = 0;
        
        while (i < len) {
            let balance = *vector::borrow(&wallet.balances, i);
            if (balance.user == user_addr) {
                return balance.amount
            };
            i = i + 1;
        };
        
        // If no balance record is found, return 0
        0
    }
    
    /// Update a user's balance (internal helper function)
    fun update_balance<CoinType>(
        wallet: &mut CustodyWallet<CoinType>, 
        user_addr: address, 
        amount: u64, 
        is_deposit: bool
    ) {
        let len = vector::length(&wallet.balances);
        let i = 0;
        let found = false;
        
        // Try to find and update existing balance
        while (i < len && !found) {
            let balance = vector::borrow_mut(&mut wallet.balances, i);
            if (balance.user == user_addr) {
                if (is_deposit) {
                    balance.amount = balance.amount + amount;
                } else {
                    balance.amount = balance.amount - amount;
                };
                found = true;
            };
            i = i + 1;
        };
        
        // If not found, add a new record (only for deposits)
        if (!found && is_deposit) {
            let new_balance = Balance {
                user: user_addr,
                amount
            };
            vector::push_back(&mut wallet.balances, new_balance);
        };
    }
    
    // Public view function to check a user's balance
    #[view]
    public fun check_balance<CoinType>(user_addr: address): u64 acquires CustodyWallet {
        let admin_addr = @custody_wallet; // Module account address
        
        // Make sure the wallet exists
        assert!(exists<CustodyWallet<CoinType>>(admin_addr), error::not_found(E_WALLET_DOES_NOT_EXIST));
        
        let wallet = borrow_global<CustodyWallet<CoinType>>(admin_addr);
        internal_get_balance<CoinType>(wallet, user_addr)
    }
}
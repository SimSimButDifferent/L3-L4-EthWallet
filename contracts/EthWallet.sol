// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

/* errors */
error EthWallet__DepositMustBeAboveZero();
error EthWallet__WithdrawalMustBeAboveZero();
error EthWallet__WalletIsEmpty();
error EthWallet__WithdrawalExceedsUserBalance();
error EthWallet_InsufficientContractBalance();

contract EthWallet {
    /* structs */
    struct User {
        address ownerAddress;
        uint userBalance;
        uint withdrawnToday;
        uint lastWithdrawalTime;
    }

    /* mappings */
    mapping(address => User) private users;

    /* state variables */
    uint public constant dailyWithdrawalLimit = 10 ether;
    bool private locked;
    uint currentBalance;

    modifier withdrawalLimitCheck(uint _withdrawalAmount) {
        User storage currentUser = users[msg.sender];

        // Reset withdrawal amount if a new day has started
        if (isNewDay(currentUser.lastWithdrawalTime)) {
            currentUser.withdrawnToday = 0;
        }

        // Check if the requested withdrawal exceeds the daily limit
        require(
            currentUser.withdrawnToday + _withdrawalAmount <=
                dailyWithdrawalLimit,
            "Daily withdrawal limit exceeded"
        );

        // Update user's withdrawal data
        currentUser.withdrawnToday += _withdrawalAmount;
        currentUser.lastWithdrawalTime = block.timestamp;
        _;
    }

    modifier sufficientBalance(uint _withdrawalAmount) {
        uint withdrawalAmount = _withdrawalAmount;
        currentBalance = users[msg.sender].userBalance;
        if (currentBalance == 0) {
            revert EthWallet__WalletIsEmpty();
        } else if (_withdrawalAmount > address(this).balance) {
            revert EthWallet_InsufficientContractBalance();
        } else if (_withdrawalAmount > currentBalance) {
            revert EthWallet__WithdrawalExceedsUserBalance();
        }
        _;
    }

    modifier noReeentrant() {
        require(!locked, "No re_entrancy");
        locked = true;
        _;
        locked = false;
    }

    // Helper function to determine if a new day has started
    function isNewDay(uint lastWithdrawalTime) internal view returns (bool) {
        uint currentDay = block.timestamp / 1 days;
        uint lastWithdrawalDay = lastWithdrawalTime / 1 days;
        return currentDay > lastWithdrawalDay;
    }

    function deposit() public payable {
        uint depositAmount = msg.value;

        if (depositAmount <= 0) {
            revert EthWallet__DepositMustBeAboveZero();
        }

        if (users[msg.sender].userBalance > 0) {
            users[msg.sender].userBalance += depositAmount;
        } else {
            users[msg.sender] = User(msg.sender, depositAmount, 0, 0);
        }
    }

    function withdraw(
        uint _withdrawalAmount
    )
        external
        withdrawalLimitCheck(_withdrawalAmount)
        sufficientBalance(_withdrawalAmount)
        noReeentrant
    {
        if (_withdrawalAmount <= 0) {
            revert EthWallet__WithdrawalMustBeAboveZero();
        }

        // Update user Balance
        users[msg.sender].userBalance -= _withdrawalAmount;

        // Process withdrawal
        payable(msg.sender).transfer(_withdrawalAmount);
    }

    function getUserBalance() public view returns (uint) {
        return users[msg.sender].userBalance;
    }
}

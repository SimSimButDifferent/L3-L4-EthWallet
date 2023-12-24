// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract EthWallet {
    /* structs */
    struct User {
        address ownerAddress;
        uint userBalance;
        bool walletStatus;
        uint withdrawnToday;
        uint lastWithdrawalTime;
    }

    /* mappings */
    mapping(address => User) private users;

    /* state variables */
    uint currentBalance;
    uint userCount;
    uint withdrawalAmount;
    uint public constant dailyWithdrawalLimit = 10 ether;

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
        withdrawalAmount = _withdrawalAmount;
        currentBalance = users[msg.sender].userBalance;
        require(
            withdrawalAmount <= currentBalance,
            "Amount requested exceeds wallet balance"
        );
        _;
    }

    // Helper function to determine if a new day has started
    function isNewDay(uint lastWithdrawalTime) private view returns (bool) {
        return (block.timestamp / 1 days) > (lastWithdrawalTime / 1 days);
    }

    function deposit() public payable {
        uint depositAmount = msg.value;

        if (depositAmount <= 0) {
            revert("Deposit amount must be above 0");
        }

        if (users[msg.sender].walletStatus == true) {
            users[msg.sender].userBalance += depositAmount;
        } else {
            users[msg.sender] = User(msg.sender, depositAmount, true, 0, 0);
        }
    }

    function withdraw(
        uint _withdrawalAmount
    )
        external
        withdrawalLimitCheck(_withdrawalAmount)
        sufficientBalance(_withdrawalAmount)
    {
        require(
            _withdrawalAmount <= address(this).balance,
            "Insufficient contract balance"
        );

        if (_withdrawalAmount <= 0) {
            revert("Withdrawal amount must be above 0");
        }

        if (users[msg.sender].walletStatus != true) {
            revert("Wallet does not exist");
        }

        if (_withdrawalAmount > users[msg.sender].userBalance) {
            revert("Withdrawal exceeds user balance");
        }

        // Process withdrawal
        payable(msg.sender).transfer(_withdrawalAmount);

        // Update user Balance
        users[msg.sender].userBalance -= _withdrawalAmount;
    }

    function getUserBalance() public view returns (uint) {
        return users[msg.sender].userBalance;
    }
}

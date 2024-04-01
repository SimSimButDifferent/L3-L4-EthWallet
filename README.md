## Note

For lesson 3 Code, switch to main branch 🌿

## Deployments

ZkSync - [0xc3290b06957b9A75AA1EF4a99307DFB72faE6B01](https://explorer.zksync.io/address/0xc3290b06957b9A75AA1EF4a99307DFB72faE6B01)

ZkSync testnet - [0x0729ABD1CD5d7BfE08F2d8Ce87c4C2cDD5FC7656](https://sepolia.explorer.zksync.io/address/0x0729ABD1CD5d7BfE08F2d8Ce87c4C2cDD5FC7656)

Base - [0xddfEcC36670F8F3f875587f37E4982527E9410C4](https://basescan.org/address/0xddfecc36670f8f3f875587f37e4982527e9410c4)

Base Sepolia - [0xddfEcC36670F8F3f875587f37E4982527E9410C4](https://basescan.org/address/0xddfecc36670f8f3f875587f37e4982527e9410c4)

Sepolia testnet - [0xA5cAC1cC06D664A2E778C0192BAb6D2ebf989719](https://sepolia.basescan.org/address/0xa5cac1cc06d664a2e778c0192bab6d2ebf989719)

![image](https://github.com/SimSimButDifferent/L3-EthWalletFrontEnd/assets/88177427/f888da39-3fe4-45ab-b067-ab120c51024b)

## Lesson 4 updates:

-   added events to the deposit and withdraw functions.
-   updated tests for increased coverage.
-   added .solcover file to ignore Attack.sol

## Directions for use

To play around with this code locally run the following commands in your local terminal in order:

```
git clone https://github.com/SimSimButDifferent/L3-EthWallet.git
yarn
```

Then split the terminal and run the below code in the other half:

```
yarn hardhat node
```

Finally, deploy to the hardhat node using:

```
yarn hardhat run scripts/deploy.js --network localhost
```

## Follow along with the course below!

# Lesson 4: Error Handling and Events in Solidity

**Objective:** Understand how to handle errors and emit events in Solidity, which are critical for smart contract reliability and interaction with the front end.

## Part 1: Error Handling in Solidity

**Error Handling Mechanisms:**

**require:** Used to check for conditions and revert the transaction if the condition is not met. It reverts all changes made to the state.

**revert:** Provides a way to trigger an exception and revert the transaction, often with a custom error message.

**assert:** Used for internal checks as a way to prevent conditions that should never be possible. It consumes all gas when failed.

**When to Use Each:**

Use require for input validation or to enforce proper conditions before execution.

Use revert for more complex condition checks, especially where a specific error message is helpful.

Use assert for invariants and to check for conditions that indicate a bug.

### Example: Error Handling

```solidity
pragma solidity ^0.8.0;
contract ErrorHandling { mapping(address => uint) public balance;

    function deposit() public payable {
        require(msg.value > 0, "Deposit amount must be greater than 0");
        balance[msg.sender] += msg.value;
    }

    function withdraw(uint amount) public {
        require(amount <= balance[msg.sender], "Insufficient balance");
        balance[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
    }
}
```

## Part 2: Events in Solidity

**Understanding Events:**

Events allow logging to the Ethereum blockchain.

Useful for tracking contract activity and interacting with the contract's front-end.

**Declaring and Emitting Events:**

How to declare an event and emit it in functions.

Example: Using Events

```solidity
pragma solidity ^0.8.0;

contract EventExample {
    event Deposit(address indexed sender, uint amount);
    event Withdrawal(address indexed receiver, uint amount);

    mapping(address => uint) public balance;

    function deposit() public payable {
        emit Deposit(msg.sender, msg.value);
        balance[msg.sender] += msg.value;
    }

    function withdraw(uint amount) public {
        require(amount <= balance[msg.sender], "Insufficient balance");
        emit Withdrawal(msg.sender, amount);
        balance[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
    }
}
```

# Assignments and Practical Exercises

### Assignment 1:

Write a brief essay explaining the differences between require, revert, and assert, and provide scenarios where each is appropriate.

### Exercise 1:

Create a smart contract implementing a simple banking system with functions for deposit and withdrawal. Use require statements for validating conditions.

### Exercise 2:

Modify the above contract to include events for each deposit and withdrawal action. Test the contract to ensure that events are emitted correctly.

This lesson will help you understand how to make your smart contracts more reliable and informative through proper error handling and the use of events. These concepts are essential for creating robust and user-friendly smart contracts. Once you've completed this lesson, you'll have a deeper understanding of how to manage errors and provide feedback to users and front-end applications.

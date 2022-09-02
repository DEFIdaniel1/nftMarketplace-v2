// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import '@openzeppelin/contracts/token/ERC721/IERC721.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

error Marketplace__FeePercentTooHigh();

contract Marketplace is ReentrancyGuard, Ownable {

    // STATE VARIABLES
    address payable public immutable i_feeAccount; //account that receives fees
    uint public s_feePercent; // fee percentage on sales

    constructor(uint _feePercent) {
        if(_feePercent > 10){
            revert Marketplace__FeePercentTooHigh();
        }
        i_feeAccount = payable(msg.sender);
        s_feePercent = _feePercent;
    }

    // Can change marketplace fee percent. Can never exceed 10%
    function feeChange(uint _newFee) public onlyOwner returns(uint) {
        if(_newFee > 10){
            revert Marketplace__FeePercentTooHigh();
        }
        return s_feePercent = _newFee;
    }
}
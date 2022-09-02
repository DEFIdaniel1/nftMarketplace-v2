// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import '@openzeppelin/contracts/token/ERC721/IERC721.sol';
import '@openzeppelin/contracts/interfaces/IERC721Receiver.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

error Marketplace__FeePercentTooHigh();
error Marketplace__PriceMustBeMoreThanZero();

contract Marketplace is ReentrancyGuard, Ownable {

    /////////////////////
    // STATE VARIABLES //
    /////////////////////
    address payable public immutable i_feeAccount; //account that receives marketplace fees
    uint public s_feePercent; // fee percentage on marketplace sales
    uint public s_itemCount; // tracks listed items

    struct Item{
        uint itemId;
        IERC721 nft;
        uint tokenId;
        uint price;
        address payable seller;
        bool sold;
    }
    event Listing(
        uint itemId,
        IERC721 indexed nft,
        uint tokenId,
        uint price, 
        address indexed seller
    );
    // itemId => Item
    mapping(uint => Item) public itemsMap;

    constructor(uint _feePercent) {
        if(_feePercent > 10){
            revert Marketplace__FeePercentTooHigh();
        }
        i_feeAccount = payable(msg.sender);
        s_feePercent = _feePercent;
    }

    /////////////////////
    // FUNCTIONS //
    /////////////////////
    // Can change marketplace fee percent. Can never exceed 10%
    function feeChange(uint _newFee) public onlyOwner returns(uint) {
        if(_newFee > 10){
            revert Marketplace__FeePercentTooHigh();
        }
        return s_feePercent = _newFee;
    }

    // Required for safeTransfer functions. Telling the sender that we can receive ERC721 tokens
    function onERC721Received(address, address, uint256, bytes calldata) external pure returns (bytes4) {
        return IERC721Receiver.onERC721Received.selector;
    }

    function listNFT(IERC721 _nftContract, uint _tokenId, uint _price) external nonReentrant {
        if(_price == 0){
            revert Marketplace__PriceMustBeMoreThanZero();
        }
        s_itemCount++;
        // Transfer NFT to contract
        _nftContract.safeTransferFrom(msg.sender, address(this), _tokenId);
        itemsMap[s_itemCount] = Item (
            s_itemCount,
            _nftContract,
            _tokenId,
            _price,
            payable(msg.sender),
            false
        );
        emit Listing(
         s_itemCount,
         _nftContract,
         _tokenId,
         _price, 
         msg.sender
        );
    }

    function purchaseItem() external payable nonReentrant {}


    /////////////////////
    // VIEW FUNCTIONS // 
    ////////////////////
    function getItemsMap(uint _itemCount) public view returns (Item memory) {
        return itemsMap[_itemCount];
    }
    function getTotalPrice(uint _itemId) view public returns(uint){
        uint totalPrice = (itemsMap[_itemId].price * (s_feePercent/100)) + itemsMap[_itemId].price;
        return totalPrice;
    }
}
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import '@openzeppelin/contracts/token/ERC721/IERC721.sol';
import '@openzeppelin/contracts/interfaces/IERC721Receiver.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

error Marketplace__FeePercentTooHigh();
error Marketplace__PriceMustBeMoreThanZero();
error Marketplace__TokenDoesNotExist();
error Marketplace__NotEnoughEth();
error Marketplace__ItemAlreadySold();

contract Marketplace is ReentrancyGuard, Ownable {
    /////////////////////
    // STATE VARIABLES //
    /////////////////////
    address payable public immutable i_feeAccount; //account that receives marketplace fees -> contract owner
    uint256 public s_feePercent; // fee percentage on marketplace sales
    uint256 public s_itemCount; // tracks listed items

    struct Item {
        uint256 itemId;
        IERC721 nft;
        uint256 tokenId;
        uint256 price;
        address payable seller;
        bool sold;
    }

    event Listing(
        uint256 itemId,
        IERC721 indexed nft,
        uint256 tokenId,
        uint256 price,
        address indexed seller
    );

    event Purchased(
        uint256 itemId,
        IERC721 indexed nft,
        uint256 tokenId,
        uint256 price,
        address indexed seller,
        address indexed buyer
    );

    // itemId outputs Item struct
    mapping(uint256 => Item) public itemsMap;

    // Marketplace commission fee cannot exceed 10%
    constructor(uint256 _feePercent) {
        if (_feePercent > 10) {
            revert Marketplace__FeePercentTooHigh();
        }
        i_feeAccount = payable(msg.sender);
        s_feePercent = _feePercent;
    }

    /////////////////////
    // FUNCTIONS //
    /////////////////////
    // Can change marketplace fee commission percentage. Can never exceed 10%
    function feeChange(uint256 _newFee) public onlyOwner returns (uint256) {
        if (_newFee > 10) {
            revert Marketplace__FeePercentTooHigh();
        }
        return s_feePercent = _newFee;
    }

    // Required for safeTransfer functions. 
    // Informs the sender that we can receive ERC721 tokens
    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata
    ) external pure returns (bytes4) {
        return IERC721Receiver.onERC721Received.selector;
    }

    function listNFT(
        IERC721 _nftContract,
        uint256 _tokenId,
        uint256 _price
    ) external nonReentrant {
        if (_price == 0) {
            revert Marketplace__PriceMustBeMoreThanZero();
        }
        s_itemCount++;

        // Transfers NFT to contract
        _nftContract.safeTransferFrom(msg.sender, address(this), _tokenId);
        itemsMap[s_itemCount] = Item(
            s_itemCount,
            _nftContract,
            _tokenId,
            _price,
            payable(msg.sender),
            false
        );
        emit Listing(s_itemCount, _nftContract, _tokenId, _price, msg.sender);
    }

    function purchaseNFT(uint256 _itemId) external payable nonReentrant {
        uint256 totalPrice = getTotalPrice(_itemId);
        Item storage item = itemsMap[_itemId];
        if (_itemId == 0 || _itemId > s_itemCount) {
            revert Marketplace__TokenDoesNotExist();
        }
        if (msg.value < totalPrice) {
            revert Marketplace__NotEnoughEth();
        }
        if (item.sold) {
            revert Marketplace__ItemAlreadySold();
        }
        // Transfer funds from buyer
        i_feeAccount.transfer(totalPrice - item.price);
        item.seller.transfer(item.price);
        item.sold = true;
        // Transfer NFT - Last step to prevent reentrancy
        item.nft.safeTransferFrom(address(this), msg.sender, item.tokenId);
        emit Purchased(_itemId, item.nft, item.tokenId, item.price, item.seller, msg.sender);
    }

    /////////////////////
    // VIEW & PURE FUNCTIONS //
    ////////////////////
    function getItemsMap(uint256 _itemId) public view returns (Item memory) {
        return itemsMap[_itemId];
    }

    function getTotalPrice(uint256 _itemId) public view returns (uint256) {
        uint256 totalPrice = ((itemsMap[_itemId].price * (100 + s_feePercent)) / 100);
        return totalPrice;
    }

    function getFeePercent() public view returns (uint256) {
        return s_feePercent;
    }

    function getFeeAccount() public view returns (address) {
        return address(i_feeAccount);
    }

    function getFeeAccountBalance() public view returns (uint256) {
        return i_feeAccount.balance;
    }

    function getItemCount() public view returns (uint256) {
        return s_itemCount;
    }
}

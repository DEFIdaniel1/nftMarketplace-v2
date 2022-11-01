// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';

contract NFT is ERC721URIStorage {
    // Count starts at 1
    uint256 public tokenCount;

    constructor() ERC721('GAL-XY', 'GALXY') {}

    /**
     * Mint NFT fuction
     * @param _tokenURI inputs random URI from front-end for minting 1 of 5
     */
    function mint(string memory _tokenURI) external returns (uint256) {
        tokenCount++;
        _safeMint(msg.sender, tokenCount);
        _setTokenURI(tokenCount, _tokenURI);
        return tokenCount;
    }

    function getTokenCount() public view returns (uint256) {
        return tokenCount;
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MinimalERC721 is ERC721 {
    uint256 private _tokenIds;

    constructor() ERC721("SubmissionNFT", "SNFT") {}

    function mint(address to) public returns (uint256) {
        ++_tokenIds;
        uint256 newItemId = _tokenIds;
        _mint(to, newItemId);
        return newItemId;
    }
}

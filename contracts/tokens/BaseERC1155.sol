// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BaseERC1155 is ERC1155, Ownable {
    constructor(address initialOwner)
        ERC1155("https://game2.example/api/item/{id}.json")
        Ownable(initialOwner)
    {
        _mint(msg.sender, 0, 1000, ""); // 创建1000个id为0的代币
        _mint(msg.sender, 1, 1, "");    // 创建1个id为1的代币
    }

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function mint(
        address account,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public onlyOwner {
        _mint(account, id, amount, data);
    }

    function mintBatch(
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public onlyOwner {
        _mintBatch(to, ids, amounts, data);
    }
} 
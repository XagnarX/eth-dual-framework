// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "../../contracts/tokens/BaseERC20.sol";
import "../../contracts/tokens/BaseERC721.sol";
import "../../contracts/tokens/BaseERC1155.sol";

// 创建一个同时支持 ERC721 和 ERC1155 的接收器
contract MockTokenReceiver is ERC721Holder, ERC1155Holder {}

contract TokensTest is Test, ERC721Holder, ERC1155Holder {
    BaseERC20 public baseERC20;
    BaseERC721 public baseERC721;
    BaseERC1155 public baseERC1155;
    
    address public owner;
    address public user;

    function setUp() public {
        owner = address(this);
        user = makeAddr("user");

        // 部署合约
        baseERC20 = new BaseERC20(owner);
        baseERC721 = new BaseERC721(owner);
        baseERC1155 = new BaseERC1155(owner);

        // 确保用户可以接收 ERC721 和 ERC1155 代币
        vm.startPrank(user);
        vm.etch(user, address(new MockTokenReceiver()).code);
        vm.stopPrank();
    }

    function testERC20InitialSupply() public view {
        assertEq(baseERC20.totalSupply(), 1000000 * 10**18);
    }

    function testERC20Mint() public {
        baseERC20.mint(user, 1000);
        assertEq(baseERC20.balanceOf(user), 1000);
    }

    function testERC721Mint() public {
        baseERC721.safeMint(user, "ipfs://test");
        assertEq(baseERC721.ownerOf(0), user);
        assertEq(baseERC721.tokenURI(0), "ipfs://test");
    }

    function testERC1155InitialBalance() public view {
        assertEq(baseERC1155.balanceOf(owner, 0), 1000);
        assertEq(baseERC1155.balanceOf(owner, 1), 1);
    }

    function testERC1155Mint() public {
        baseERC1155.mint(user, 2, 500, "");
        assertEq(baseERC1155.balanceOf(user, 2), 500);
    }

    function testERC1155BatchMint() public {
        uint256[] memory ids = new uint256[](2);
        ids[0] = 2;
        ids[1] = 3;
        
        uint256[] memory amounts = new uint256[](2);
        amounts[0] = 100;
        amounts[1] = 200;

        baseERC1155.mintBatch(user, ids, amounts, "");
        
        assertEq(baseERC1155.balanceOf(user, 2), 100);
        assertEq(baseERC1155.balanceOf(user, 3), 200);
    }
} 
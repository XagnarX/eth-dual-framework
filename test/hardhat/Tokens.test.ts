import { expect } from "chai";
import { ethers } from "hardhat";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { BaseERC20, BaseERC721, BaseERC1155 } from "../../typechain-types";

describe("Token Contracts", function () {
    let owner: HardhatEthersSigner;
    let user: HardhatEthersSigner;
    let baseERC20: BaseERC20;
    let baseERC721: BaseERC721;
    let baseERC1155: BaseERC1155;

    beforeEach(async function () {
        [owner, user] = await ethers.getSigners();

        // 部署合约
        const BaseERC20 = await ethers.getContractFactory("BaseERC20");
        baseERC20 = await BaseERC20.deploy(owner.address);

        const BaseERC721 = await ethers.getContractFactory("BaseERC721");
        baseERC721 = await BaseERC721.deploy(owner.address);

        const BaseERC1155 = await ethers.getContractFactory("BaseERC1155");
        baseERC1155 = await BaseERC1155.deploy(owner.address);
    });

    describe("BaseERC20", function () {
        it("Should have correct initial supply", async function () {
            const expectedSupply = ethers.parseEther("1000000");
            expect(await baseERC20.totalSupply()).to.equal(expectedSupply);
        });

        it("Should allow owner to mint", async function () {
            await baseERC20.mint(user.address, 1000);
            expect(await baseERC20.balanceOf(user.address)).to.equal(1000);
        });
    });

    describe("BaseERC721", function () {
        it("Should mint NFT correctly", async function () {
            await baseERC721.safeMint(user.address, "ipfs://test");
            expect(await baseERC721.ownerOf(0)).to.equal(user.address);
            expect(await baseERC721.tokenURI(0)).to.equal("ipfs://test");
        });
    });

    describe("BaseERC1155", function () {
        it("Should have correct initial balances", async function () {
            expect(await baseERC1155.balanceOf(owner.address, 0)).to.equal(1000);
            expect(await baseERC1155.balanceOf(owner.address, 1)).to.equal(1);
        });

        it("Should mint tokens correctly", async function () {
            await baseERC1155.mint(user.address, 2, 500, "0x");
            expect(await baseERC1155.balanceOf(user.address, 2)).to.equal(500);
        });
    });
}); 
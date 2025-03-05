import { ethers, run, network } from "hardhat";

async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function verifyContractWithRetry(name: string, address: string, deployer: string, maxRetries = 3, delayMs = 5000) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        console.log(`Verifying ${name} on ${network.name} (Attempt ${attempt}/${maxRetries})...`);
        try {
            await run("verify:verify", {
                address: address,
                constructorArguments: [deployer],
            });
            console.log(`${name} verified successfully on ${network.name}`);
            return true;
        } catch (error: any) {
            if (error?.message?.includes('Already Verified')) {
                console.log(`${name} is already verified on ${network.name}`);
                return true;
            }

            if (attempt === maxRetries) {
                console.error(`Error verifying ${name} on ${network.name}:`, error);
                return false;
            }

            console.log(`Verification failed, retrying in ${delayMs/1000} seconds...`);
            await sleep(delayMs);
        }
    }
    return false;
}

async function main() {
    // 获取命令行参数（跳过 node 和脚本路径）
    const args = process.argv.slice(2);
    const contracts = new Map<string, { name: string, address: string }>();

    // 解析参数
    for (let i = 0; i < args.length; i += 2) {
        const flag = args[i];
        const address = args[i + 1];
        
        if (!address) {
            console.error(`Missing address for ${flag}`);
            continue;
        }

        switch (flag) {
            case '--erc20':
                contracts.set('erc20', { name: 'BaseERC20', address });
                break;
            case '--erc721':
                contracts.set('erc721', { name: 'BaseERC721', address });
                break;
            case '--erc1155':
                contracts.set('erc1155', { name: 'BaseERC1155', address });
                break;
        }
    }

    // 如果没有提供任何参数，尝试从环境变量获取
    if (contracts.size === 0) {
        if (process.env.BASE_ERC20_ADDRESS) {
            contracts.set('erc20', { 
                name: 'BaseERC20', 
                address: process.env.BASE_ERC20_ADDRESS 
            });
        }
        if (process.env.BASE_ERC721_ADDRESS) {
            contracts.set('erc721', { 
                name: 'BaseERC721', 
                address: process.env.BASE_ERC721_ADDRESS 
            });
        }
        if (process.env.BASE_ERC1155_ADDRESS) {
            contracts.set('erc1155', { 
                name: 'BaseERC1155', 
                address: process.env.BASE_ERC1155_ADDRESS 
            });
        }
    }

    // 如果还是没有地址，显示使用说明
    if (contracts.size === 0) {
        console.log(`
Usage: 
    yarn verify:<network> --erc20 <address>
    yarn verify:<network> --erc721 <address>
    yarn verify:<network> --erc1155 <address>

Multiple contracts:
    yarn verify:<network> --erc20 <address> --erc721 <address> --erc1155 <address>

Example:
    yarn verify:sepolia --erc20 0x123... --erc721 0x456...

Or set addresses in .env file:
    BASE_ERC20_ADDRESS=<address>
    BASE_ERC721_ADDRESS=<address>
    BASE_ERC1155_ADDRESS=<address>
        `);
        return;
    }

    // 获取部署者地址
    const [deployer] = await ethers.getSigners();

    // 验证提供了地址的合约
    console.log(`Verifying ${contracts.size} contract(s) on ${network.name}...`);
    
    let successCount = 0;
    let failCount = 0;
    
    for (const [type, contract] of contracts) {
        console.log(`\nProcessing ${contract.name}...`);
        const success = await verifyContractWithRetry(
            contract.name, 
            contract.address, 
            deployer.address,
            3,  // 最大重试次数
            5000 // 重试延迟（毫秒）
        );
        if (success) {
            successCount++;
        } else {
            failCount++;
        }
    }

    // 打印总结
    console.log(`\nVerification Summary:`);
    console.log(`Total: ${contracts.size}`);
    console.log(`Success: ${successCount}`);
    console.log(`Failed: ${failCount}`);

    // 如果有失败的验证，返回非零退出码
    if (failCount > 0) {
        process.exit(1);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    }); 
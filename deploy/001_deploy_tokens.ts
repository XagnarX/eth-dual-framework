import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deployments, getNamedAccounts } = hre;
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    // 部署 BaseERC20
    const baseERC20 = await deploy('BaseERC20', {
        from: deployer,
        args: [deployer],
        log: true,
        waitConfirmations: 5,
    });

    // 部署 BaseERC721
    const baseERC721 = await deploy('BaseERC721', {
        from: deployer,
        args: [deployer],
        log: true,
        waitConfirmations: 5,
    });

    // 部署 BaseERC1155
    const baseERC1155 = await deploy('BaseERC1155', {
        from: deployer,
        args: [deployer],
        log: true,
        waitConfirmations: 5,
    });

    // // 验证合约
    // if (hre.network.name !== 'hardhat' && hre.network.name !== 'localhost') {
    //     try {
    //         console.log('Verifying BaseERC20...');
    //         await hre.run('verify:verify', {
    //             address: baseERC20.address,
    //             constructorArguments: [deployer],
    //         });

    //         console.log('Verifying BaseERC721...');
    //         await hre.run('verify:verify', {
    //             address: baseERC721.address,
    //             constructorArguments: [deployer],
    //         });

    //         console.log('Verifying BaseERC1155...');
    //         await hre.run('verify:verify', {
    //             address: baseERC1155.address,
    //             constructorArguments: [deployer],
    //         });
    //     } catch (error) {
    //         console.error('Error verifying contracts:', error);
    //     }
    // }
};

export default func;
func.tags = ['Tokens']; 
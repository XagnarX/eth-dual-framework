import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  // 这里可以添加您的合约部署逻辑
  // 例如部署 BaseERC20, BaseERC721, BaseERC1155
};

export default func;
func.tags = ['Base']; 
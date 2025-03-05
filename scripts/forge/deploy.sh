#!/bin/bash

# 检查网络参数
NETWORK=$1
if [ -z "$NETWORK" ]; then
    echo "Usage: ./deploy.sh <network>"
    echo "Networks: holesky, sepolia"
    echo "Example: ./deploy.sh holesky"
    exit 1
fi

# 加载环境变量
source .env

# 根据网络选择 RPC URL 和私钥
if [ "$NETWORK" = "sepolia" ]; then
    RPC_URL=$SEPOLIA_URL
    PRIVATE_KEY=$SEPOLIA_PRIVATE_KEY
else
    RPC_URL=$HOLESKY_URL
    PRIVATE_KEY=$HOLESKY_PRIVATE_KEY
fi

# 部署合约
echo "Deploying contracts to $NETWORK..."

# 部署 BaseERC20
echo "Deploying BaseERC20..."
DEPLOYER=$(cast wallet address --private-key $PRIVATE_KEY)
BASE_ERC20=$(forge create --rpc-url $RPC_URL \
    --private-key $PRIVATE_KEY \
    contracts/tokens/BaseERC20.sol:BaseERC20 \
    --constructor-args $DEPLOYER \
    --verify \
    --etherscan-api-key $ETHERSCAN_API_KEY)
echo "BaseERC20 deployed to: $BASE_ERC20"

# 部署 BaseERC721
echo "Deploying BaseERC721..."
BASE_ERC721=$(forge create --rpc-url $RPC_URL \
    --private-key $PRIVATE_KEY \
    contracts/tokens/BaseERC721.sol:BaseERC721 \
    --constructor-args $DEPLOYER \
    --verify \
    --etherscan-api-key $ETHERSCAN_API_KEY)
echo "BaseERC721 deployed to: $BASE_ERC721"

# 部署 BaseERC1155
echo "Deploying BaseERC1155..."
BASE_ERC1155=$(forge create --rpc-url $RPC_URL \
    --private-key $PRIVATE_KEY \
    contracts/tokens/BaseERC1155.sol:BaseERC1155 \
    --constructor-args $DEPLOYER \
    --verify \
    --etherscan-api-key $ETHERSCAN_API_KEY)
echo "BaseERC1155 deployed to: $BASE_ERC1155"

# 打印部署总结
echo -e "\nDeployment Summary on $NETWORK:"
echo "BaseERC20: $BASE_ERC20"
echo "BaseERC721: $BASE_ERC721"
echo "BaseERC1155: $BASE_ERC1155"

# 提示用户更新 .env 文件
echo -e "\nPlease update your .env file with these addresses:"
echo "BASE_ERC20_ADDRESS=$BASE_ERC20"
echo "BASE_ERC721_ADDRESS=$BASE_ERC721"
echo "BASE_ERC1155_ADDRESS=$BASE_ERC1155" 
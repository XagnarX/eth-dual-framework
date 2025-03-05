#!/bin/bash

# 检查参数
if [ "$#" -eq 0 ]; then
    echo "Usage: ./verify.sh [--network <network>] [--erc20 <address>] [--erc721 <address>] [--erc1155 <address>]"
    echo "Networks: holesky, sepolia"
    echo "Example: ./verify.sh --network holesky --erc20 0x123... --erc721 0x456..."
    exit 1
fi

# 加载环境变量
source .env

# 解析参数
NETWORK="holesky"  # 默认网络
while [[ $# -gt 0 ]]; do
    case $1 in
        --network)
            NETWORK="$2"
            shift 2
            ;;
        --erc20)
            ERC20_ADDRESS="$2"
            shift 2
            ;;
        --erc721)
            ERC721_ADDRESS="$2"
            shift 2
            ;;
        --erc1155)
            ERC1155_ADDRESS="$2"
            shift 2
            ;;
        *)
            echo "Unknown parameter: $1"
            exit 1
            ;;
    esac
done

# 获取部署者地址
DEPLOYER=$(cast wallet address)

# 根据网络选择 RPC URL
if [ "$NETWORK" = "sepolia" ]; then
    RPC_URL=$SEPOLIA_URL
    PRIVATE_KEY=$SEPOLIA_PRIVATE_KEY
else
    RPC_URL=$HOLESKY_URL
    PRIVATE_KEY=$HOLESKY_PRIVATE_KEY
fi

# 验证合约
if [ ! -z "$ERC20_ADDRESS" ]; then
    echo "Verifying BaseERC20 at $ERC20_ADDRESS on $NETWORK..."
    forge verify-contract $ERC20_ADDRESS \
        contracts/tokens/BaseERC20.sol:BaseERC20 \
        --constructor-args $(cast abi-encode "constructor(address)" $DEPLOYER) \
        --etherscan-api-key $ETHERSCAN_API_KEY \
        --chain $NETWORK
fi

if [ ! -z "$ERC721_ADDRESS" ]; then
    echo "Verifying BaseERC721 at $ERC721_ADDRESS on $NETWORK..."
    forge verify-contract $ERC721_ADDRESS \
        contracts/tokens/BaseERC721.sol:BaseERC721 \
        --constructor-args $(cast abi-encode "constructor(address)" $DEPLOYER) \
        --etherscan-api-key $ETHERSCAN_API_KEY \
        --chain $NETWORK
fi

if [ ! -z "$ERC1155_ADDRESS" ]; then
    echo "Verifying BaseERC1155 at $ERC1155_ADDRESS on $NETWORK..."
    forge verify-contract $ERC1155_ADDRESS \
        contracts/tokens/BaseERC1155.sol:BaseERC1155 \
        --constructor-args $(cast abi-encode "constructor(address)" $DEPLOYER) \
        --etherscan-api-key $ETHERSCAN_API_KEY \
        --chain $NETWORK
fi 
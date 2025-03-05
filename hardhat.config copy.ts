import "@typechain/hardhat"
import "hardhat-abi-exporter"
import "@solidstate/hardhat-bytecode-exporter"
import "solidity-coverage"
import "@nomiclabs/hardhat-ethers"
import "@openzeppelin/hardhat-upgrades"
import "hardhat-preprocessor"
import fs from "fs"
import { TASK_COMPILE_SOLIDITY_GET_SOURCE_PATHS } from "hardhat/builtin-tasks/task-names";
import { subtask } from "hardhat/config";
import "./tasks/deploy"
import "./tasks/overflow_test"
import "./tasks/check"
import "./tasks/query"
import "./tasks/proxy_upgrade"
import "./tasks/verifier_upgrade"
// import "./tasks/upgrades"
import "./src/plugin"
import * as process from "process";
require("@nomiclabs/hardhat-etherscan")
function getRemappings() {
    return fs
        .readFileSync("remappings.txt", "utf8")
        .split("\n")
        .filter(Boolean) // remove empty lines
        .map((line) => line.trim().split("="));
}
// prune forge style tests from hardhat paths
subtask(TASK_COMPILE_SOLIDITY_GET_SOURCE_PATHS).setAction(async (_, __, runSuper) => {
    const paths = await runSuper();
    return paths.filter((p: string) => !p.endsWith(".t.sol")).filter((p: string) => !p.includes("test/mocks"));
});
const DEPLOYER_PK = process.env.DEPLOYER_PRIVATE_KEY || '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'
const QA_URL = process.env.QA_RPC_URL || 'http://127.0.0.1:8545'
const SEPOLIA_URL = process.env.SEPOLIA_RPC_URL || 'http://127.0.0.1:8545'
const HOLESKY_URL = process.env.HOLESKY_RPC_URL || 'http://127.0.0.1:8545'
module.exports = {
    defaultNetwork: 'hardhat',
    defender: {
        apiKey: "[apiKey]",
        apiSecret: "[apiSecret]",
    },
    abiExporter: {
        path: './abi',
        runOnCompile: true,
        clear: true,
    },
    bytecodeExporter: {
        path: './data',
        runOnCompile: true,
        clear: true,
        // flat: true,
        // only: [':ERC20$'],
    },
    etherscan: {
        apiKey: {
          morph: 'C3ZZFD1958HDFRY8XDCUQ9JCN6J3PFIVY3',
          mainnet: 'C3ZZFD1958HDFRY8XDCUQ9JCN6J3PFIVY3',
          holesky: 'C3ZZFD1958HDFRY8XDCUQ9JCN6J3PFIVY3',
          ql2: '123456'
        },
        customChains: [
          {
            network: "ql2",
            chainId: 53077,
            urls: {
                apiURL: "http://l2-qa-morph-explorer-api.bitkeep.tools/api",
                browserURL: "http://l2-qa-morph-explorer-api.bitkeep.tools",
            }
          }, 
          {
            network: "holesky",
            chainId: 17000,
            urls: {
              apiURL: "https://api-holesky.etherscan.io/api",
              browserURL: "https://holesky.etherscan.io",
            }
          },
          {
            network: "mainnet",
            chainId: 1,
            urls: {
              apiURL: "https://api.etherscan.io/api",
              browserURL: "https://etherscan.io",
            }
          },
          {
            network: "morph",
            chainId: 2818,
            urls: {
              apiURL: "https://explorer-api.morphl2.io/api",
              browserURL: "https://explorer.morphl2.io",
            }
          }
        ]
      },
    networks: {
        hardhat: {
            allowUnlimitedContractSize: true,
            chainId: 900,
        },
        dl1: {
            url: "http://10.11.56.77:9545",
            chainId: 900,
            gas: 'auto',
            gasPrice: 'auto',
            accounts: [DEPLOYER_PK]
        },
        dl2: {
            url: "http://10.11.56.77:8545",
            chainId: 53077,
            gas: 'auto',
            gasPrice: 'auto',
            accounts: [DEPLOYER_PK],
        },
        l1: {
            url: "http://127.0.0.1:9545",
            chainId: 900,
            gas: 'auto',
            gasPrice: 'auto',
            accounts: [DEPLOYER_PK]
        },
        l2: {
            url: "http://127.0.0.1:8545",
            chainId: 53077,
            gas: 'auto',
            gasPrice: 'auto',
            accounts: [DEPLOYER_PK],
        },
        ql1: {
            url: "http://l2-qa-morph-l1-geth.bitkeep.tools",
            chainId: 900,
            gas: 'auto',
            gasPrice: 'auto',
            accounts: ['0xc3b334eb3bf42f27c1100f36179395662cc7661a210597e26e158cd373f2d982']
        },
        ql2: {
            url: "http://l2-qa-morph-sentry-0.bitkeep.tools",
            chainId: 53077,
            gas: 'auto',
            gasPrice: 'auto',
            accounts: ['0x2035516063ca7724d93e1bfaa01137457355f8e9e1d6cf28cff84def7a478c18']
        },
        holesky: {
            url: "https://ethereum-holesky.publicnode.com",
            chainId: 17000,
            gas: 'auto',
            gasPrice: 'auto',
            accounts: ['0x240e5ceacef799c721889dfbdf8777bb7caa1a4807d6e8421eb600afd16657e5']
        },
        hl2: {
            url: "https://rpc-holesky.morphl2.io",
            chainId: 2810,
            gas: 'auto',
            gasPrice: 'auto',
            accounts: ['0xde36b04053d72e8083018cd1259e11fbaae7567c4214aab6522be996c67e9846']
        },
        mainnet: {
            url: "https://eth.llamarpc.com",
            chainId: 1,
            gas: 'auto',
            gasPrice: 'auto',
            accounts: ['aaa258c6f776ef7a69117f981b56ba2158e50db48a3cd499986f0d51d4b2bfea']
        },
        morph: {
            url: "https://rpc.morphl2.io",
            chainId: 2818,
            gas: 'auto',
            gasPrice: 'auto',
            accounts: ['aaa258c6f776ef7a69117f981b56ba2158e50db48a3cd499986f0d51d4b2bfea']
        }
    },
    foundry: {
        buildInfo: true,
    },
    solidity: {
        compilers: [
            {
                version: '0.8.24',
                settings: {
                    metadata: { bytecodeHash: 'none' },
                    optimizer: { enabled: true, runs: 10_000 },
                    evmVersion: 'cancun',
                },
            },
        ],
        // compileUsingRemoteVersion: 'v0.8.23+commit.69122e07',
    },
    // gasReporter: {
    //     enabled: true,
    //     showMethodSig: true,
    //     maxMethodDiff: 10,
    // },
    contractSizer: {
        alphaSort: true,
        runOnCompile: true,
        disambiguatePaths: false,
    },
    preprocess: {
        eachLine: (hre) => ({
            transform: (line: string) => {
                if (line.match(/^\s*import /i)) {
                    for (const [from, to] of getRemappings()) {
                        if (line.includes(from)) {
                            line = line.replace(from, to);
                            break;
                        }
                    }
                }
                return line;
            },
        }),
    },
    paths: {
        sources: "./contracts",
        tests: "./integration-test",
        cache: "./cache-hardhat",
        artifacts: "./artifacts",
        deployConfig: './src/deploy-config',
    }
}
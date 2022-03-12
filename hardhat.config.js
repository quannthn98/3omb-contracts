require("@nomiclabs/hardhat-waffle")
require("@nomiclabs/hardhat-etherscan")
const privateKey = 'aa5c61ea76688904ca894eef6c6ffd8b511dafa71f59a5ea67462d69ab432a7e';
const testNetNode = 'https://rpc.testnet.fantom.network/'
const avaxNode = 'https://rpc.ankr.com/avalanche';
const mainnetNode = 'https://rpc.ftm.tools/'
module.exports = {
    defaultNetwork: 'opera',
    networks: {
        hardhat: {
        },
        opera: {
            url: `${mainnetNode}`,
            accounts: [`${privateKey}`]
        },
        avax: {
            url: `${avaxNode}`,
            accounts: [`${privateKey}`]
        },
        ftmTestNet: {
            url: `${testNetNode}`,
            accounts: [`${privateKey}`]
        }
    },
    solidity: {
        compilers: [{
            version: "0.6.12",
            settings: {
                optimizer: {
                    enabled: true,
                    runs: 200
                }
            }
        }, {
            version: "0.8.7",
            settings: {
                optimizer: {
                    enabled: true,
                    runs: 200
                }
            }
        }]
    },
    etherscan: {
        // Your API key for Etherscan
        // Obtain one at https://bscscan.com/
        apiKey: '7Q1UW67KPK3ZVB6KXPDGVBQN3N5TQSFFTX'
    }
}

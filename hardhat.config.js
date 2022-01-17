require("@nomiclabs/hardhat-waffle")
module.exports = {
    networks: {
        hardhat: {},
        ropsten: {
            url: "https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
            accounts: []
        },
        fantom: {
            url: "https://rpc.ftm.tools",
            accounts: []
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
    }
}
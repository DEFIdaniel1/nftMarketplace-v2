require('@nomiclabs/hardhat-waffle')
require('@nomicfoundation/hardhat-chai-matchers')
require('ethers')
require('dotenv').config()
const PRIVATE_KEY = process.env.REACT_APP_PRIVATE_KEY
const GOERLI_URL = process.env.REACT_APP_GOERLI_URL

module.exports = {
    solidity: '0.8.4',
    paths: {
        artifacts: './src/backend/artifacts',
        sources: './src/backend/contracts',
        cache: './src/backend/cache',
        tests: './src/backend/test',
    },
    defaultNetwork: 'hardhat',
    networks: {
        goerli: {
            url: GOERLI_URL,
            accounts: [PRIVATE_KEY],
            chainId: 5,
            blockConfirmations: 6,
        },
    },
}

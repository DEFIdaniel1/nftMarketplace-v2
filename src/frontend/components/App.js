import { useState } from 'react'
import { ethers } from 'ethers'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.scss'

import Navbar from './Navbar'
import Mint from './Mint'
// import Buy from './Buy'
import Home from './Home'
import LoadingSpinner from './LoadingSpinner'

import NFTAbi from '../contractsData/NFT.json'
import NFTAddress from '../contractsData/NFT-address.json'
import MarketplaceAddress from '../contractsData/Marketplace-address.json'
import MarketplaceAbi from '../contractsData/Marketplace.json'

function App() {
    const [loading, setLoading] = useState(true)
    const [account, setAccount] = useState(null)
    const [nft, setNFT] = useState({})
    const [marketplace, setMarketplace] = useState({})
    // connect to metmask
    const web3Handler = async () => {
        // returns array of accounts.
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        // 1st account listed is the one connected to the app
        setAccount(accounts[0])
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        await provider.send('eth_requestAccounts', []) // Metamask requires requesting permissions to connect
        const signer = provider.getSigner()
        setLoading(false)
        loadContracts(signer)
    }

    const loadContracts = async (signer) => {
        // fetch deployed contract copies
        const marketplace = new ethers.Contract(
            MarketplaceAddress.address,
            MarketplaceAbi.abi,
            signer
        )
        setMarketplace(marketplace)
        const nft = new ethers.Contract(NFTAddress.address, NFTAbi.abi, signer)
        setNFT(nft)
        console.log('contracts loaded')
    }

    return (
        <div>
            <BrowserRouter>
                <Navbar connectWallet={web3Handler} account={account} />
                {loading && <LoadingSpinner />}
                {!loading && (
                    <Routes>
                        <Route path="/" element={<Home marketplace={marketplace} nft={nft} />} />
                        <Route
                            path="mint"
                            element={<Mint marketplace={marketplace} nft={nft} account={account} />}
                        />
                        {/* <Route path="buy" element={<Buy />} /> */}
                        <Route path="/*" element={<Home marketplace={marketplace} nft={nft} />} />
                    </Routes>
                )}
            </BrowserRouter>
        </div>
    )
}
export default App

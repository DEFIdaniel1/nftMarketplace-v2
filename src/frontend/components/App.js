import { useState } from 'react'
import { ethers } from 'ethers'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import './App.scss'
import Navbar from './Navbar'
import Mint from './Mint'
import Home from './Home'
import LoadingSpinner from './LoadingSpinner'
import MyListings from './MyListings'

import NFTAbi from '../contractsData/NFT.json'
import NFTAddress from '../contractsData/NFT-address.json'
import MarketplaceAddress from '../contractsData/Marketplace-address.json'
import MarketplaceAbi from '../contractsData/Marketplace.json'
import MyPurchases from './MyPurchases'

function App() {
    const [loading, setLoading] = useState(true)
    const [account, setAccount] = useState(null)
    const [nft, setNFT] = useState({})
    const [marketplace, setMarketplace] = useState({})
    const [itemCount, setItemCount] = useState('')
    // connect to metmask
    const web3Handler = async () => {
        // returns array of user's accounts
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
        const checkItemCount = await marketplace.getItemCount()
        setItemCount(checkItemCount)
    }

    return (
        <div>
            <BrowserRouter>
                <Navbar connectWallet={web3Handler} account={account} />
                {loading && (
                    <div className="center-spinner">
                        <LoadingSpinner
                            title="Click 'Connect'"
                            subtitle="load your web3 wallet..."
                        />
                    </div>
                )}
                {!loading && (
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <Home marketplace={marketplace} nft={nft} itemCount={itemCount} />
                            }
                        />
                        <Route
                            path="mint"
                            element={<Mint marketplace={marketplace} nft={nft} account={account} />}
                        />
                        <Route
                            path="my-listings"
                            element={
                                <MyListings
                                    marketplace={marketplace}
                                    nft={nft}
                                    account={account}
                                    itemCount={itemCount}
                                />
                            }
                        />
                        <Route
                            path="my-purchases"
                            element={
                                <MyPurchases
                                    marketplace={marketplace}
                                    nft={nft}
                                    account={account}
                                    itemCount={itemCount}
                                />
                            }
                        />
                        <Route
                            path="/*"
                            element={
                                <Home marketplace={marketplace} nft={nft} itemCount={itemCount} />
                            }
                        />
                    </Routes>
                )}
            </BrowserRouter>
        </div>
    )
}
export default App

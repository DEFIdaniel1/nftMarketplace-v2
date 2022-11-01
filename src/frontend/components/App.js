import { useState } from 'react'
import { ethers } from 'ethers'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import './App.scss'
import Navbar from './Navbar'
import Mint from './Mint'
import Home from './Home'
import MyListings from './MyListings'
import Listings from './Listings'

import NFTAbi from '../contractsData/NFT.json'
import NFTAddress from '../contractsData/NFT-address.json'
import MarketplaceAddress from '../contractsData/Marketplace-address.json'
import MarketplaceAbi from '../contractsData/Marketplace.json'
import MyPurchases from './MyPurchases'
import { useEffect } from 'react'

function App() {
    // App-wide state variables, including connected contracts
    const [loading, setLoading] = useState(true)
    const [account, setAccount] = useState(null)
    const [nft, setNFT] = useState({})
    const [marketplace, setMarketplace] = useState({})
    const [itemCount, setItemCount] = useState('')

    // Connect user via metamask
    const web3Login = async () => {
        // Returns array of user's accounts, [0] is the one connecting
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        setAccount(accounts[0])

        // New provider connects to the blockchain. Connect via signer
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        await provider.send('eth_requestAccounts', []) // Requests permission to connect
        const signer = provider.getSigner()
        setLoading(false)

        // Use the signer as provider to fetch contracts
        loadContracts(signer)
        localStorage.setItem('wallet', accounts[0])
    }

    // Disconnect from user's metamask
    const web3Logout = () => {
        setAccount(null)
        setLoading(true)
        localStorage.clear()
    }

    // Connects to deployed contracts for the app
    const loadContracts = async (signer) => {
        // Sets marketplace contract
        const marketplaceContract = new ethers.Contract(
            MarketplaceAddress.address,
            MarketplaceAbi.abi,
            signer
        )
        setMarketplace(marketplaceContract)

        // Sets NFT contract
        const nftContract = new ethers.Contract(NFTAddress.address, NFTAbi.abi, signer)
        setNFT(nftContract)
        console.log('contracts loaded')

        // Gets total number of listings
        const checkItemCount = await marketplaceContract.getItemCount()
        setItemCount(checkItemCount)
    }

    // On load, check if wallet is connected, reconnect if they did not disconnect
    useEffect(() => {
        if (localStorage.getItem('wallet') != null) {
            console.log(localStorage.getItem('wallet'))
            web3Login()
        }
    }, [])

    return (
        <div>
            <BrowserRouter>
                <Navbar connectWallet={web3Login} disconnectWallet={web3Logout} account={account} />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route
                        path="/listings"
                        element={
                            <Listings
                                marketplace={marketplace}
                                nft={nft}
                                itemCount={itemCount}
                                loading={loading}
                            />
                        }
                    />
                    <Route
                        path="mint"
                        element={
                            <Mint
                                marketplace={marketplace}
                                nft={nft}
                                account={account}
                                loading={loading}
                            />
                        }
                    />
                    <Route
                        path="my-listings"
                        element={
                            <MyListings
                                marketplace={marketplace}
                                nft={nft}
                                account={account}
                                itemCount={itemCount}
                                loading={loading}
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
                                loading={loading}
                            />
                        }
                    />
                    <Route
                        path="/*"
                        element={<Home marketplace={marketplace} nft={nft} itemCount={itemCount} />}
                    />
                </Routes>
                <div className="cCopy">Copyright DEFIdaniel1 2022.</div>
            </BrowserRouter>
        </div>
    )
}
export default App

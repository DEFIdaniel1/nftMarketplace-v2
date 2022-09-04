import { useState } from 'react'
import { ethers } from 'ethers'
import './App.css'

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
        const provider = new ethers.provider.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        loadContracts(signer)
        setLoading(false)
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
    }

    return (
        <div>
            <h1>The Market</h1>
            <h2>The NFT Marketplace</h2>
            <p>Y'know testing testing 123.</p>
        </div>
    )
}
export default App

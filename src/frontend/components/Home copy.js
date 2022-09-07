import { useEffect } from 'react'
import { useState } from 'react'
import { ethers } from 'ethers'

import LoadingSpinner from './LoadingSpinner'

const Home = ({ marketplace, nft, account }) => {
    const [loadingMarketplace, setLoadingMarketplace] = useState(true)
    const [items, setItems] = useState([])

    useEffect(() => {
        setLoadingMarketplace(true)
        // const itemsArray = []
        const loadMarketplaceItems = async () => {
            const nftCount = await nft.balanceOf(account)
            console.log('nftcount' + nftCount)
            const itemCount = await marketplace.getItemCount()
            for (let i = 1; i <= itemCount; i++) {
                const item = await marketplace.getItemsMap(i)
                if (!item.sold) {
                    const uri = await nft.tokenURI(item.tokenId) //built in interface contract
                    const totalPrice = await marketplace.getTotalPrice(item.itemId)
                    // use uri to get IPFS metadata
                    const response = await fetch(uri)
                    const metadata = await response.json()
                    const newItem = {
                        totalPrice,
                        itemId: item.itemId,
                        seller: item.seller,
                        name: metadata.name,
                        description: metadata.description,
                        image: metadata.image,
                    }
                    setItems((arr) => [...arr, newItem])
                }
            }
            // setItems(itemsArray)
        }
        loadMarketplaceItems()
        setLoadingMarketplace(false)
    }, [])

    // const buyMarketItem = async (item) => {
    //     const buyTx = await marketplace.purchaseNFT(item.itemId, { value: item.totalPrice })
    //     await buyTx.wait()
    //     // loadMarketplaceItems() // reload after purchase will remove the purchased item
    // }

    return (
        <div>
            {loadingMarketplace && (
                <div>
                    <h1>Loading marketplace items...</h1>
                    <LoadingSpinner />
                </div>
            )}
            {!loadingMarketplace && items.length === 0 && <div>No NFTs listed...</div>}
            {!loadingMarketplace && items.length > 0 && items.length > 0 && (
                <div>
                    {items.map((item, idx) => (
                        <div key={idx}>
                            <h2>{item.name}</h2>
                            <img src={item.image} alt={`NFT ${item.name}`} />
                            <p>{item.description}</p>
                            <h3>Price: {ethers.utils.formatEther(item.totalPrice)} ETH</h3>
                            <button>Buy NFT</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Home

import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import './Home.scss'

import LoadingSpinner from './LoadingSpinner'

const Home = ({ marketplace, nft, itemCount }) => {
    const [items, setItems] = useState([])
    const [soldItems, setSoldItems] = useState([])
    const [loadingMarketplace, setLoadingMarketplace] = useState(true)

    const loadMarketplaceItems = async () => {
        for (let i = 1; i <= itemCount; i++) {
            const item = await marketplace.getItemsMap(i)
            const uri = await nft.tokenURI(item.tokenId)
            const totalPrice = await marketplace.getTotalPrice(item.itemId)
            // use uri to get IPFS metadata
            const response = await fetch(uri)
            const metadata = await response.json()
            const newItem = {
                totalPrice,
                itemId: item.itemId.toString(),
                seller: item.seller.toString(),
                name: metadata.name.toString(),
                description: metadata.description.toString(),
                image: metadata.image.toString(),
                sold: item.sold,
            }
            if (!newItem.sold) {
                setItems((arr) => [...arr, newItem])
            }
            if (newItem.sold) {
                setSoldItems((arr) => [...arr, newItem])
            }
        }
        setLoadingMarketplace(false)
    }

    useEffect(() => {
        loadMarketplaceItems()
    }, [itemCount, setItems, setSoldItems]) // eslint-disable-line react-hooks/exhaustive-deps

    const buyMarketItem = async (item) => {
        const buyTx = await marketplace.purchaseNFT(item.itemId, {
            value: item.totalPrice.toString(),
        })
        await buyTx.wait()
        const tokenId = item.idx
        setItems(items.filter((arrItem) => arrItem.idx !== tokenId))
        loadMarketplaceItems()
        console.log(items)
    }

    return (
        <div>
            {loadingMarketplace && (
                <div>
                    <h1>Loading marketplace items...</h1>
                    <LoadingSpinner />
                </div>
            )}
            {!loadingMarketplace && items.length === 0 && <div>No NFTs listed...</div>}
            {!loadingMarketplace && items.length > 0 && (
                <div>
                    {items.map((item, idx) => (
                        <div key={idx}>
                            <h2>{item.name}</h2>
                            <div className="imgDiv">
                                <img src={item.image} alt={`NFT ${item.name}`} />
                            </div>
                            <p>{item.description}</p>
                            <h3>Price: {ethers.utils.formatEther(item.totalPrice)} ETH</h3>
                            <p>
                                Seller: {item.seller.slice(0, 4)}...
                                {item.seller.slice(item.seller.length - 4)}
                            </p>
                            <button onClick={() => buyMarketItem(item)}>Buy NFT</button>
                        </div>
                    ))}
                </div>
            )}
            {!loadingMarketplace && soldItems.length > 0 && (
                <div>
                    <h1>Recently Sold NFTs...</h1>
                    {soldItems.map((item, idx) => (
                        <div key={idx}>
                            <h2>{item.name}</h2>
                            <div className="imgDiv">
                                <img src={item.image} alt={`NFT ${item.name}`} />
                            </div>
                            <p>{item.description}</p>
                            <h3>Sale Price: {ethers.utils.formatEther(item.totalPrice)} ETH</h3>
                            <p>
                                Seller: {item.seller.slice(0, 4)}...
                                {item.seller.slice(item.seller.length - 4)}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Home

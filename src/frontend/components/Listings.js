import { useState, useEffect } from 'react'
import './Listings.scss'

import LoadingSpinner from './UI/LoadingSpinner'
import NFTCard from './UI/NFTCard'
import headerImg from '../images/galCircle.png'
import LoadingScreen from '../components/UI/LoadingScreen'

const Listings = ({ marketplace, nft, itemCount, loading }) => {
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

    if (loading) {
        return <LoadingScreen />
    }

    return (
        <div>
            {loadingMarketplace && (
                <div>
                    <h1>Loading marketplace items...</h1>
                    <LoadingSpinner />
                </div>
            )}
            {!loadingMarketplace && items.length === 0 && (
                <div className="change-network">
                    <p>
                        Please Connect your wallet to <strong>Goerli Testnet</strong>
                    </p>
                    <p>No NFTs are currently listed on this network...</p>
                </div>
            )}
            {!loadingMarketplace && items.length > 0 && (
                <div className="container">
                    <h1>NFTs For Sale</h1>
                    <div className="nft-box">
                        {items.map((item, idx) => (
                            <div key={idx}>
                                <NFTCard
                                    name={item.name}
                                    image={item.image}
                                    totalPrice={item.totalPrice}
                                    seller={item.seller}
                                    buyClick={() => buyMarketItem(item)}
                                />
                            </div>
                        ))}
                    </div>
                    {soldItems.length > 0 && (
                        <div>
                            <h1>Recently Sold NFTs...</h1>
                            <div className="nft-box">
                                {soldItems.map((item, idx) => (
                                    <div key={idx}>
                                        <NFTCard
                                            name={item.name}
                                            image={item.image}
                                            totalPrice={item.totalPrice}
                                            seller={item.seller}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default Listings
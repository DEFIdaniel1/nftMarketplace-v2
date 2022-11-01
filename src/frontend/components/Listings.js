import { useState, useEffect } from 'react'

import LoadingSpinner from './UI/LoadingSpinner'
import NFTCard from './UI/NFTCard'
import LoadingScreen from '../components/UI/LoadingScreen'

const Listings = ({ marketplace, nft, itemCount, loading }) => {
    const [items, setItems] = useState([])
    const [soldItems, setSoldItems] = useState([])
    const [loadingMarketplace, setLoadingMarketplace] = useState(true)

    /** 
        Loops through NFT marketplace listings
        Fetches listed 'item' structs
        Calls NFT contract for metadata to call for front-end listing
    */
    const loadMarketplaceItems = async () => {
        for (let i = 1; i <= itemCount; i++) {
            // Use itemId to get mapped item struct
            const item = await marketplace.getItemsMap(i)
            const totalPrice = await marketplace.getTotalPrice(item.itemId)

            // Use NFT tokenID to get URI, which fetches IPFS metadata
            const uri = await nft.tokenURI(item.tokenId)
            const nftContractResponse = await fetch(uri)
            const nftMetadata = await nftContractResponse.json()

            const newItem = {
                totalPrice,
                itemId: item.itemId.toString(),
                seller: item.seller.toString(),
                name: nftMetadata.name.toString(),
                description: nftMetadata.description.toString(),
                image: nftMetadata.image.toString(),
                sold: item.sold,
            }
            // Add to active listings array
            if (!newItem.sold) {
                setItems((arr) => [...arr, newItem])
            }
            // Add to recently sold array
            if (newItem.sold) {
                setSoldItems((arr) => [...arr, newItem])
            }
        }
        setLoadingMarketplace(false)
    }

    useEffect(() => {
        loadMarketplaceItems()
    }, [itemCount, setItems, setSoldItems]) // eslint-disable-line react-hooks/exhaustive-deps

    // Function to buy NFT
    const buyMarketItem = async (item) => {
        const buyTx = await marketplace.purchaseNFT(item.itemId, {
            value: item.totalPrice.toString(),
        })
        await buyTx.wait()
        const tokenId = item.idx
        setItems(items.filter((arrItem) => arrItem.idx !== tokenId))
        loadMarketplaceItems()
    }

    // If not connected, LoadingScreen to connect Metamask
    if (loading) {
        return <LoadingScreen />
    }

    return (
        <div>
            {/* While loading items */}
            {loadingMarketplace && (
                <div>
                    <h1>Loading marketplace items...</h1>
                    <LoadingSpinner />
                </div>
            )}
            {/* If not on goerli network (only network with listings) */}
            {!loadingMarketplace && items.length === 0 && (
                <div className="change-network">
                    <p>
                        Please Connect your wallet to <strong>Goerli Testnet</strong>
                    </p>
                    <p>No NFTs are currently listed on this network...</p>
                </div>
            )}

            {/* ACTIVE LISTINGS */}
            {!loadingMarketplace && items.length > 0 && (
                <div className="container">
                    <h1>NFTs For Sale</h1>
                    <div className="nft-box">
                        {items.map((item, idx) => (
                            <NFTCard
                                key={idx}
                                name={item.name}
                                image={item.image}
                                totalPrice={item.totalPrice}
                                seller={item.seller}
                                buyClick={() => buyMarketItem(item)}
                            />
                        ))}
                    </div>

                    {/* SOLD ITEMS */}
                    {soldItems.length > 0 && (
                        <div className="container">
                            <h1>Recently Sold NFTs...</h1>
                            <div className="nft-box">
                                {soldItems.map((item, idx) => (
                                    <NFTCard
                                        key={idx}
                                        name={item.name}
                                        image={item.image}
                                        totalPrice={item.totalPrice}
                                        seller={item.seller}
                                    />
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

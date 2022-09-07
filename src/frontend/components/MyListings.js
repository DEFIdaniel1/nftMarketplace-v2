import { useState, useEffect } from 'react'
import LoadingSpinner from './LoadingSpinner'
import { ethers } from 'ethers'

const MyListings = ({ marketplace, nft, account, itemCount }) => {
    const [loading, setLoading] = useState(true)
    const [listedItems, setListedItems] = useState([])
    const [soldItems, setSoldItems] = useState([])

    const loadListedItems = async () => {
        setLoading(true)
        for (let i = 1; i <= itemCount; i++) {
            const item = await marketplace.getItemsMap(i)
            console.log(item.tokenId.toString())
            if (item.seller.toLowerCase() === account) {
                const uri = await nft.tokenURI(item.tokenId)
                const totalPrice = await marketplace.getTotalPrice(item.itemId)
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
                console.log(newItem.name)
                setListedItems((arr) => [...arr, newItem])
                if (newItem.sold) {
                    console.log('sold item: ' + newItem.itemId)
                    setSoldItems((arr) => [...arr, newItem])
                }
            }
        }
        setLoading(false)
    }
    useEffect(() => {
        loadListedItems()
    }, [itemCount]) // eslint-disable-line react-hooks/exhaustive-deps

    if (loading)
        return (
            <div>
                <h2>Loading your listings...</h2>
                <LoadingSpinner />
            </div>
        )
    return (
        <div>
            {!loading && listedItems.length === 0 && (
                <div>
                    <h1>My Active Listings</h1>
                    <div>You don't have any listings. Go mint and list some NFTs!</div>
                </div>
            )}
            {!loading && listedItems.length > 0 && (
                <div>
                    <h1>My Active Listings</h1>
                    {listedItems.map((item, idx) => (
                        <div key={idx}>
                            <h3>{item.name}</h3>
                            <div className="imgDiv">
                                <img src={item.image} alt={`NFT ${item.name}`} />
                            </div>
                            <p>{item.description}</p>
                            <h3>Price: {ethers.utils.formatEther(item.totalPrice)} ETH</h3>
                        </div>
                    ))}
                </div>
            )}
            {!loading && soldItems.length > 0 && (
                <div>
                    <h1>Sold Listings</h1>
                    {soldItems.map((item, idx) => (
                        <div key={idx}>
                            <h3>{item.name}</h3>
                            <div className="imgDiv">
                                <img src={item.image} alt={`NFT ${item.name}`} />
                            </div>
                            <p>{item.description}</p>
                            <h3>Sale Price: {ethers.utils.formatEther(item.totalPrice)} ETH</h3>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default MyListings

import { useState, useEffect } from 'react'
import LoadingSpinner from './UI/LoadingSpinner'
import './Home.scss'

import LoadingScreen from './UI/LoadingScreen'
import NFTCard from './UI/NFTCard'

const MyListings = ({ marketplace, nft, account, itemCount, loading }) => {
    const [loadListings, setLoadListings] = useState(true)
    const [listedItems, setListedItems] = useState([])
    const [soldItems, setSoldItems] = useState([])

    const loadListedItems = async () => {
        setLoadListings(true)
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
                if (!newItem.sold) {
                    setListedItems((arr) => [...arr, newItem])
                }
                if (newItem.sold) {
                    console.log('sold item: ' + newItem.itemId)
                    setSoldItems((arr) => [...arr, newItem])
                }
            }
        }
        setLoadListings(false)
    }
    useEffect(() => {
        loadListedItems()
    }, [itemCount]) // eslint-disable-line react-hooks/exhaustive-deps

    if (loading) {
        return <LoadingScreen />
    }
    if (loadListings)
        return (
            <div>
                <LoadingSpinner title="Loading your listings..." />
            </div>
        )
    return (
        <div>
            {!loadListings && listedItems.length === 0 && (
                <div className="change-network">
                    <h1>My Active Listings</h1>
                    <div>You don't have any listings. Go mint and list some NFTs!</div>
                </div>
            )}
            {!loadListings && listedItems.length > 0 && (
                <div className="container">
                    <h1>My Active Listings</h1>
                    <div className="nft-box">
                        {listedItems.map((item, idx) => (
                            <NFTCard
                                key={idx}
                                name={item.name}
                                image={item.image}
                                totalPrice={item.totalPrice}
                                seller={item.seller}
                                sold={item.sold}
                            />
                        ))}
                    </div>
                </div>
            )}
            {!loading && soldItems.length > 0 && (
                <div className="container">
                    <h1>Sold Listings</h1>
                    <div className="nft-box">
                        {soldItems.map((item, idx) => (
                            <NFTCard
                                key={idx}
                                name={item.name}
                                image={item.image}
                                totalPrice={item.totalPrice}
                                seller={item.seller}
                                sold={item.sold}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default MyListings

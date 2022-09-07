import { Link } from 'react-router-dom'

function Navbar({ account, connectWallet }) {
    return (
        <>
            <nav>
                <Link to="/">Home</Link>
                <Link to="my-listings">My Listings</Link>
                <Link to="my-purchases">Purchases</Link>
                <Link to="mint">Mint NFTs</Link>
            </nav>
            {account ? (
                <div>
                    <p>
                        {account.slice(0, 5)}...{account.slice(38, 42)}
                    </p>
                    <button onClick={connectWallet}>Logout</button>
                </div>
            ) : (
                <button onClick={connectWallet}>Connect</button>
            )}
        </>
    )
}
export default Navbar

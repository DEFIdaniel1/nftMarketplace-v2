import { Link } from 'react-router-dom'
import Icon from './UI/Icon'
import './Navbar.scss'

function Navbar({ account, connectWallet }) {
    return (
        <div className="navbar">
            <nav className="nav">
                <div className="nav__item">
                    <Link to="/">Home</Link>
                </div>
                <div className="nav__item">
                    <Link to="my-listings">My Listings</Link>
                </div>
                <div className="nav__item">
                    <Link to="my-purchases">Purchases</Link>
                </div>
                <div className="nav__item">
                    <Link to="mint">Mint NFTs</Link>
                </div>
            </nav>

            {account ? (
                <div className="connect connect__active">
                    <p>Disconnect</p>
                    <p className="acct">
                        {account.slice(0, 5)}...{account.slice(38, 42)}
                    </p>
                </div>
            ) : (
                <div className="connect" onClick={connectWallet}>
                    <p className="disconnect">Connect</p>
                </div>
            )}
        </div>
    )
}
export default Navbar

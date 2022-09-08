import { NavLink } from 'react-router-dom'
import './Navbar.scss'

function Navbar({ account, connectWallet }) {
    return (
        <div className="navbar">
            <nav className="nav">
                <NavLink to="/">
                    <span className="nav__item">Home</span>
                </NavLink>
                <NavLink to="my-listings">
                    <span className="nav__item">My Listings</span>
                </NavLink>
                <NavLink to="my-purchases">
                    <span className="nav__item">Purchases</span>
                </NavLink>
                <NavLink to="mint">
                    <span className="nav__item">Mint NFTs</span>
                </NavLink>
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

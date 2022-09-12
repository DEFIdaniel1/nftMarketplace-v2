import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import './Navbar.scss'

function Navbar({ account, connectWallet, disconnectWallet }) {
    const [openNav, setOpenNav] = useState(false)
    const openNavHandler = () => {
        setOpenNav(!openNav)
    }

    return (
        <div className={!openNav ? 'navbar navbar__closed' : 'navbar navbar__open'}>
            <div
                className={!openNav ? 'navBurger navBurger__closed' : 'navBurger navBurger__open'}
                onClick={openNavHandler}
            >
                <div></div>
                <div></div>
                <div></div>
            </div>
            <nav className={!openNav ? 'nav nav__closed' : 'nav nav__open'}>
                <NavLink to="/">
                    <span className="nav__item" onClick={openNavHandler}>
                        Home
                    </span>
                </NavLink>
                <NavLink to="listings" onClick={openNavHandler}>
                    <span className="nav__item">Listings</span>
                </NavLink>
                <NavLink to="my-listings" onClick={openNavHandler}>
                    <span className="nav__item">My Listings</span>
                </NavLink>
                <NavLink to="my-purchases" onClick={openNavHandler}>
                    <span className="nav__item">Purchases</span>
                </NavLink>
                <NavLink to="mint" onClick={openNavHandler}>
                    <span className="nav__item">Mint NFTs</span>
                </NavLink>
            </nav>

            {account ? (
                <div onClick={disconnectWallet} className="connect connect__active">
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

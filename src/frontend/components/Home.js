import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './Home.scss'

import headerImg from '../images/galCircle.png'
import Button from './UI/Button.js'

import nftImg1 from '../nfts/nft1.png'
import nftImg2 from '../nfts/nft2.jpeg'
import nftImg3 from '../nfts/nft3.jpeg'
import nftImg5 from '../nfts/nft5.jpeg'

const Home = () => {
    const navigate = useNavigate()
    // const contractAddress = '../frontend/contractsData/NFT-address.json'
    const mintBtnHandler = () => {
        navigate('/mint')
    }

    return (
        <div>
            <div className="header">
                <div className="header__left">
                    <div className="header__left-title">GAL-XY</div>
                    <div className="header__left-subtitle">NFTs inspired by the cosmos...</div>
                </div>
                <div className="header__right">{<img src={headerImg} alt="rotating galaxy" />}</div>
            </div>
            <div className="cMint">
                <div className="cMintleft-col">
                    <span className="cInfo-title">Limited Mints Available</span>
                    <div className="cInfo-subheading">
                        With a capped supply of only 100 NFTs per GAL-X Model, you don't want to
                        miss out.
                    </div>
                    <Button onClick={mintBtnHandler}>Mint Yours</Button>
                </div>
                <div className="cMintright">
                    <div className="cMintright-col">
                        <div className="cMintright-col1">
                            <img src={nftImg1} alt="" />
                        </div>
                        <div className="cMintright-col1">
                            <img src={nftImg2} alt="" />
                        </div>
                    </div>
                    <div className="cMintright-col">
                        <div className="cMintright-r2c1">
                            <img src={nftImg3} alt="" />
                        </div>
                        <div className="cMintright-r2c1">
                            <img src={nftImg5} alt="" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="cInfo">
                <div className="cInfo-right">
                    <span className="cInfo-title">Built with Smart Contracts</span>
                    <div className="cInfo-subheading">
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. A tempora commodi
                        aut obcaecati officiis quo sed sequi odit. Dolores qui sunt harum eligendi
                        sapiente voluptatibus quibusdam numquam explicabo voluptatum incidunt.
                    </div>
                </div>
                <div className="cInfo-center">
                    <span className="cInfo-title">Secured by the Blockchain</span>
                    <div className="cInfo-subheading">
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. A tempora commodi
                        aut obcaecati officiis quo sed sequi odit.
                    </div>
                </div>
                <div className="cInfo-left">
                    <span className="cInfo-title">Mint Your Own NFTs</span>
                    <div className="cInfo-subheading">
                        A tempora commodi aut obcaecati officiis quo sed sequi odit. Dolores qui
                        sunt harum eligendi sapiente voluptatibus quibusdam numquam explicabo
                        voluptatum incidunt.
                    </div>
                </div>
            </div>
            <div className="cContract">
                <h1>Live on Goerli Testnet</h1>
                <h3>Contract Addresses</h3>
                <h2>0x81b2F370EDF65dC4370C03bD3424caef91eDdDd8</h2>
                <h2>0xfb36A92A0AaBc9Ebfd25F59eFfbFaf6a9267e1DF</h2>
            </div>
        </div>
    )
}

export default Home

import React from 'react'
import './LoadingSpinner.scss'

const LoadingSpinner = () => {
    return (
        <div className="loadingBox">
            <h1>Click "Connect"</h1>
            <div id="spinner"></div>
            <h2>load your web3 wallet...</h2>
        </div>
    )
}

export default LoadingSpinner

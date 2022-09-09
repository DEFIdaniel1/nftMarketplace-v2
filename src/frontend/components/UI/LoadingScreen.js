import React from 'react'
import LoadingSpinner from './LoadingSpinner'
import './LoadingScreen.scss'

const LoadingScreen = () => {
    return (
        <div className="center-spinner">
            <LoadingSpinner title="Click 'Connect'" subtitle="load your web3 wallet..." />
        </div>
    )
}

export default LoadingScreen

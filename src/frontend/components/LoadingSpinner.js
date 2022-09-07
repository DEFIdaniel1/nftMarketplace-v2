import React from 'react'
import './LoadingSpinner.scss'

const LoadingSpinner = ({ title, subtitle }) => {
    return (
        <div className="loadingBox">
            <h1>{title}</h1>
            <div id="spinner"></div>
            <h2>{subtitle}</h2>
        </div>
    )
}

export default LoadingSpinner

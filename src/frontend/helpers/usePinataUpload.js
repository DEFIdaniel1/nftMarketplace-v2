const pinataSDK = require('@pinata/sdk')
const fs = require('fs')

// const pinataAPIKey = process.env.REACT_APP_PINATA_API_KEY
// const pinataAPISecret = process.env.REACT_APP_PINATA_API_SECRET
const pinataAPIKey = 'ce68b5847e6ae5ae20c8'
const pinataAPISecret = '50500f164530774c2174927dbf150d09c4c0c467ccdf6496a15641b98550de3d'
const pinata = pinataSDK(pinataAPIKey, pinataAPISecret)

async function storeImages(uploadedImage) {
    // const fullImagesPath = path.resolve(imagesFilePath)
    // const files = fs.readdirSync(fullImagesPath)
    console.log('Uploading image to IPFS...')
    const readableImage = fs.createReadStream(uploadedImage)
    let uploadResponse
    try {
        uploadResponse = await pinata.pinFileToIPFS(uploadedImage)
    } catch (e) {
        console.log('There was a Pinata upload error:', e)
    }
    return uploadResponse
}

async function storeTokenURIMetadata(metadata) {
    try {
        const response = await pinata.pinJSONToIPFS(metadata)
        return response
    } catch (e) {
        console.log(e)
    }
}

module.exports = { storeImages, storeTokenURIMetadata }

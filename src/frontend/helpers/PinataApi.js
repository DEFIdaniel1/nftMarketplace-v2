const axios = require('axios')
const FormData = require('form-data')
const fs = require('fs')
const data = new FormData()
data.append('file', fs.createReadStream('/Users/Desktop/images/cat.JPG'))
data.append('pinataMetadata', '{"name": "MyFile"}')

const config = {
    method: 'post',
    url: 'https://api.pinata.cloud/pinning/pinFileToIPFS',
    headers: {
        Authorization: 'Bearer PINATA JWT',
        ...data.getHeaders(),
    },
    data: data,
}

const res = await axios(config)

console.log(res.data)

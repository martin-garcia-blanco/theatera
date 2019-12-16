require('dotenv').config()

const express = require('express')
const { name, version } = require('./package.json')
const { argv: [, , port], env: { PORT = port || 9000, DB_URL } } = process
const cors = require('./utils/cors')
const { database } = require('theatera-data')

const { users, chat, post, search } = require('./routes')
const api = express()
api.use(express.static('public'))


api.use(cors)

api.options('*', cors, (req, res) => {
    res.end()
})

api.use('/users', users)
api.use('/chat', chat)
api.use('/post', post)
api.use('/search', search)


database
    .connect(DB_URL)
    .then(() => api.listen(PORT, () => console.log(`${name} ${version} up running on port ${PORT}`)))
const { Router } = require('express')
const { createChat, retrieveChat, retrieveChats, sendMessage } = require('../../logic')
const jwt = require('jsonwebtoken')
const { env: { SECRET } } = process
const tokenVerifier = require('../../helpers/token-verifier')(SECRET)
const bodyParser = require('body-parser')
const { errors: { NotFoundError, ConflictError, CredentialsError } } = require('theatera-util')


const jsonBodyParser = bodyParser.json()
const router = Router()

router.post('/create', tokenVerifier, jsonBodyParser, (req, res) => {
    try {
        const { id, body: { userId } } = req

        createChat(id, userId)
            .then(id => res.status(201).json( id ))
            .catch(error => {
                const { message } = error
                if (error instanceof NotFoundError)
                    return res.status(404).json({ message })

                res.status(500).json({ message })
            })
    } catch ({ message }) {
        res.status(400).json({ message })
    }
})


router.get('/retrievechat/:chatId', tokenVerifier, (req, res) => {
    try {
        const { params: { chatId } } = req

        retrieveChat(chatId)
            .then(messages => res.status(200).json( messages ))
            .catch(error => {
                const { message } = error

                if (error instanceof NotFoundError)
                    return res.status(404).json({ message })

                res.status(500).json({ message })
            })
    } catch ({ message }) {
        res.status(400).json({ message })
    }
})

router.get('/retrievechats', tokenVerifier, (req, res) => {
    try {
        const { id } = req

        retrieveChats(id)
            .then(chats => res.status(200).json(chats))
            .catch(error => {
                const { message } = error

                if (error instanceof NotFoundError)
                    return res.status(404).json({ message })

                res.status(500).json({ message })
            })
    } catch ({ message }) {
        res.status(400).json({ message })
    }
})


router.put('/sendmessage', tokenVerifier, jsonBodyParser, (req, res) => {
    try {
        const { id, body: { body, chatId } } = req

        sendMessage(chatId, id, body)
            .then(id => res.status(201).end())
            .catch(error => {
                const { message } = error
                if (error instanceof NotFoundError)
                    return res.status(404).json({ message })

                res.status(500).json({ message })
            })
    } catch ({ message }) {
        res.status(400).json({ message })
    }
})



module.exports = router
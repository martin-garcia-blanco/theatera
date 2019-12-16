const { Router } = require('express')
const { createPost, removePost, retrieveLatestPosts, retrievePostById, retrieveUserPosts, sendComment, toggleLikePost } = require('../../logic')
const jwt = require('jsonwebtoken')
const { env: { SECRET } } = process
const tokenVerifier = require('../../helpers/token-verifier')(SECRET)
const bodyParser = require('body-parser')
const { errors: { NotFoundError, ConflictError, CredentialsError } } = require('theatera-util')


const jsonBodyParser = bodyParser.json()
const router = Router()

router.post('/create', tokenVerifier, jsonBodyParser, (req, res) => {
    try {
        const { id, body: { body, type } } = req

        createPost(id, body, type)
            .then(id => res.status(201).json({ id }))
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


router.delete('/remove/:postId', tokenVerifier, jsonBodyParser, (req, res) => {
    try {
        const { id } = req
        const { params: { postId } } = req

        removePost(id, postId)
            .then(id => res.status(202).json({ id }))
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


router.get('/retrievepost/:postId', tokenVerifier, (req, res) => {
    try {
        const { id } = req
        const { params: { postId } } = req

        retrievePostById(postId)
            .then(post => res.status(200).json( post ))
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



router.get('/retrievelatest', tokenVerifier, (req, res) => {
    try {
        const { id } = req

        retrieveLatestPosts(id)
            .then(posts => res.status(200).json({ posts }))
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


router.get('/retrieveuserposts/:id', tokenVerifier, (req, res) => {
    try {
        const { params: { id } } = req

        retrieveUserPosts(id)
            .then(posts => res.status(200).json({ posts }))
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
            .then(id => res.status(200).json({ id }))
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


router.patch('/togglelike/:postId', tokenVerifier, (req, res) => {
    try {
        const { id } = req
        const { params: { postId } } = req

        toggleLikePost(id, postId)
            .then((id) => res.status(200).end())
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


router.put('/sendcomment', tokenVerifier, jsonBodyParser, (req, res) => {
    try {
        const { id, body: { body, postId } } = req

        sendComment(id,postId, body)
            .then(id => res.status(201).json({ id }))
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
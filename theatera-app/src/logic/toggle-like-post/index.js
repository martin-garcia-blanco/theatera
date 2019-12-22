import call from '../../utils/call'
const { validate, errors: { ConflictError } } = require('theatera-util')
const API_URL = process.env.REACT_APP_API_URL

export default function(postId, token) {
    validate.string(token)
    validate.string.notVoid('token', token)

    validate.string(postId)
    validate.string.notVoid('postId', postId)

    return (async() => {
        const res = await call(`${API_URL}/post/togglelike/${postId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        if (res.status === 200) return {}

        if (res.status === 409) throw new ConflictError(JSON.parse(res.body).message)

        else { throw new Error(JSON.parse(res.body).message) }
    })()
}
//const call = require('../../utils/call')
import call from '../../utils/call'
const { validate, errors: { ConflictError } } = require('theatera-util')
const API_URL = process.env.REACT_APP_API_URL

//module.exports = function(token, postId, body) {
export default function(token, postId, body) {
    validate.string(token)
    validate.string.notVoid('token', token)

    validate.string(postId)
    validate.string.notVoid('postId', postId)

    validate.string(body)
    validate.string.notVoid('body', body)

    return (async() => {
        const res = await call(`${API_URL}/post/sendcomment`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({ body, postId })
        })

            

        if (res.status === 201) return JSON.parse(res.body)

        if (res.status === 409) throw new ConflictError(JSON.parse(res.body).message)

        throw new Error(JSON.parse(res.body).message)

    })()


}
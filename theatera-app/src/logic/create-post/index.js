//const call = require('../../utils/call')
import call from '../../utils/call'
const { validate, errors: { NotFoundError } } = require('theatera-util')
const API_URL = process.env.REACT_APP_API_URL


//module.exports = function(token, body, type = 'ARTICLE') {
export default function(token, body, type = 'ARTICLE') {    
    validate.string(token)
    validate.string.notVoid('token', token)

    validate.string(body)
    validate.string.notVoid('body', body)

    validate.string(type)
    validate.string.notVoid('type', type)

    return (async() => {
        const res = await call(`${API_URL}/post/create`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({ body, type })
        })

        if (res.status === 201) return 

        if (res.status === 404) throw new NotFoundError(JSON.parse(res.body).message)

        throw new Error(JSON.parse(res.body).message)
    })()


}
import call from '../../utils/call'
const { validate, errors: { NotFoundError } } = require('theatera-util')
const API_URL = process.env.REACT_APP_API_URL


export default function(token, skill) {
    validate.string(token)
    validate.string.notVoid('token', token)

    validate.string(skill)
    validate.string.notVoid('skill', skill)

    return (async() => {
        const res = await call(`${API_URL}/users/createskillitem`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ skill })
        })


        if (res.status === 201) return

        if (res.status === 404) throw new NotFoundError(JSON.parse(res.body).message)

        throw new Error(JSON.parse(res.body).message)
    })()
}
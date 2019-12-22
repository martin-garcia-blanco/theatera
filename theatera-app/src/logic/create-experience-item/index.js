import call from '../../utils/call'
const { validate, errors: { NotFoundError } } = require('theatera-util')
const API_URL = process.env.REACT_APP_API_URL


export default function(token, title, body, startDate, endDate, type) {
    validate.string(token)
    validate.string.notVoid('token', token)
    validate.string(title)
    validate.string.notVoid('title', title)
    validate.string(body)
    validate.string.notVoid('body', body)
    validate.string(endDate)
    validate.string(startDate)
    endDate = new Date(Date.parse(endDate))
    endDate = endDate.getTime()
    startDate = new Date(Date.parse(startDate))
    startDate = startDate.getTime()
    validate.number(endDate)
    validate.number(startDate)
    validate.string(type)
    validate.string.notVoid('type', type)

    return (async() => {
       
        const res = await call(`${API_URL}/users/createexperienceitem`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({ title, endDate, startDate, body, type  })
        })

        if (res.status === 201) return 

        if (res.status === 404) throw new NotFoundError(JSON.parse(res.body).message)

        throw new Error(JSON.parse(res.body).message)

    })()
}
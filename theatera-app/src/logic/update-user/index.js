//const call = require('../../utils/call')
import call from '../../utils/call'
const { validate, errors: { NotFoundError } } = require('theatera-util')
const API_URL = process.env.REACT_APP_API_URL


//module.exports = function(token, info) {
export default function(token, info) {

    validate.string(token)
    validate.string.notVoid('token', token)


    const {_name:name, _introduction:introduction, _description: description, _age: age, _gender:gender, _languages: languages , _phone: phone, _email: email, _website:website, _city:city, _surname:surname, _height:height, _weight:weight} = info
   

    if (name) {
        validate.string(name)
        validate.string.notVoid('name', name)
    }
    if (introduction) {
        validate.string(introduction)
        validate.string.notVoid('introduction', introduction)
    }
    if (description) {
        validate.string(description)
        validate.string.notVoid('description', description)
    }
    if (city) {
        validate.string(city)
        validate.string.notVoid('city', city)
    }
    if (website) {
        validate.string(website)
        validate.string.notVoid('website', website)
    }
    if (email) {
        validate.string(email)
        validate.string.notVoid('email', email)
    }
    if (phone) {
        validate.string(phone)
        validate.string.notVoid('phone', phone)
    }
    if (gender) {
        validate.string(gender)
        validate.string.notVoid('gender', gender)
        validate.matches('gender', gender, "MAN", "WOMAN")
    }
    if (age) {
        validate.string(age)
    }
    if (height) {
        validate.string(height)
    }
    if (weight) {
        validate.string(weight)
    }
    if (languages) {
        validate.string(languages)
    }



    return (async() => {
        const data = {name, introduction, description,phone, email, website, city, specificInfo:{surname,age:parseInt(age) ,gender,languages,height:parseInt(height),weight:parseInt(weight)}}
        const res = await call(`${API_URL}/users//modifyuser`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({data})
        })

            

        if (res.status === 200) return 

        if (res.status === 404) throw new NotFoundError(JSON.parse(res.body).message)

        throw new Error(JSON.parse(res.body).message) 
    })()
}
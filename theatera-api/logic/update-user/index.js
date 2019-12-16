const { validate, errors: { NotFoundError } } = require('theatera-util')
const { ObjectId, models: { User } } = require('theatera-data')


/**
 *
 * Update data 
 * 
 * @param {ObjectId} id
 * @param {Object} data
 * @returns {ObjectId}
 */
module.exports = function(id, data) {

    validate.string(id)
    validate.string.notVoid('id', id)
    if (!ObjectId.isValid(id)) throw new ContentError(`${id} is not a valid id`)


    const { name, introduction, description, phone, email, website, city, specificInfo } = data
    let height, weight, languages, gender, age

    if (specificInfo) {
        height = specificInfo.height
        weight = specificInfo.weigh
        languages = specificInfo.languages
        gender = specificInfo.gender
        age = specificInfo.age

    }

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
        validate.number(age)
    }
    if (height) {
        validate.number(height)
    }
    if (weight) {
        validate.number(weight)
    }
    if (languages) {
        validate.string(languages)
    }


    return (async() => {
        const user = await User.findById(id)
        if (!user) throw new NotFoundError(`user with id ${id} not found`)
        
        await User.updateOne({ _id: ObjectId(id) }, { $set: data })

    })()
}
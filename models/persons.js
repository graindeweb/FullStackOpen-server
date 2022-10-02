require('dotenv').config()
const mongoose = require('mongoose')

mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log("Connected to MongoDB")
    })
    .catch(err => {
        console.log("An error occured with MongoDB: ", err.message)
    }) 

const personSchema = new mongoose.Schema({
    name: String, 
    phone: String,
})
personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)
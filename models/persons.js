require("dotenv").config()
const mongoose = require("mongoose")

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB")
  })
  .catch((err) => {
    console.log("An error occured with MongoDB: ", err.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 3,
  },
  phone: {
    type: String,
    required: true,
    minLength: 8,
    validate: {
      validator: function (v) {
        return /^\d{2,3}-\d+/.test(v)
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
})
personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model("Person", personSchema)

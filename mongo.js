const mongoose = require("mongoose")

const password = process.argv[2]
if (typeof password === "undefined") {
  return console.log("You must give the mongo database password as argument")
}
mongoURL = `mongodb+srv://fullopenpart3:${password}@cluster0.srov4z9.mongodb.net/?retryWrites=true&w=majority`

personSchema = mongoose.Schema({
  name: String,
  phone: String,
})
const Person = mongoose.model("Person", personSchema)

const createPerson = (name, phone) => {
  return new Person({ name, phone }).save()
}

mongoose
  .connect(mongoURL)
  .then((conn) => {
    if (process.argv[3] && process.argv[4]) {
      const name = process.argv[3]
      const phone = process.argv[4]
      const newPerson = createPerson(name, phone).then((person) => {
        console.log(`Added ${name} number ${phone} to phonebook with id ${person._id}`)
        mongoose.connection.close()
      })
    } else {
      console.log("phonebook:")
      Person.find({}).then((result) => {
        result.forEach((person) => console.log(`${person.name} ${person.phone}`))
        mongoose.connection.close()
      })
    }
  })
  .catch((err) => console.log(`An error occured: ${err}`))

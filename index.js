require("dotenv").config()
const express = require("express")
const morgan = require("morgan")
const cors = require("cors")

const Person = require("./models/persons")

const app = express()
app.use(cors())
app.use(express.json())

// Serve Frontend files
app.use(express.static("build"))

morgan.token("args", (request) => {
  return JSON.stringify(request.body)
})
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :args"))

/** Get infos about phonebook */
app.get("/info", (request, response) => {
  const now = new Date()
  Person.find({}).then((persons) => {
    response.send(
      `<p>Phonebook has info for ${persons.length} people</p>`.concat(`\n<p>${now}</p>`)
    )
  })
})

/** Get all persons in phonebook */
app.get("/api/persons", (request, response) => {
  Person.find({})
    .then((persons) => response.json(persons))
    .catch((err) => {
      console.log(err)
      response.status(500).end()
    })
})

/** Get person's details */
app.get("/api/persons/:id", (request, response, next) => {
  const id = request.params.id
  Person.findById(id)
    .then((person) => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch((err) => next(err))
})

/** Add a new person in phonebook */
app.post("/api/persons", (request, response, next) => {
  const { name, phone } = request.body
  if (!name || !phone) {
    return response.status(400).json({ error: "Invalid arguments: 'name' and 'phone' required!" })
  }

  Person.find({ name: request.body.name })
    .then((matchingPersons) => {
      if (matchingPersons.length) {
        return response.status(409).json({
          error: "name must be unique!",
          person: matchingPersons[0],
        })
      }

      const person = new Person({ name, phone })
      person
        .save()
        .then((newPerson) => {
          console.log("person saved with id:", newPerson.id)
          return response.json(newPerson)
        })
        .catch((err) => next(err))
    })
    .catch((err) => {
      console.log("An Error occured on create: ", err.message)
      response.status(500).end()
    })
})

/** Update existing person */
app.put("/api/persons/:id", (request, response, next) => {
  const id = request.params.id
  const { name, phone } = request.body

  Person.findByIdAndUpdate(
    id,
    { name, phone },
    { new: true, runValidators: true, context: "query" }
  )
    .then((udpatedPerson) => {
      if (udpatedPerson) {
        response.json(udpatedPerson)
      } else {
        response.status(404).end()
      }
    })
    .catch((err) => next(err))
})

/** Delete a person by id in phonebook */
app.delete("/api/persons/:id", (request, response, next) => {
  const id = request.params.id
  Person.findByIdAndDelete(id)
    .then(() => response.status(204).end())
    .catch((err) => next(err))
})

/** Catch all unknown endpoints */
app.use((request, response) => {
  response.status(404).send({ error: "unknown endpoint" })
})

/** Error Handling */
app.use((error, request, response, next) => {
  console.log(error)

  if (error.name === "CastError") {
    return response.status(400).send({ error: "Malformatted id" })
  } else if (error.name === "ValidationError") {
    return response.status(400).send({ error: error.message })
  }

  next(error)
})

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

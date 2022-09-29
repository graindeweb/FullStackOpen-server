const express = require("express")
const morgan = require("morgan")
const cors = require("cors")

const store = require("./store/persons.json")
let persons = store.persons

const app = express()
app.use(cors())
app.use(express.json())

// Serve Frontend files
app.use(express.static("build"))

morgan.token("args", (request, response) => {
  return JSON.stringify(request.body)
})
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :args"))

/** Get infos about phonebook */
app.get("/info", (request, response) => {
  const now = new Date()
  response.send(
    `<p>Phonebook has info for ${persons.length} people</p>
    <p>${now}</p>`
  )
})

/** Get all persons in phonebook */
app.get("/api/persons", (request, response) => {
  response.json(persons)
})

/** Get person's details */
app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find((p) => p.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

/** Add a new person in phonebook */
app.post("/api/persons", (request, response) => {
  if (!request.body["name"] || !request.body["phone"]) {
    return response.status(400).json({ error: "Invalid arguments: 'name' and 'phone' required!" })
  } else if (persons.find((p) => p.name === request.body.name)) {
    return response.status(409).json({ error: "name must be unique!" })
  }

  const newPerson = {
    name: request.body.name,
    phone: request.body.phone,
    id: Math.floor(Math.random() * 99999999999999999),
  }
  persons.push(newPerson)

  return response.json(newPerson)
})

/** Delete a person by id in phonebook */
app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter((p) => p.id !== id)

  response.end()
})

/** Catch all unknown endpoints */
app.use((request, response) => {
  response.status(404).send({ error: "unknown endpoint" })
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

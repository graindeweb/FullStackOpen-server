const express = require("express")

const store = require("./store/persons.json")
let persons = store.persons
const app = express()

app.use(express.json())

app.get("/info", (request, response) => {
  const now = new Date()
  response.send(
    `<p>Phonebook has info for ${persons.length} people</p>
    <p>${now}</p>`
  )
})

app.get("/api/persons", (request, response) => {
  response.json(persons)
})

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find((p) => p.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.post("/api/persons", (request, response) => {
  if (!request.body["name"] || !request.body["phone"]) {
    return response.status(400).json({ error: "invalid arguments. Should be 'name' and 'phone'" })
  } else if (persons.find((p) => p.name === request.body.name)) {
    return response.status(409).json({ error: "this person already exists!" })
  }
  
  const newPerson = {
    name: request.body.name,
    phone: request.body.phone,
    id: Math.floor(Math.random() * 99999999999999999),
  }
  persons.push(newPerson)

  return response.json(newPerson)
})

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter((p) => p.id !== id)

  response.end()
})

const PORT = 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

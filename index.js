const express = require("express")

const store = require("./store/persons.json")
let persons = store.persons
const app = express()


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
    const person = persons.find(p => p.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(p => p.id !== id)

    response.end()
})

const PORT = 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

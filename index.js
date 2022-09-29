const express = require("express")

const store = require("./store/persons.json")
const app = express()


app.get("/api/persons", (request, response) => {
  response.json(store.persons)
})

app.get("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id)
    const person = store.persons.find(p => p.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.get("/info", (request, response) => {
  const now = new Date()
  response.send(
    `<p>Phonebook has info for ${store.persons.length} people</p>
    <p>${now}</p>`
  )
})

const PORT = 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

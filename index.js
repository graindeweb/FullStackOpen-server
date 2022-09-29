const express = require("express")

const store = require("./store/persons.json")
const app = express()


app.get("/api/persons", (request, response) => {
  response.json(store.persons)
})


const PORT = 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

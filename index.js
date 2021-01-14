const express = require("express");
const app = express();

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1,
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2,
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3,
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4,
  },
];

app.get("/info", (req, res) => {
  const personAmount = persons.length;
  const date = new Date();
  res.send(
    `
      <p>Phonebook has ${personAmount} persons in it. </p>
      <p>${date}</p>
    `
  );
});

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

const port = 3001;
app.listen(port);
console.log(`Server running on port ${port}`);

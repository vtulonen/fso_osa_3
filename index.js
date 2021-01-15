const express = require("express");
const app = express();

app.use(express.json());

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

// INFO
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

// GET ALL
app.get("/api/persons", (req, res) => {
  res.json(persons);
});

// GET BY ID
app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => {
    return person.id === id;
  });

  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

// DELETE
app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((person) => person.id !== id);
  res.status(204).end();
});

const generateId = () => {
  const min = Math.ceil(0);
  const max = Math.floor(10000000);
  return Math.floor(Math.random() * (max - min) + min);
};

// POST add person
app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body.name) {
    return res.status(400).json({
      error: "name missing",
    });
  } else if (!body.number) {
    return res.status(400).json({
      error: "number missing",
    });
  }

  const alreadyIn = persons.find((person) => person.name === body.name)
    ? true
    : false;

  if (alreadyIn)
    return res.status(400).json({
      error: "name provided already in the phonebook",
    });

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };

  persons = persons.concat(person);

  res.json(person);
});

const port = 3001;
app.listen(port);
console.log(`Server running on port ${port}`);

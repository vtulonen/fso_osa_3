require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");

app.use(express.static("build"));
app.use(cors());
app.use(express.json());

morgan.token("postData", function (req, res) {
  return JSON.stringify(req.body);
});

app.use(
  morgan((tokens, req, res) => {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "---",
      tokens["response-time"](req, res),
      "ms",
      tokens.postData(req, res),
    ].join(" ");
  })
);

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
  Person.find({}).then((persons) => {
    console.log(persons);
    res.json(persons);
  });
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

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const express = require('express')
const app = express()
require('dotenv').config()

const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

morgan.token('postData', function (req) {
	return JSON.stringify(req.body)
})

app.use(
	morgan((tokens, req, res) => {
		return [
			tokens.method(req, res),
			tokens.url(req, res),
			tokens.status(req, res),
			tokens.res(req, res, 'content-length'),
			'---',
			tokens['response-time'](req, res),
			'ms',
			tokens.postData(req, res),
		].join(' ')
	})
)

// INFO
app.get('/info', (req, res) => {
	Person.countDocuments({}).then((count) => {
		res.send(
			`
        <p>Phonebook has ${count} persons in it. </p>
        <p>${new Date()}</p>
      `
		)
	})
})

// GET ALL
app.get('/api/persons', (req, res, next) => {
	Person.find({})
		.then((persons) => {
			res.json(persons)
		})
		.catch((error) => next(error))
})

// GET BY ID
app.get('/api/persons/:id', (req, res, next) => {
	Person.findById(req.params.id)
		.then((person) => {
			if (person) {
				res.json(person)
			} else {
				res.status(404).end()
			}
		})
		.catch((error) => next(error))
})

// DELETE
app.delete('/api/persons/:id', (req, res, next) => {
	Person.findByIdAndRemove(req.params.id)
		.then(() => {
			res.status(204).end()
		})
		.catch((error) => next(error))
})

// POST add person
app.post('/api/persons', (req, res, next) => {
	const body = req.body

	const person = new Person({
		name: body.name,
		number: body.number,
	})

	person
		.save()
		.then((savedPerson) => {
			res.json(savedPerson)
		})
		.catch((error) => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
	const body = req.body

	const person = {
		name: body.name,
		number: body.number,
	}

	Person.findByIdAndUpdate(req.params.id, person, { new: true })
		.then((updatedPerson) => {
			res.json(updatedPerson.toJSON())
		})
		.catch((error) => next(error))
})

const unknownEndpoint = (req, res) => {
	res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
	console.error(error.message)
	console.log(error)

	if (error.name === 'CastError' && error.kind === 'ObjectId') {
		return res.status(400).send({ error: 'invalid id' })
	} else if (error.name === 'ValidationError') {
		return res.status(400).json({ error: error.message })
	}

	next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
console.log(PORT)

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})

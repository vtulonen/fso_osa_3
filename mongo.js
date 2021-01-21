const mongoose = require('mongoose')

if (process.argv.length < 3) {
	console.log('give password as argument')
	process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fso:${password}@fso-cluster.mnjxm.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
	useCreateIndex: true,
})

const personSchema = new mongoose.Schema({
	name: String,
	number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 5) {
	// Add Person
	const person = new Person({
		name: process.argv[3],
		number: process.argv[4],
	})
	person.save().then(() => {
		console.log('person saved')
		mongoose.connection.close()
		process.exit(1)
	})
} else if (process.argv.length === 3) {
	// Show all
	Person.find({}).then((res) => {
		console.log('Phonebook:')
		res.forEach((item) => {
			console.log(item.name, item.number)
		})
		mongoose.connection.close()
		process.exit(1)
	})
} else {
	// Log error
	console.log(
		'Usage:\n1. add person: node mongo.js <password> <name> <number>\n2. show all: node mongo.js <password>'
	)
	process.exit(1)
}

require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const Person = require('./models/person');

const { PORT } = process.env;

const app = express();
morgan.token('body', (req, res) => JSON.stringify(req.body));

app.use(express.json());
app.use(morgan(':body :method :status :res[content-length] - :response-time ms'));
// app.use(morgan('tiny'));
app.use(cors());
app.use(express.static('frontend'));

const currentDate = new Date();

app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then(persons => res.json(persons))
    .catch(error => next(error));
});

app.get('/api/info', (req, res, next) => {
  Person.find({})
    .then(list => res.send(`Phonebook has info for ${list.length} people. <br/> ${currentDate}`))
    .catch(error => next(error));
});

app.get('/api/persons/:id', (req, res, next) => {
  const personID = req.params.id;
  Person.findById(personID)
    .then(person => res.json(person))
    .catch(error => next(error));
});

app.delete('/api/persons/:id', (req, res, next) => {
  const personID = req.params.id;

  Person.findByIdAndDelete(personID)
    .then(() => res.status(204).end())
    .catch(error => next(error));
});

app.post('/api/persons', (req, res, next) => {
  const { name, number } = req.body;
  if (!name || !number) {
    return res.status(400).send({ error: 'name or number is missing' });
  }

  const person = new Person({
    name,
    number,
  });

  return person.save(person)
    .then(savedRecord => res.json(savedRecord))
    .catch(error => next(error));
});

app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body;
  const personID = req.params.id;
  Person.findByIdAndUpdate(
    personID,
    { name, number },
    { new: true, runValidators: true, context: 'query' },
  )
    .then(updatedRecord => res.json(updatedRecord))
    .catch(error => next(error));
});

// error handler middleware
const errorHandler = (error, req, res, next) => {
  console.log(error);
  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malfommated id' });
  } if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message });
  }
  return next(error);
};

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));

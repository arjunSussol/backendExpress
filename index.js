const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
morgan.token('body', (req, res) => JSON.stringify(req.body));

app.use(express.json());
app.use(morgan(':body :method :status :res[content-length] - :response-time ms'));
// app.use(morgan('tiny'));
app.use(cors());
app.use(express.static('frontend'));

const dummyData = require('./db.json');

const PORT = 3001;
const currentDate = new Date();

const generateID = () => {
  const maxID = Math.ceil(Math.random()) * dummyData.length;
  return maxID + 1;
};
app.get('/api/persons', (req, res) => res.json(dummyData));

app.get('/api/info', (req, res) => res.send(`Phonebook has info for ${dummyData.length} people. <br/> ${currentDate}`));

app.get('/api/persons/:id', (req, res) => {
  const personID = Number(req.params.id);
  const person = dummyData.find((n) => n.id === personID);
  return person ? res.json(person) : res.status(404).send(`ID ${personID} doesn't exist!`);
});

app.delete('/api/persons/:id', (req, res) => {
  const personID = Number(req.params.id);
  const person = dummyData.filter(({ id }) => id !== personID);
  res.json(person);
});

app.post('/api/persons', (req, res) => {
  const { name, number } = req.body;
  if (!name || !number) {
    return res.status(400).send({ error: 'name or number is missing' });
  }

  if (dummyData.find((p) => p.name === name)) {
    return res.status(400).send({ error: 'name must be unique' });
  }

  const person = {
    id: generateID(),
    name,
    number,
  };

  dummyData.push(person);
  return res.json(dummyData);
});

app.put('/api/persons/:id', (req, res) => {
  const { name, number } = req.body;
  const personID = Number(req.params.id);
  let person = dummyData.find(({ id }) => id === personID);
  person = { ...person, name, number };
  console.log(person);

  const persons = dummyData.map((p) => (p.id === personID ? person : p));
  res.json(persons);
});

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));

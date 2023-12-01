const express = require('express');

const app = express();
app.use(express.json());

const dummyData = require('./db.json');

const PORT = 3001;
const currentDate = new Date();

app.get('/persons', (req, res) => res.json(dummyData));

app.get('/info', (req, res) => res.send(`Phonebook has info for ${dummyData.length} people. <br/> ${currentDate}`));

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));

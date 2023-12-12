const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const url = process.env.MONGODB_URL;
console.log('connecting to url');

mongoose
  .connect(url)
  .then(() => console.log('connected to Mongo DB'))
  .catch((error) => console.log('error connecting to Mongo DB', error));

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    validate: {
      validator: phone => /^(\d{2}|\d{3})-\d*$/.test(phone),
      message: props => `${props.value} is not a valid phone number!. Should follow the format XXX-XXXXXXX`,
    },
    required: [true, 'Phone number is mandatory'],
  },
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Person', personSchema);

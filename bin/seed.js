const mongoose = require('mongoose');
const User = require('../models/User.model');

const DB_NAME = 'passport-roles';

mongoose.connect(`mongodb://localhost/${DB_NAME}`, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const user = [
  {
    username: 'Admin',
    name: 'Admin',
    password: '12345',
    role: 'BOSS'
  },
];

User.create(user, err => {
  if (err) {
    throw err;
  }
  mongoose.connection.close();
});
const mongoose = require('mongoose');
const User = require('../models/User.model');
const bcrypt = require('bcrypt');


const DB_NAME = 'passport-roles';

mongoose.connect(`mongodb://localhost/${DB_NAME}`, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const password = '12345';
const saltRouds = 10;
const salt = bcrypt.genSaltSync(saltRouds);
hashPassword = bcrypt.hashSync(password, salt);

const user = [
  {
    username: 'Alumni',
    name: 'Teste Alumni',
    password: hashPassword,
    role: 'STUDENT'
  },
];

User.create(user, err => {
  if (err) {
    throw err;
  }
  mongoose.connection.close();
});
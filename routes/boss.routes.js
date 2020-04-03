const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User.model');


router.get('/new', (req, res, next) => {
    res.render('new-user');
})


router.post('/new', (req, res, next) => {

  const { username, name, password, profileImg, description, facebookId, role } = req.body;

  if (password) {
    const saltRouds = 10;
    const salt = bcrypt.genSaltSync(saltRouds);
    hashPassword = bcrypt.hashSync(password, salt);
  }

  const user = new User({ username, name, password: hashPassword, profileImg, description, facebookId, role });

  User.create(user)
    .then(() => {
      res.redirect('/user');
    })
    .catch((err) => {
      throw new Error(err);
    });
});


router.get('/delete/:id', async (req, res, next) => {
    const { id } = req.params;
  
    try {
      const user = await User.deleteOne({ _id: id });
  
      res.redirect('/user');
    } catch (error) {
      throw new Error(error);
    }
  
  })

module.exports = router;
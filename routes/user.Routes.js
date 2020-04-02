const express = require('express');
const router = express.Router();
const User = require('../models/User.model');


// add routes here
router.get('/', (req, res, next) => {

    User.find()
      .then(users => {
        res.render('user', { users });
      })
      .catch((err) => {
        throw new Error(err);
      });
});

router.get('/new', (req, res, next) => {
    res.render('new-user');
})


router.post('/new', (req, res, next) => {
    console.log(req.body);
});

module.exports = router;
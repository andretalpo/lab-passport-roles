const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const router = express.Router();

// add routes here

router.get('/login', (req, res) => {
    res.render('login', { errorMessage: req.flash('error') });
  });
  
  router.post(
    '/login',
    passport.authenticate('local', {
      successRedirect: '/user',
      failureRedirect: '/login',
      failureFlash: true,
      passReqToCallback: true
    })
  );
  
  router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
  })

module.exports = router;

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
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


router.get('/detail/:id', async (req, res, next) => {
  const { id } = req.params;

  try {
    const user = await User.findOne({ _id: id });

    res.render('user-detail', { user });
  } catch (error) {
    throw new Error(error);
  }
})

router.get('/edit/:id', async (req, res, next) => {
  const { id } = req.params;

  if(req.user._id != id){
    res.redirect('/user');
    return;
  }

  try {
    const user = await User.findOne({ _id: id });

    res.render('user-edit', { user });
  } catch (error) {
    throw new Error(error);
  }
})

router.post('/edit/:id', async (req, res, next) => {
  const { id } = req.params;

  try {
    const user = await User.update({ _id: id }, { ...req.body });

    res.redirect('/user');
  } catch (error) {
    throw new Error(error);
  }

})


module.exports = router;
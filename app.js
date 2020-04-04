require('dotenv').config();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const favicon = require('serve-favicon');
const hbs = require('hbs');
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');
const session = require('express-session');
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('connect-flash');
const User = require('./models/User.model');
const FacebookStrategy = require('passport-facebook').Strategy;


const userRoutes = require('./routes/user.routes');
const bossRoutes = require('./routes/boss.routes');


mongoose
  .connect('mongodb://localhost/passport-roles', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(x => console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`))
  .catch(err => console.error('Error connecting to mongo', err));

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

// default value for title local
app.locals.title = 'Ironhack Bureau Investigation';


  app.use(
    session({
      secret: 'our-passport-local-strategy-app',
      resave: true,
      saveUninitialized: true
    })
  );

  app.use(flash());

  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ facebookId: profile.id, username: `facebookUser${profile.id}`, name: profile.displayName, role: 'STUDENT' }, function (err, user) {
      return cb(err, user);
    });
  }
));

// passport.serializeUser(function(user, cb) {
//   cb(null, user);
// });

// passport.deserializeUser(function(obj, cb) {
//   cb(null, obj);
// });

  passport.serializeUser((user, callback) => {
    callback(null, user);
  });
  
  passport.deserializeUser((id, callback) => {
    console.log(id);

    User.findById(id._id)
      .then(user => {
        callback(null, user);
      })
      .catch(error => {
        callback(error);
      });
    });
    
  passport.use(
    new LocalStrategy((username, password, callback) => {
      User.findOne({ username })
        .then(user => {
          if (!user) {
            return callback(null, false, { message: 'Incorrect username' });
          }
          if (!bcrypt.compareSync(password, user.password)) {
            return callback(null, false, { message: 'Incorrect password' });
          }
          callback(null, user);
        })
        .catch(error => {
          callback(error);
        });
    })
  );

  
  app.use(passport.initialize());
  app.use(passport.session());

  app.get('/auth/facebook',
  passport.authenticate('facebook'));

  app.get('/auth/facebook/callback', 
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/user');
  });


const index = require('./routes/index.routes');
app.use('/', index);
const authRoutes = require('./routes/auth.routes');
app.use('/', authRoutes);

// private route middleware
app.use((req, res, next) => {
  if (req.isAuthenticated()) {
    next();
    return;
  }

  res.redirect('/login');
});

app.use('/user', userRoutes);

app.use((req, res, next) => {
  const { user } = req;
  
  if (user.role === 'BOSS') {
    next();
    return;
  }
  
  res.redirect('/user');
});

app.use('/user', bossRoutes);

module.exports = app;

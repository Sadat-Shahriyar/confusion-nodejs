var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
const User = require('../models/users');
const passport = require('passport');
const authenticate = require('../authenticate');
const cors = require('./cors'); //cross origin resource sharing

router.use(bodyParser.json());

/* GET users listing. */
router.get('/', cors.cors, authenticate.verifyUser, authenticate.verifyAdmin, function (req, res, next) {
  User.find({})
    .then((users) => {
      if (users != null) {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(users);
      }
      else {
        let err = new Error("No users found");
        err.status = 404;
        return next(err);
      }
    }, (err) => next(err))
    .catch((err) => next(err));
});


router.post('/signup', cors.corsWithOption, (req, res, next) => {
  User.register(new User({ username: req.body.username }), req.body.password, (err, user) => {
    if (err) {
      res.statusCode = 500;
      res.setHeader('Content-type', 'application/json');
      res.json({ error: err });
    }
    else {
      if (req.body.firstname) {
        user.firstname = req.body.firstname;
      }
      if (req.body.lastname) {
        user.lastname = req.body.lastname;
      }
      user.save((err, user) => {
        if (err) {
          res.statusCode = 500;
          res.setHeader('COntent-type', 'application/json');
          res.json({ error: err });
          return;
        }
        passport.authenticate('local')(req, res, () => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({ success: true, status: 'Registration Successful!' });
        })
      })
    }
  });
});


router.post('/login', cors.corsWithOption, passport.authenticate('local'), (req, res) => {
  var token = authenticate.getToken({ _id: req.user._id });

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({ success: true, token: token, status: 'You are successfully logged in!' });
})

router.get('/logout', cors.cors, (req, res, next) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else {
    var err = new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
});

router.get('/facebook/token', passport.authenticate('facebook-token'), (req, res) => {
  if (req.user) {
    var token = authenticate.getToken({ _id: req.user._id });
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({ success: true, token: token, status: 'You are successfully logged in!' });
  }
})



module.exports = router;

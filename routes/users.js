const { request } = require('express');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // https://www.npmjs.com/package/bcryptjs
const passport = require('passport');

//load user model
require('../models/Users'); //models should by singular, not multiples. oops
const User = mongoose.model('users');

//user login route
router.get('/login', (req, res) => {
  res.render('users/login');
  //res.send('login');
});

//user login route
router.get('/register', (req, res) => {
  res.render('users/register');
  //res.send('register');
});

//login form post
router.post('/login', (req, res, next) => {
  //this is to set up a local passport strategy https://www.passportjs.org/packages/passport-local/
  passport.authenticate('local', {
    successRedirect: '/questions',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);

});


//register form post
router.post('/register', (req, res) => {
  console.log(req.body);
  let errors = [];

  if(req.body.password != req.body.password2){
    errors.push({text: 'Passwords do not match'});
  }

  if(req.body.password.length < 4){
    errors.push({text: 'Password must be at least 4 characters'});
  }

  if(errors.length > 0){
    res.render('users/register', {
      errors: errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2
    });
  }else{
    User.findOne({email: req.body.email})
      .then(user => {
        if(user){
          req.flash('error_msg', 'Email already registered on this website');
          res.redirect('register');
        }
      })
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    });

    bcrypt.genSalt(10, (err, salt) => { // https://www.npmjs.com/package/bcryptjs
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if(err){
          throw err; //if bcrypt causes an error throw the error
        }
        newUser.password = hash; //override plain text password with the hash password
        newUser.save() //save the User object
          .then(user => {
            req.flash('success_msg', `${user.name}, you are now registerd and can log in`);
            res.redirect('login');
          })
          .catch(err =>{
            console.log(err);
          })
      });
    });
    console.log(newUser);
    // res.send("passed");
  }
  // console.log(req.body);
  // res.send('register');
});

//logout route
router.get('/logout', (req, res) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    req.flash('success_msg', "You have been logged out");
    res.redirect('/users/login');
  });
});

module.exports = router;
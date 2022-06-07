const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {ensureAuthenticated} = require('../helpers/auth'); //helper method to protect routes when users are not logged in

//Load question model
require('../models/Question');
const Question = mongoose.model('questions');

//questions index page
router.get('/', ensureAuthenticated,  (req, res) => {
  Question.find({user: req.user.id}).lean()
    .sort({date:'desc'})
    .then(questions => {
      res.render('questions/index', {
        questions:questions
      });
    });
});

//add question form
router.get('/add', ensureAuthenticated, (req, res) =>{
  res.render('questions/add');
});

//edit question form
router.get('/edit/:id', ensureAuthenticated,  (req, res) =>{
  Question.findOne({
    _id: req.params.id
  }).lean()
    .then(question =>{
      if(question.user != req.user.id){
        req.flash('error_msg', 'Not autherised to edit this post');
        res.redirect('/questions');
      }else{
        res.render('questions/edit', {
          question: question
        })
      }
    })
});

//process the question form
router.post('/', ensureAuthenticated,  (req, res) => {
  let errors = [];

  if(!req.body.title){
    errors.push({text: 'please add the question'});
  }

  if(!req.body.details){
    errors.push({text: 'please add an answer'});
  }

  if(errors.length > 0){
    res.render('questions/add', {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    });
  }else{
    //res.send('passed');
    const newQuestion = {
      title: req.body.title,
      answer: req.body.details,
      user: req.user.id
    }
    new Question(newQuestion)
      .save()
      .then(question => {
        req.flash('success_msg', 'Question has been added');
        res.redirect('questions');
      });
  }
  // console.log(req.body);
  // res.send('ok');
});

//process the edit form
router.put('/:id', ensureAuthenticated,  (req, res) => {
  Question.findOne({
    _id: req.params.id
  })
    .then(question => {
      // set new values
      question.title = req.body.title;
      question.answer = req.body.details;

      question.save()
        .then(question => {
          req.flash('success_msg', 'Question has been updated');
          res.redirect('/questions');
        })
    })
  //res.send('PUT');
});

//process the delete
router.delete('/:id', ensureAuthenticated,  (req, res) => {
  Question.remove({_id: req.params.id})
    .then(() => {
      req.flash('success_msg', 'Question has been removed');
      res.redirect('/questions');
    });
  //res.send("DELETE");
});

module.exports = router;
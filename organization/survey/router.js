var express = require('express'),
    router = new express.Router();

router.get('/', function(req, res) {
  res.render('account/org/survey-list');
});

/* GET /organization/survey/current */
router.get('/current', function(req, res) {
  res.render('account/org/current-survey');
});

router.get('/results', function(req, res) {
  res.render('account/org/results');
});

router.get('/results/current', function(req, res) {
  res.render('account/org/results');
});

/* GET all questions */
router.get('/question', function(req, res) {
  res.render('account/org/questions');
});

/* Retrieve specific question to edit */
router.get('/question/:id', function(req, res) {
  res.render('account/org/edit-question');
});

/* Save specific question */
router.put('/question/:id', function(req, res) {

});

/* Retrieve results of specific survey */
router.get('/results/:id', function(req, res) {
  res.render('account/org/results');
});

/* Retrieve specific survey to edit */
router.get('/:id', function(req, res) {
  var dummy = require('./dummy.json');
  res.render('account/org/edit-survey', dummy);
});

/* Retrieve page for creation of new question */
router.get('/new-question/:id', function(req, res) {
  res.render('account/org/new-question');
});

/* Save specific survey */
router.put('/:id', function(req, res) {
  res.render();
});

/* Save specific question */
router.post('/question/:id', function(req, res) {
  var dummy = require('./dummy.json');
  res.render('account/org/edit-survey', dummy);
});

/* Save specific question */
router.post('/new-question/:id', function(req, res) {
  var dummy = require('./dummy.json');
  res.render('account/org/edit-survey', dummy);});


module.exports = router;

var express = require('express'),
    router = new express.Router();

router.get('/', function(req, res) {
  res.render('account/org/survey-list');
});

router.get('/results/current', function(req, res) {
  res.render('account/org/results');
});

/* Retrieve results of specific survey */
router.get('/results/:id', function(req, res) {
  res.render('account/org/results');
});

/* GET /organization/survey/current */
router.get('/current', function(req, res) {
  res.render('account/org/current-survey');
});

/* Retrieve specific survey to edit */
router.get('/:id', function(req, res) {

});

/* Save specific survey */
router.put('/:id', function(req, res) {

});

module.exports = router;

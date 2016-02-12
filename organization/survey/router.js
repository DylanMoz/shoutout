var express = require('express'),
    router = new express.Router();

router.get('/', function(req, res) {
  res.render('account/org/survey-list');
});

/* GET /organization/survey/current */
router.get('/current', function(req, res) {
  var dummy = require('./dummy.json');
  res.render('account/org/current-survey', dummy);
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
  var id = req.params.id;
  var object = {"question": getQuestion(id), "id": id};
  res.render('account/org/edit-question', object);
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
  var id = req.params.id;
  //using the current id, find and replace the question
  if(req.body.question){
    dummy = editQuestion(id, req.body.question);
  }

  res.render('account/org/edit-survey', dummy);

});

/* Save specific question */
router.post('/new-question/:id', function(req, res) {
  var dummy = require('./dummy.json');
  var id = req.params.id;

  //edit json file
  addQuestion(id, req.body.question);
  adjustSurveyNumbers();
  res.render('account/org/edit-survey', dummy);

});

/* Delete the specified question */
router.get('/delete-question/:id', function(req, res){
  var dummy = require('./dummy.json');
  var id = req.params.id;

  deleteQuestion(id);
  adjustSurveyNumbers();

  res.render('account/org/edit-survey', dummy);
});

/* Given the id, return the question for it*/
function getQuestion(id){
  var dummy = require('./dummy.json');
  var data = dummy.array;

  for (var i in data){
    if (data[i].id == id){
      return data[i].question;
    }
  }
  console.log("No Match for Question id");
}

/* Edit the question */
function editQuestion(id, question){
  var dummy = require('./dummy.json');
  var data = dummy.array;

  for (var i in data){
    if (data[i].id == id){
      data[i].question =  question;
      return dummy;
    }
  }
  console.log("No Match for Question id, could not edit json");
}

/* Add the question to our dummy json file*/
function addQuestion(id, question){
  var dummy = require('./dummy.json');
  var data = {"number":id, "question": question, "id":id};
  dummy.array.push(data);
}


/* Correct Survey Numbers so that they go numerically, without skipping values */
function adjustSurveyNumbers(){
  var dummy = require('./dummy.json');
  var data = dummy.array;
  var num = 1;

  for (var i in data){
    data[i].number = num;
    data[i].id = num;
    num++;
  }
}

/* Delete a question */
function deleteQuestion(id){
  var dummy = require('./dummy.json');
  dummy.array.splice(id-1, 1);
}

module.exports = router;

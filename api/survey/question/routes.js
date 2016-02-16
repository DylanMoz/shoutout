var express = require('express'),
    router = new express.Router({mergeParams: true}),
    _ = require('lodash'),
    Survey = require('../../../models/Survey');

function _validQuestion(req) {
  return req.validationErrors();
}

function _isOwnSurvey(req, res, next) {
  // TODO query survey_id and check that it belongs to
  // user.organization, then pass along the survey so
  // it does not need to be queried again.
  next();
}

/**
 * Routes for /api/survey/:survey_id/question
 */

router.get('/:id', _isOwnSurvey, function(req, res) {

  Survey.findById(req.params.surveyId, function(err, dbSurvey) {
    if(err) return res.send(err);

    var question = dbSurvey.questions.id(req.params.id);
    res.json(question ? question : { error: 'Question could not be found'});
  });
});

// Create question
router.post('/', _isOwnSurvey, function(req, res) {
  var errors = _validQuestion(req);
  if (errors) res.status(400).json(errors);

  var question = req.body;
  if(!question.type)
    question.type = Survey.QuestionType.SLIDER;

  console.log('POST /api/survey/'+req.params.surveyId+'/quesion');
  console.log(question);
  Survey.findById(req.params.surveyId, function(err, dbSurvey) {
    if(err) return res.status(400).send(err);

    if(dbSurvey.state != Survey.State().DRAFT) {
      return res.status(400).json({ error: 'Cannot edit a non-draft survey question.' });
    }

    var dbQuestion = dbSurvey.questions.create(question);
    dbSurvey.questions.push(dbQuestion);

    dbSurvey.save(function(err, s) {
      if(err) return res.status(400).send(err);

      return res.json(s);
    });
  });

});

router.put('/:id', _isOwnSurvey, function(req, res) {
  var errors = _validQuestion(req);
  if (errors) res.status(400).json(errors);

  if(req.params.id !== req.body._id)
    return res.status(400).send('Url question id does not match _id of question object inside http body.')

  var question = req.body;
  if(!question.type)
    question.type = Survey.QuestionType.SLIDER;

  Survey.findOneAndUpdate(
    {
      "_id": req.params.surveyId,
      "questions._id": req.params.id
    },
    {
      "$set": {
        "questions.$": question
      }
    },
    {
      new: true
    },
    function(err, dbSurvey) {
      if(err) return res.send(err);

      return res.json(dbSurvey);
    }
  );
});

router.delete('/:id', _isOwnSurvey, function(req, res) {
  var errors = _validQuestion(req);
  if (errors) res.status(400).json(errors);

  var question_id = req.params.id;

  console.log("DELETE /survey/"+req.params.surveyId+'/question/'+req.params.id);
  console.log(question_id);
  Survey.findById(req.params.surveyId, function(err, dbSurvey) {
    if(err) return res.status(400).send(err);

    if(dbSurvey.state != Survey.State().DRAFT) {
      return res.status(400).json({ error: 'Cannot edit a non-draft survey question.' });
    }

    var dbQuestion = dbSurvey.questions.id(question_id);
    if (!dbQuestion) {
      return res.status(400).send('Could not find question to delete.');
    }

    dbQuestion.remove();

    dbSurvey.save(function(err, s) {
      if(err) return res.status(400).send(err);

      return res.json(s);
    });
  });

});

module.exports = router;

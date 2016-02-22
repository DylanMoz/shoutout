var express = require('express'),
    router = new express.Router(),
    _ = require('lodash'),
    passport = require('../../config/passport'),
    Survey = require('../../models/Survey');
    Organization = require('../../models/Organization');
    Response = require('../../models/Response');


router.use('/:surveyId/question/', require('./question/routes'));

router.get('/draft',
  passport.isOrganization,
  function(req, res) {
    console.log('GET /api/survey/draft');
    if(req.user.organization.draft_survey) {
      console.log('Org already has a draft');
      Survey.findById(req.user.organization.draft_survey, function(err, survey) {
        if (err) return res.status(400).send(err);

        res.json(survey);
      });
    } else if(req.user.organization.current_survey) {
      // Create draft based off of current survey
      console.log('Org has current survey but no draft');
      Survey.findById(req.user.organization.current_survey, function(err, survey) {
        if(err) return res.status(400).send(err);

        var draft = new Survey();
        draft.state = Survey.State().DRAFT;
        draft.organization = survey.organization;
        draft.questions = survey.questions;

        draft.save(function(err, dbDraft) {
          if(err) return res.status(400).send(err);

          req.user.organization.draft_survey = dbDraft._id;
          req.user.organization.save(function(err) {
            if(err) return res.status(400).send(err);

            return res.json(dbDraft);
          });
        });
      });
    } else {
      // Create blank draft
      console.log('Org has neither draft nor current survey. Creating draft');
      var draft = new Survey();
      draft.state = Survey.State().DRAFT;
      draft.organization = req.user.organization._id;

      draft.save(function(err, dbDraft) {
        if(err) return res.status(400).send(err);

        req.user.organization.draft_survey = dbDraft._id;
        console.log('Attached draft to org, saving org...');
        req.user.organization.save(function(err, org) {
          if (err) return res.status(400).send(err);

          return res.json(dbDraft);
        });
      });
    }
  }
);

router.post('/publish/draft',
  passport.isOrganization,
  function(req, res) {
    if (!req.user.organization.draft_survey)
      return res.status(400).send("Organization does not have a draft");


    var errors = req.validationErrors();
    if (errors) return res.status(400).json(errors);

    Survey.findById(req.user.organization.draft_survey, function(err, dbDraft) {
      if(err)
        return res.status(400).send(err);

      if(dbDraft.state != Survey.State().DRAFT)
        return res.status(400).json({ error: "Cannot publish a non-draft survey." });

      dbDraft.state = Survey.State().LOCKED;
      req.user.organization.draft_survey = null;
      req.user.organization.current_survey = dbDraft._id;

      req.user.organization.save(function(err) {
        if (err) return res.send(err);

        dbDraft.save(function(err) {
          if(err) return res.send(err);

          return res.json(dbDraft);
        });
      });
    });
  }
);

router.get('/current', function(req, res) {
  if (req.user.organization) {
   if (!req.user.organization.current_survey)
      return res.status(400).send("Organization does not have a current survey");

    var errors = req.validationErrors();
    if (errors) return res.status(400).json(errors);

    Survey.findById(req.user.organization.current_survey, function(err, dbSurvey) {
      if(err)
        return res.status(400).send(err);

      if(dbSurvey.state != Survey.State().LOCKED)
        return res.status(400).json({ error: "Current survey is a draft" });

      return res.json(dbSurvey);
    });
  } else {
    Organization.findById(req.user.employee.organization, function(err, dbOrganization) {
      if (err)
        return res.status(400).send(err);

     if (!dbOrganization.current_survey)
        return res.status(400).send("Organization does not have a current survey");

      var errors = req.validationErrors();
      if (errors) return res.status(400).json(errors);

      Survey.findById(dbOrganization.current_survey, function(err, dbSurvey) {
        if(err)
          return res.status(400).send(err);

        if(dbSurvey.state != Survey.State().LOCKED)
          return res.status(400).json({ error: "Current survey is a draft" });

        return res.json(dbSurvey);
      });
    })


  }
});

router.post("/submit", passport.isEmployee, function(req, res) {
  var survey = req.body;
  var response = new Response();
  response.survey = survey._id;
  response.employee = req.user.employee;
  response.answers = survey.questions;
  response.save(function(err, dbResponse) {
    if (err) return res.status(400).send(err);

    return res.json({});
  });
});

router.get("/results", passport.isOrganization, function(req, res) {
  if (!req.user.organization.current_survey) {
    return res.status(400).send("Organization does not have a current survey")
  }
  Response.find({survey: req.user.organization.current_survey}, function(err, results) {
    if (err) return res.status(400).send(err);
    return res.json(results);
  });
});

module.exports = router;

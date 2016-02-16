var express = require('express'),
    router = new express.Router(),
    _ = require('lodash'),
    passport = require('../../config/passport'),
    Survey = require('../../models/Survey');

router.use('/:surveyId/question/', require('./question/routes'));

router.get('/draft',
  passport.isOrganization,
  function(req, res) {
    console.log('GET /api/survey/draft');
    if(req.user.organization.draft_survey) {
      console.log('Org already has a draft');
      Survey.findById(req.user.organization.draft_survey, function(err, survey) {
        if (err) return res.send(err);

        res.json(survey);
      });
    } else if(req.user.organization.current_survey) {
      // Create draft based off of current survey
      console.log('Org has current survey but no draft');
      Survey.findById(req.user.organization.current_survey, function(err, survey) {
        if(err) return res.send(err);

        var draft = new Survey();
        draft.state = Survey.State().DRAFT;
        draft.organization = survey.organization;
        draft.questions = survey.questions;

        draft.save(function(err, dbDraft) {
          if(err) return res.send(err);

          req.user.organization.draft_survey = dbDraft._id;
          req.user.organization.save(function(err) {
            if(err) return res.send(err);

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
        if(err) return res.send(err);

        req.user.organization.draft_survey = dbDraft._id;
        console.log('Attached draft to org, saving org...');
        req.user.organization.save(function(err, org) {
          if (err) return res.send(err);

          return res.json(dbDraft);
        });
      });
    }
  }
);

router.post('/publish/draft',
  passport.isOrganization,
  function(req, res) {
    req.assert('draft._id', 'Draft must have an _id').notEmpty();

    var errors = req.validationErrors();
    if (errors) return res.status(400).json(errors);

    Survey.findById(req.body.draft._id, function(err, dbDraft) {
      if(dbDraft.state != Survey.State().DRAFT)
        return res.status(400).json({ error: "Cannot publish a non-draft survey." });

      dbDraft.state = Survey.State().LOCKED;
      req.user.organization.current_survey = draft._id;

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

module.exports = router;

var express = require('express'),
    router = new express.Router();

router.get('/dashboard',function(req, res) {
  res.render('account/org/dashboard');
});

router.use('/survey', require('./survey/router'));

module.exports = router;

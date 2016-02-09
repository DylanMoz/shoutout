var express = require('express'),
    router = new express.Router();

router.get('/dashboard', function(req, res) {
  res.redirect('account/employee/dashboard');
});

router.use('/survey', require('./survey/router'));

module.exports = router;

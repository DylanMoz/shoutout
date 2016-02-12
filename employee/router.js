var express = require('express'),
    router = new express.Router();

/* GET /employee/dashboard */
router.get('/dashboard', function(req, res) {
  res.render('account/employee/dashboard');
});



router.use('/survey', require('./survey/router'));

module.exports = router;

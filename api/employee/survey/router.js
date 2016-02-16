var express = require('express'),
    router = new express.Router();

/* Retrieve current survey */
router.get('/current', function(req, res) {
  res.render('account/employee/take-survey');
});

/* Save survey submission */
router.post('/current', function(req, res) {

});

module.exports = router;

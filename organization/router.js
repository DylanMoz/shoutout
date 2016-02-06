var express = require('express'),
    router = new express.Router();

router.get('/dashboard',function(req, res) {
  res.render('account/org/dashboard');
});

module.exports = router;

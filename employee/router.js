var express = require('express'),
    router = new express.Router();

router.get('/dashboard',function(req, res) {
  res.redirect('account/employee_dashboard');
});

module.exports = router;

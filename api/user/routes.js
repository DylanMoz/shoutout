var express = require('express'),
    router = new express.Router();

router.get('/',function(req, res) {
  res.json({
    user: req.user
  });
});

module.exports = router;

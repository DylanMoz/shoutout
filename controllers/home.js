/**
 * GET /
 * Home page.
 */
exports.index = function(req, res) {
  if (req.user) {
    res.redirect('/organization/dashboard');
  } else {
    res.redirect('/index');
  }
};

exports.getIndex = function(req, res) {
  res.render('home', {
    title: 'Home'
  });
}

/**
 * GET /edit-survey
 * Forgot editSurvey page.
 */
exports.getEditSurvey = function(req, res) {
  if (req.isAuthenticated()) {
    res.render('account/org/edit-survey', {
    title: 'Edit Survey'
  });
  }

};


/**
 * GET /
 * Home page.
 */
exports.index = function(req, res) {
  if (req.user && req.user.organization) {
    res.redirect('/organization/dashboard');
  } else if (req.user && req.user.employee) {
    res.redirect('/employee/dashboard');
  } else {
    res.redirect('/index');
  }
};

exports.getIndex = function(req, res) {
  res.render('home', {
    title: 'Home'
  });
};




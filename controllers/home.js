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

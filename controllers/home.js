/**
 * GET /
 * Home page.
 */
exports.index = function(req, res) {
  if (req.user) {
    res.redirect('/account');
  } else {
    res.redirect('/index');
  }
};

exports.getIndex = function(req, res) {
  res.render('home', {
    title: 'Home'
  });
}

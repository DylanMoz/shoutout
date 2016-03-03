/**
 * GET /
 * Home page.
 */
exports.index = function(req, res) {
  console.log('home controller index');
  if (req.user && req.user.organization) {
    res.redirect('/organization/dashboard');
  } else if (req.user && req.user.employee) {
    res.redirect('/employee/dashboard');
  } else {

  var random_num = Math.random();
    console.log(random_num);

    if (random_num > 0.5) {
        console.log("NEW");
        res.redirect('/index');
    } else {
      console.log("OLD");
      res.redirect('http://shoutout-old.herokuapp.com/index');
    }
  }
};

exports.getIndex = function(req, res) {
  res.render('home', {
    title: 'Home'
  });
};

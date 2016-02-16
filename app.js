/**
 * Module dependencies.
 */
 console.log('Begin app.js');

var express = require('express');
var cookieParser = require('cookie-parser');
var compress = require('compression');
var favicon = require('serve-favicon');
var session = require('express-session');
var bodyParser = require('body-parser');
var logger = require('morgan');
var errorHandler = require('errorhandler');
var lusca = require('lusca');
process.stdout.write('1');
var methodOverride = require('method-override');
process.stdout.write('2');
var dotenv = require('dotenv');
process.stdout.write('3');
var MongoStore = require('connect-mongo/es5')(session); // Undefined issue occurs in heroku
process.stdout.write('4');
var flash = require('express-flash');
var path = require('path');
var mongoose = require('mongoose');
var passport = require('passport');
var expressValidator = require('express-validator');
var sass = require('node-sass-middleware');
var _ = require('lodash');

/* Models */
require('./models/Employee');
require('./models/Organization');
require('./models/User');
require('./models/Survey');

//var exphbs = require("express-handlebars");
  //hbs = exphbs.create(config.hbs);

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 *
 * Default path: .env
 */
dotenv.load({ path: '.env.example' });
console.log('Var decl and env finished');
/**
 * Controllers (route handlers).
 */
var homeController = require('./controllers/home');
var userController = require('./controllers/user');
var contactController = require('./controllers/contact');

/**
 * API keys and Passport configuration.
 */
var passportConf = require('./config/passport');

/**
 * Create Express server.
 */
console.log('Calling Express');
var app = express();

/**
 * Connect to MongoDB.
 */
mongoose.connect(process.env.MONGOLAB_URI || process.env.MONGODB);
mongoose.connection.on('error', function() {
  console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
  process.exit(1);
});
console.log('Mongoose connect');
/**
 * Express configuration.
 */
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
//app.engine(".html", hbs.engine);
//app.set("view engine", ".html");
app.use(compress());
app.use(sass({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  debug: true,
  sourceMap: true,
  outputStyle: 'expanded'
}));
app.use(logger('dev'));
app.use(favicon(path.join(__dirname, 'public', 'favicon.png')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(methodOverride());
app.use(cookieParser());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
  store: new MongoStore({
    url: process.env.MONGOLAB_URI || process.env.MONGODB,
    autoReconnect: true
  })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
/*
app.use(lusca({
  csrf: true,
  xframe: 'SAMEORIGIN',
  xssProtection: true,
  angular: true
}));
*/
app.use(function(req, res, next) {
  res.locals.user = req.user;
  res.locals.path = req.path;
  next();
});
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));


/**
 * Primary app routes.
 */
app.get('/', homeController.index);
app.get('/index', homeController.getIndex);
app.get('/login', userController.getLogin);
app.post('/login', userController.postLogin);
app.get('/logout', userController.logout);
app.get('/forgot', userController.getForgot);
app.post('/forgot', userController.postForgot);
app.get('/reset/:token', userController.getReset);
app.post('/reset/:token', userController.postReset);
app.get('/signup', userController.getSignup);
app.post('/signup', userController.postSignup);
app.get('/signup/:id', userController.getEmployeeSignup);
app.post('/signup/:id', userController.postEmployeeSignup);
app.get('/contact', contactController.getContact);
app.post('/contact', contactController.postContact);

app.use('/docs', function(req, res) { res.sendfile('docs/index.html')})

app.get('/partials/*', function(req,res) {
  console.log('partial request: ' + req.params[0]);
  res.render('partials/' + req.params[0]);
});

/* Starting Application Pages */
app.get('/employee*',
  passportConf.isAuthenticated,
  passportConf.isEmployee,
  function(req, res) {
    res.render('employee_app');
  }
);

app.get('/organization*',
  passportConf.isAuthenticated,
  passportConf.isOrganization,
  function(req, res) {
    res.render('organization_app');
  }
);

/* API */
app.use('/api/user',
  passportConf.isAuthenticated,
  require('./api/user/routes'));

app.use('/api/survey',
  passportConf.isAuthenticated,
  require('./api/survey/routes'));


/* deprecated */
app.get('/account', passportConf.isAuthenticated, userController.getAccount);
app.post('/account/profile', passportConf.isAuthenticated, userController.postUpdateProfile);
app.post('/account/password', passportConf.isAuthenticated, userController.postUpdatePassword);
app.post('/account/delete', passportConf.isAuthenticated, userController.postDeleteAccount);
app.get('/account/unlink/:provider', passportConf.isAuthenticated, userController.getOauthUnlink);

/**
 * OAuth authentication routes. (Sign in)
 */
app.get('/auth/google', passport.authenticate('google', { scope: 'profile email' }));
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), function(req, res) {
  res.redirect(req.session.returnTo || '/');
});

/**
 * Error Handler.
 */
app.use(errorHandler());

/**
 * Start Express server.
 */
app.listen(app.get('port'), function() {
  console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});

module.exports = app;

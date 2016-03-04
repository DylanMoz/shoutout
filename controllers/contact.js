var express = require('express');
var nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport")
var app = express();
var User = require('../models/User');
var mailOpts, transporter

var transporter = nodemailer.createTransport('smtps://ShoutOutWorkApp%40gmail.com:Fusionfusio@smtp.gmail.com');


/**
 * GET /contact
 * Contact form page.
 */
exports.getContact = function(req, res) {
 /* res.render('contact', {
    title: 'Contact'
  });*/
};

/**
 * POST /contact
 * Send a contact form via Nodemailer.
 */
exports.postContact = function(req, res) {
  req.assert('email', 'Email is not valid').isEmail();

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/contact');
  }

  var from = "ShoutOutWorkApp@gmail.com";
  var to = req.body.email;
  var body = "Hello!! Join us at ShoutOut by signing up with the following link!\n\n" + "http://shoutoutbeta.herokuapp.com/signup/" + req.user.organization._id;
  var subject = 'Contact Form | Hackathon Starter';

  var mailOpts = {
    from: from,
    to: to,
    subject: subject,
    text: body
  };

  transporter.sendMail(mailOpts, function(err, response) {
    if (err) {
          console.log("ERRORS");
          console.log(err.message);
          console.log("I guess it was printed");
      req.flash('errors', { msg: err.message });
      return res.redirect('/contact');
    }
    req.flash('success', { msg: 'Email has been sent successfully!' });
    res.redirect('/');
  });
};

var express = require('express');
var path = require('path');

var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');
var favicon = require('serve-favicon');
var logger = require('morgan');
var methodOverride = require('method-override');
var session = require('express-session');
var bodyParser = require('body-parser');
var multer = require('multer');
var errorHandler = require('errorhandler');

/*
Load controllers
*/
var homeController = require('./controllers/home');
var contactController = require('./controllers/contact');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(methodOverride());
app.use(session({ resave: true,
                  saveUninitialized: true,
                  secret: 'uwotm8' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer());
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Main routes.
 */
 app.get('/', homeController.index);
 app.get('/contact', contactController.index)
 app.post('/contact', function(req, res) {
 	var data = {
 		email: req.body.email,
 		subject: req.body.subject,
 		message: req.body.message
 	};
 	console.log('TEstging ..... ');
 	console.log(data.email);
 	//create the nodemailer
 	var client = nodemailer.createTransport(sgTransport({
        auth: {
          api_user: '<Your Email>',
          api_key: '<Your Password>'
        }
    }));
 	var mailOptions = {
        to: data.email,
        from: 'fake@demo.com',
        subject: data.subject,
        text: data.message,
        html: '<b>Hello</b>'
    };
    //send
    client.sendMail(mailOptions, function(err, info) {
    	//re-render contact page with message
    	var message = null;
    	if(err){
    		message = "An error has occured " + err;
    		console.log(err);
    	} else {
    		message = "Email has been sent!";
    		console.log('Message sent: ' + info.response);
    	}
        res.render('contact', {
         	title: "contact",
    		message: "Email has been sent!"
  		});
      });
 });

// error handling middleware should be loaded after the loading the routes
if ('development' == app.get('env')) {
  app.use(errorHandler());
}

app.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
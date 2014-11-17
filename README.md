## GET STARTED

Find a tutorial on this on my [portfolio site](http://www.wesduff.com/tutorial-nodemailer-sendgrid)

    $ git clone https://github.com/wesleyduff/nodemailer-sendgrid.git

    $ npm install

Start the server on port 3000

    $ node server

Basic light version of a basic Node Express Jade install with 
  -  nodemailer
  -  sendGrid

This is a good base to start off with an app that will use an email service.

# TUTORIAL

In this tutorial we will use the [github][1] code provided from a previous post to get our Node + Express + Jade app up and running. Then we will talk about how to send emails using [nodemailer][2] and [SendGrid][3].

Find the finished code on github [here][4]

<!--more-->

## GET STARTED

I will be writing this tutorial to be directly used by windows 8.1. Change the line commands as needed for your OS.

First we need to create a file and get our code.

    $ mkdir nodemailer_example
    $ cd nodemailer_example
    

Next we need to get our code from github so we do not have to create everything from scratch. A tutorial was written about the code we are about to download on one of my previous posts that can be found [here][1].

Make sure you have git installed. If not you can install it [here][5];

Next we need to clone the repository

    $ git clone https://github.com/wesleyduff/basic_node_express_jade_setup.git
    

Now you will need to install all of the dependencies. You will need to have node.js installed. If you do not you can download the installer [here][6].

    $ npm install
    

Now you can run the Node server and see our basic Home Page file showing *Home Page* by running

    $ node server
    

<a href="http://sendgrid.com/" target="_blank"><img src="https://camo.githubusercontent.com/16800ac336b7e71aa4dec640abdd44505af0fe25/687474703a2f2f69616e646f75676c61732e636f6d2f70726573656e746174696f6e732f7079636f6e6361323031322f6c6f676f732f73656e64677269645f6c6f676f2e706e67" width="200" data-canonical-src="http://iandouglas.com/presentations/pyconca2012/logos/sendgrid_logo.png" style="max-width:100%;" /></a>

Now you will need to set up a **Free** account at [SendGrid][3]

After you created your account then you need to install the necessary dependencies for this application into the package.json file. You can do so by running this command in the command line window.

    $ npm install nodemailer nodemailer-sendgrid-transport express-flash cookie-parser --save
    

**note** Remember that *--save* adds the dependency to our package.json

[Nodemailer][7] and [nodemailer-sendgrid-transport][8] will be the applications used to send our emails.Express flash will be used for displaying messages on the *contact.jade* file, and cookie-parser is required as a dependency by express flash.

Add this code to the top of *server.js*

    var nodemailer = require('nodemailer');
    var sgTransport = require('nodemailer-sendgrid-transport');
    var flash = require('express-flash');
    var cookieParser = require('cookie-parser');
    

Next we need to add a *contact* controller Add a files called **contact.js** inside the *controllers* folder, and that file should contain the code below.

    /**
    * GET /
    * Home page. 
    */
    
    exports.index = function(req, res) {
     res.render('contact', {
       title: 'Contact'
     });
    }
    

We set an index method that renders the *contact* page of our app.

Next we need to gain access to our contact's controller. We can gain access by adding

    var contactController = require('./controllers/contact');
    

to line 20, under our homeController variable.

Next we need to set a route so our app knows where to direct us when we want to view the contact page. inside our *server.js* file on line 39, below our route to the homeController.index add the code below

     app.get('/contact', contactController.index)
    

Now we need to add a view file so our app can render our request. Create a new jade file under views called **contact.jade**. Before we add our code to our contact.jade file lets add bootstrap and jQuery to our *layout.jade* file. Add the code below right below the title.

    link(rel='stylesheet', href='//netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css')
    script(src='//ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js')
    script(src='//netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min.js')
    

Now we need to add our code to our *contact.jade* file.

extends layout

    block content
      if messages.info
        .alert.alert-info.fade.in
          button.close(type='button', data-dismiss='alert')
            span.icon-close-circled
          for info in messages.info
            div= info.msg
      form(method='POST')
        legend Send Email
        .form-group
          label(for='email') Email
          input.form-control(type='text', name='email', autofocus)
          label(for='subject') Subject
          input.form-control(type="text", name="subject")
          label(for="message") message
          textarea.form-control(name="message")
        button.btn.btn-primary(type='submit') Send
    

We are using express-flash to display messages. On line 3 we check to see if messages has any info messages, if there is then we create a bootstrap alert and display the message.

Now we need to handle the response when the send button has been clicked. You can set this up one step further by using the [express validator][9] but this is not part of this tutorial.

Now we need to add the route for our contact post. We will add this to our server.js file for simplicity, but I would modularize this code inside your contactController.

On line 45 or under your app.get('/contact..... Add the code below

    app.post('/contact', function(req, res) {
        var data = {
            email: req.body.email,
            subject: req.body.subject,
            message: req.body.message
        };
    
        //create the nodemailer
        var client = nodemailer.createTransport(sgTransport({
            auth: {
              api_user: '<YOUR LOGIN>',
              api_key: '<YOUR PASSWORD>'
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
                console.log(error);
            } else {
                message = "Email has been sent!";
                console.log('Message sent: ' + info.response);
            }
            req.flash('info', {msg: message});
            res.redirect('/contact');
          });
    });
    

Now run `node server` and open you browser to `localhost:3000/contact` or the port you are pointing to and fill out the form and click send. If you have any issues running node server then check out the package.json file from the joining [github][4] page and make sure your dependencies list looks the same as mine.

Next review your command window and you will see the message "Message sent: ...." You will also be redirected back to the contact page and a message should appear at the top saying "Email sent".

Now you are sending emails. There is a lot more you can do with sendGrid and they also have a lot of handy tools to watch the flow of emails going through your site.

## Hope you enjoyed this post.

 [1]: https://github.com/wesleyduff/basic_node_express_jade_setup
 [2]: http://www.nodemailer.com/
 [3]: http://sendgrid.com/
 [4]: https://github.com/wesleyduff/nodemailer-sendgrid
 [5]: http://git-scm.com/
 [6]: http://nodejs.org/download/
 [7]: https://www.npmjs.org/package/nodemailer
 [8]: https://www.npmjs.org/package/nodemailer-sendgrid-transport
 [9]: https://github.com/ctavan/express-validator

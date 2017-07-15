const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

//if PORT does not exist, make it 3000
const port = process.env.PORT || 3000;

var app = express();

//lets hbs know where we're going to keep our partials
hbs.registerPartials(__dirname + '/views/partials');
//we tell express that we want to use hbs as the view engine
app.set('view engine', 'hbs');

//'next' exists to tell express when the middleware function is done
app.use((req,res,next) => {
  var now = new Date().toString();

  var log = `${now}: ${req.method} ${req.url}`;
  fs.appendFile('server.log',log + '\n', (err) => {

      if(err)
      {
        console.log('unable to log into server.log');
      }
  });
    console.log(log);
  next();//we must call next or else the other methods will not be able to be called;
});

/**
//this method stop everything below from executing
app.use((req,res,next) => {

  res.render('maintenance.hbs',{
    pageTitle: 'Maintenance',
    welcomeMessage: 'Sorry!, our page is currently undergoing maintenance'
  });

});
*/

//__dirname stores the path of your projects directory
  //express.static directly serves static files from whatever directory is passed in
app.use(express.static(__dirname + '/public'));

//helpers are methods that are called upon all hbs templates to return some dynamic data
hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
});

//req stores information about the request coming in
//res has a bunch of mehtods available to respond to the request
app.get('/', (req,res) =>{
  //send html
  //res.send('<h1>Hello Express</h1>');

  //send object in form of JSON
  /**res.send({
    name: 'Alex',
    likes: ['cats','poached eggs','memes']
    });    */


    res.render('home.hbs',{
      pageTitle: 'Home',
      currentYear: new Date().getFullYear(),
      welcomeMessage: 'Welcome, Valued User!'
    });
});

app.get('/about', (req,res) => {
  res.render('about.hbs',{
    pageTitle: 'About Page',
    currentYear: new Date().getFullYear()
  });
});

app.get('/bad', (req,res) => {
  res.send({
    errorMessage: 'bad request!'
  });
});

app.listen(port, () => {
  console.log(`server is up on port ${port}`);
});

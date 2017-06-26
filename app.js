const express = require('express');
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const parseurl = require('parseurl');

const app = express();


var users = [
  {'username':'braxton', 'password':'1234'}
];


app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, "public")));

app.use(session({
  secret:'keyboard car',
  resave: false,
  saveUninitialized: true
}));


app.use(function (req, res, next) {
var pathname = parseurl(req).pathname;

if(!req.session.user && pathname != '/login/'){
  res .redirect('/login/');
}else{
  next();
}
});

app.get('/login/', function (req, res) {
  res.render('index', {});
});

app.get('/', function (req, res) {

  res.send('Thank you for logging in ' + req.session.user.username + '!');
});

app.post('/login/', function (req, res) {
  var username = req.body.username;
  var password = req.body.password;

  var person = users.find(function (user) {
    return user.username == username;
  });

  if(person && person.password == password){
    req.session.user = person;
  }
  if (req.session.user){
    res.redirect('/');
  }else{
    res.redirect('/login/');
  }

});



app.listen(3000);

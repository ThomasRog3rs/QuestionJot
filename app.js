const express = require('express');
//I am using the handlebars template engine temporarly until me and kyle get together and use react.
const exphbs = require('express-handlebars');
const methodOverride = require('method-override'); //http://expressjs.com/en/resources/middleware/method-override.html
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const res = require('express/lib/response');
const path = require('path');
const passport = require('passport');

//init app
const app = express();
const port = process.env.PORT || 5000; //we only want to use port 5000 for local development

// app.listen(process.env.PORT || 5000, function(){
//   console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
// });

//load routes
const questions = require('./routes/questions');
const users = require('./routes/users');

//passport config
require('./config/passport')(passport);

//database config
const db = require('./config/database');

//map global promise - get rid of warning
mongoose.Promise = global.Promise;

//connect to mongoose: https://mongoosejs.com/docs/guide.html
mongoose.connect(db.mongoURI)
.then(() => {
  console.log('MongoDB is connected!');
})
.catch(err => {
  console.log(err);
});

//using express middleware: http://expressjs.com/en/guide/using-middleware.html
// app.use(function(req, res, next) {
//   console.log(Date.now());
//   req.name = "Thomas Rogers"; //this sets a variable for us to use
//   next();
// });

//handlebars middleware
app.engine('handlebars', exphbs.engine());
// app.engine('handlebars', exphbs.engine( {defaultLayout: 'default', handlebars: allowInsecurePrototypeAccess(_handlebars)}));
app.set('view engine', 'handlebars');
app.set('views', './views');

//body parser middleware: http://expressjs.com/en/resources/middleware/body-parser.html
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//static folder middleware (this is to set up the public folder as a static path)
app.use(express.static(path.join(__dirname, 'public')));

//method override middleware
app.use(methodOverride('_method'));

//express session middleware
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true
}));

//passport middleware
app.use(passport.initialize());
app.use(passport.session());


//connect flash middleware
app.use(flash());

//global vars (custom middleware)
app.use(function(req, res, next){
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.err = req.flash('error');
  res.locals.user = req.user || null;
  next(); //call the next middleware
});

//index route
app.get('/', (req, res) => {
  const title = 'Welcome';
  res.render('index', {
    title: title
  });
});

//about route
app.get('/about', (req, res) => {
  // console.log(req.name);
  //res.send('ABOUT');
  res.render('about');
});

//use routes
app.use('/questions', questions);
app.use('/users', users);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const expressSession = require('express-session');
const flash = require('connect-flash');
const bodyParser = require('body-parser'); 
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const passport = require('passport');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(flash());
app.use(
  expressSession({
    resave: false,
    saveUninitialized: false,
    secret: 'hey hey hey',
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(usersRouter.serializeUser());
passport.deserializeUser(usersRouter.deserializeUser());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json()); // Add this line
app.use(bodyParser.urlencoded({ extended: true })); // Add this line

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;

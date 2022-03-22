  var createError = require('http-errors');
  var express = require('express');
  var path = require('path');
  var cookieParser = require('cookie-parser');
  var logger = require('morgan');
  const mongoose = require('mongoose')
  const expressHbs = require('express-handlebars');
  const Handlebars = require('handlebars')
  const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
  const session = require('express-session');
  const c_flash = require('connect-flash');
  const passport = require('passport');
  const bodyParser = require('body-parser');




  var indexRouter = require('./routes/index');
  var usersRouter = require('./routes/users');
  const { handlebars } = require('hbs');

  var app = express(); 

  mongoose.connect('mongodb://localhost/eShop', (error) => {
    if (error) {
      console.log(error)
    }
    console.log("DB CONECTED")
  })

  require('./config/passport')

  // view engine setup
  app.engine('.hbs', expressHbs({ defaultLayout: 'layout', extname: '.hbs', handlebars: allowInsecurePrototypeAccess(Handlebars),helpers:{
    add : function(value){
      return value + 1;
    },
    minus : function(value){
      if(value <= 1){
        return true
      }else{
        return false
      }
    }
  } }));
  app.set('view engine', '.hbs');

  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  //app.use(bodyParser.json());
  app.use(cookieParser());
  app.use(session({
    secret: '3boda',
    saveUninitialized: false,
    resave: true,
  }));
  app.use(c_flash());
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(express.static(path.join(__dirname, 'public')));
  


  app.use('/', indexRouter);
  app.use('/users', usersRouter);

  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    next(createError(404));
  });

  // error handler
  app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });

  module.exports = app;

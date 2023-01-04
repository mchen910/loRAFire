var createError = require('http-errors');
var express = require('express');
var mongoose = require('mongoose');

var app = express();

const indexRouter = require('./routes/index');
const apiRouter = require('./routes/api');

// Setting up database connection
require('dotenv').config();
var mongoDB = process.env.DATABASE_URL;

mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('connection', () => console.log("Successfully connected"));
db.on('error', () => console.error.bind(console, 'MongoDB connection error'));


// Set up routes


app.use('/', indexRouter);
app.use('/api/v1', apiRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
  });
  
  // error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: err
      });
  });
  

module.exports = app;
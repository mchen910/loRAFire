var createError = require('http-errors');
var express = require('express');
var mongoose = require('mongoose');
var cors = require('cors');

var app = express();

const indexRouter = require('./routes/index');
const apiRouter = require('./routes/api');

require('dotenv').config({ path: "./.env"});

// Setting up database connection
var mongoDB = process.env.DATABASE_URI;
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;


var db = mongoose.connection;
db.on('connection', () => console.log("Successfully connected"));
db.on('error', () => console.error.bind(console, 'MongoDB connection error'));


// Validate the JSON data
app.use(express.json());
app.use(cors());

// Set up routes
app.use('/', indexRouter);
app.use('/api/', apiRouter);


// catch 404 and forward to error handler
app.use( (req, res, next) => next(createError(404)) );
  
// error handler
app.use((err, req, res, next) => {
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
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressHbs = require('express-handlebars');
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');

var flash = require('connect-flash');
var expressValidator = require("express-validator");
var MongoStore = require('connect-mongo')(session);
//var seed=require('./seed/product-seeder')
var app = express();

var routes = require('./routes/index');
var userRoutes = require('./routes/user');
var adminRouter = require('./routes/auth');

mongoose.connect('mongodb://localhost/Shopping');
require('./config/passport');

// view engine setup
app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', '.hbs');
// app.engine('.ejs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}));
// app.set('view engine', '.hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
//app.use(expressValidator());
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));
app.use(session({
    secret: 'mysupersecret',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}));
app.use(function(req, res, next) {
   req.session.cookie.maxAge = 18000*3*60; // 3 hours
    next();
});
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('/public/images'));
app.use(express.static(__dirname + '/static'));

app.use(function(req, res, next) {
    res.locals.session = req.session;
    next();
});


// app.use(function(req, res, next) {
//     if (!req.user)
//         res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
//     next();
// });

app.use('/user', userRoutes);
app.use('/', routes);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.listen(8000,function(err){
if(err){
    console.log(err)
}
else{
    console.log("listening at port 3000");
}
})

module.exports = app;

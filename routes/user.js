var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');
var User =require('../models/user')
var Order = require('../models/order');
var Cart = require('../models/cart');

var csrfProtection = csrf();
router.use(csrfProtection);

router.get('/profile', isLoggedIn, function (req, res, next) {
    Order.find({user: req.user}, function(err, orders) {
        if (err) {
            return res.write('Error!');
        }
        var cart;
        orders.forEach(function(order) {
            cart = new Cart(order.cart);
            order.items = cart.generateArray();
        });
        res.render('user/profile', { orders: orders });
    });
});

router.get('/logout', isLoggedIn, function (req, res, next) {
    req.logout();
    req.session.oldUrl = null;
    if (!req.user) 
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.redirect('/');
});

router.use('/', notLoggedIn, function (req, res, next) {
    next();
});

router.get('/signup', function (req, res, next) {
    var messages = req.flash('error');
    res.render('user/signup', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

router.post('/signup', passport.authenticate('local.signup', {
    failureRedirect: '/user/signup',
    failureFlash: true
}), function (req, res, next) {
    if (req.session.oldUrl) {
        var oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
    } else {
        res.redirect('/user/profile');
    }
});

router.get('/signin', function (req, res, next) {
    
    var messages = req.flash('error');
    res.render('user/signin', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

router.post('/signin',checkAdmin,passport.authenticate('local.signin', {failureRedirect: '/user/signin',failureFlash: true}), function (req, res, next) {

     if (req.session.oldUrl) {
        var oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
    } else {
        res.redirect('/user/profile');
    }
    
});

module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

function notLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

function checkAdmin(req,res,next){
    var email=req.body.email;
    User.findOne({'email':email},function(err,data){
        console.log("data are " ,data)
       // console.log(data.email)
       if(err){
           res.send('no search item is avaliable')
       }
       else{
             if(data.email === "admin@gamil.com"){
                console.log("admin is look");
                res.redirect('/admin/adminIndex');
             }
             else{
                 return next();
             }
        
        
        
       }
  })
}

// }
// function requireAdmin(req,res,next) {
//         var name=req.body.email;
    
//       User.findOne({ name }, function(err, user) {
//         if (err) { return next(err); }
  
//         if (!user) { 
//           // Do something - the user does not exist
//         }
  
//         if (!user.admin) { 
//           // Do something - the user exists but is no admin user
//         }
  
//         // Hand over control to passport
//         next();
//       });
    
//   }
var express = require('express');
var router = express.Router();
var Product = require('../models/product');
var Cart = require('../models/cart');
var Order=require('../models/order');
var Image=require('../models/image');
var Detail=require('../models/details');
var Comment=require('../models/comment');
var multer=require('multer');
const path=require('path');
  const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
     
     // cb(null,Date.now() + '.jpg');
    cb(null,Date.now() + '.jpg');
    path.extname(file.originalname);
    //cb(null,new Date().toISOString() + file.originalname);
    }
  });
  const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };
  
  const upload = multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
  });
//var upload=multer({storage:storage});

//serach
router.post('/search',function(req,res){
    var title=req.body.title;
       Detail.find({title},function(err,data){
                    

          if(err){
              res.send('no search item is avaliable')
              title="";
          }
          else{
                if(!data){
                 
                }
            console.log(data);
            var productChunks = [];
            var chunkSize = 3;
                for (var i = 0; i < data.length; i += chunkSize) {
                productChunks.push(data.slice(i, i + chunkSize));
                }
            res.render('shop/index', { products: productChunks});
           
          }
     })



})


router.use(function (req, res, next) {
    res.locals.login = req.isAuthenticated();
    next();
});



router.get('/', function (req, res, next) {
 var successMsg= req.flash('success')[0];
 
   
    Detail.find(function (err, docs) {
        Comment.find(function(err,data){
            //console.log("comments sasdas is",data)
            const comment=[];
            for(var i=0; i<data.length;i++){
                comment.push(data)
            }
             comment.push(data)
      
        
            var productChunks = [];
            var chunkSize = 3;
            for (var i = 0; i < docs.length; i += chunkSize) {
                productChunks.push(docs.slice(i, i + chunkSize));
            }
            console.log(productChunks)
           var lol="hahahahah"
            // console.log("comments is ",comment[1][0])

        res.render('shop/index', {title: 'Shopping Cart', products: productChunks,successMsg:successMsg,noMessages:!successMsg,comment:comment});
    })
    });

});

router.post('/add-to-cart/:id', function(req, res, next) {
    var productId = req.params.id;
    var size=req.body.reader;
    console.log("select clothes ",size)
    //var color=req.body.color;
    
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    Detail.findById(productId,function(err, product) {
       if (err) {
           return res.redirect('/');
       }
        cart.add(product, product.id,size);
        req.session.cart = cart;
        console.log(req.session.cart);
        res.redirect('/');
    });
});

router.get('/reduce/:id', function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.reduceByOne(productId);
    req.session.cart = cart;
    res.redirect('/shopping-cart');
});

router.get('/remove/:id', function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.removeItem(productId);
    req.session.cart = cart;
    res.redirect('/shopping-cart');
});
router.get('/add/:id',function(req,res){
var productId=req.params.id;
var cart = new Cart(req.session.cart ? req.session.cart : {});
cart.addItem(productId);
req.session.cart = cart;
res.redirect('/shopping-cart');
});

router.get('/shopping-cart', function(req, res, next) {
   if (!req.session.cart) {
       return res.render('shop/shopping-cart', {products: null});
   } 
    var cart = new Cart(req.session.cart);
   
    res.render('shop/shopping-cart', {products: cart.generateArray(), totalPrice: cart.totalPrice});
});



router.get('/checkout', isLoggedIn, function(req, res, next) {
    if (!req.session.cart) {
        return res.redirect('/shopping-cart');
    }
    var cart = new Cart(req.session.cart);
    var errMsg = req.flash('error')[0];
    res.render('shop/checkout', {total: cart.totalPrice, errMsg: errMsg, noError: !errMsg});
});

router.post('/checkout', isLoggedIn, function(req, res, next) {
    if (!req.session.cart) {
        return res.redirect('/shopping-cart');
    }
    var cart = new Cart(req.session.cart);
    
    var stripe = require("stripe")(
        "sk_test_zxR7ucUUaglmMXSdUCpCpROK00YVme70eN"
    );

    stripe.charges.create({
        amount: cart.totalPrice * 100,
        currency: "usd",
        source: req.body.stripeToken, // obtained with Stripe.js
        description: "Test Charge"
    }, function(err, charge) {
        if (err) {
            req.flash('error', err.message);
            return res.redirect('/checkout');
        }
        var order = new Order({
            
            user: req.user,
            cart: cart,
            address: req.body.address,
            name: req.body.name,
            paymentId: charge.id,

        });
        order.save(function(err, result) {
            req.flash('success', 'Successfully bought product!');
           // var messages = req.flash('error');
            req.session.cart= null;
            res.redirect('/');
        });
    }); 
});



router.post('/comment',function(req,res){
   // var comment=req.body.comment;
        const comment=new Comment({
        comment:req.body.comment
    }) 

    comment.save(function(err,data){
        console.log("comment is save",data)
    })
})


router.get('/comment',function(req,res){
    console.log("hero")
    // Comment.find(function(err,docs){
    //     console.log("comments sasdas is",docs)
    res.render('shop/comment');
    
     // })

     
})




  
module.exports = router;
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.session.oldUrl = req.url;
    console.log("old session url is",req.session.oldUrl)
    res.redirect('/user/signin');
}

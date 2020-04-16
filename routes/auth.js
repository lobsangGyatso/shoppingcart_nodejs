var express=require('express');
var Product=require('../models/product');
var Image=require('../models/image');
var Detail=require('../models/details');
var Order=require('../models/oredered');
var User =require('../models/user')
var router=express.Router();
var multer=require('multer');
var pathh=require('path');


//const upload=multer({dest:'uploads'});

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
     
     // cb(null,Date.now() + '.jpg');
    cb(null,Date.now() + '.jpg');
    pathh.extname(file.originalname);
    //cb(null,new Date().toISOString() + file.originalname);
    }
  });
  
  
  const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };
  
//   const upload = multer({
//     storage: storage,
//     limits: {
//       fileSize: 1024 * 1024 * 5
//     },
//     fileFilter: fileFilter
//   });
var upload=multer({storage:storage});

var uploaded=multer({storage:storage});
router.get('/multiInsert',function(req,res){
    res.render('admin/insertImage');
})  
router.post('/productInsert',upload.any('files'),function(req,res){

    console.log(req.files)
    console.log(req.files[2].path);
    //res.send(req.files);
    var detail=new Detail({
        title:req.body.title,
        price:req.body.price,
        description:req.body.description,
        productImage:req.files[0].path,
        productImage2:req.files[1].path,
        productImage3:req.files[2].path

    })


    detail.save(function(err,data){
        if(err){
            console.log(err)
        }
        else{
            console.log("success",data)
        }
    })
})
router.get('/productInsert',function(req,res){
    res.render('admin/adminAdd');
  })




// router.post('/productInsert',upload.single('productImage'),function(req,res){
//     console.log(req.file)
   
//     const product = new Product({
//         title:req.body.title,
//         price:req.body.price,
//         description:req.body.description,
//         productImage:req.file.path
//     });  
    
//                      product.save(function(err,data){

//                         if(err){
//                             console.log(err)
//                             res.send(err);
//                         }
//                         else{
//                             console.log('product save successfully',data);
//                             res.redirect('/')
//                         }
                       
//                     })
  
//     //   Product.findOne({title:title},function(err,data){
//     //       if(err){
//     //           res.send('errr')
//     //       }
//     //       else{
//     //           if(data){
//     //               res.send('image already exist');
//     //           }
//     //           else{
//     //             product.save(function(err){
//     //                 if(err){
//     //                     res.send(err);
//     //                 }
//     //                 else{
//     //                     console.log('product save successfully');
//     //                 }
                   
//     //             })
          
//     //           }
//     //       }
//     //  })

     
//   })

//single upload
// router.post('/productInsert',upload.array('productImage',3),function(req,res){
//     console.log(req.files)
//     const product = new Product({
//         title:req.body.title,
//         price:req.body.price,
//         description:req.body.description,
//         productImage:req.uploads.path
//     });  
    
//                      product.save(function(err,data){

//                         if(err){
//                             console.log(err)
//                             res.send(err);
//                         }
//                         else{
//                             console.log('product save successfully',);
//                             res.redirect('/')
//                         }
                       
//                     })
  
//     //   Product.findOne({title:title},function(err,data){
//     //       if(err){
//     //           res.send('errr')
//     //       }
//     //       else{
//     //           if(data){
//     //               res.send('image already exist');
//     //           }
//     //           else{
//     //             product.save(function(err){
//     //                 if(err){
//     //                     res.send(err);
//     //                 }
//     //                 else{
//     //                     console.log('product save successfully');
//     //                 }
                   
//     //             })
          
//     //           }
//     //       }
//     //  })

     
//   })



router.get('/adminIndex',function(req,res){

    //   Product.find(function(err,response){
    //       if(err){
    //           console.log(err);
    //       }
    //       else{
    //         res.render('admin/adminIndex',{response:response})
    //       }
           

    //   })  
      Detail.find(function (err, docs) {
        console.log(docs)
          var productChunks = [];
          var chunkSize = 3;
          for (var i = 0; i < docs.length; i += chunkSize) {
              productChunks.push(docs.slice(i, i + chunkSize));
          }
          res.render('admin/adminIndex', { products: productChunks});
      });
      

})

router.get('/productDelete/:id',function(req,res){
    var id=req.params.id;
    console.log(id)
    Detail.findByIdAndRemove(id,function(err){
        if(err){
            console.log(err);
        }
        else{
            res.redirect('/admin/adminIndex')
        }
    })

})


//get single Article
router.get('/product/:id',function(req,res){
    console.log("display",req.params.id)
    Detail.findById(req.params.id,function(err,response){
        res.render('admin/product',{response:response});
    })
})



router.get('/edit/:id',function(req,res){

    Detail.findById(req.params.id,function(err,response){
        res.render('admin/adminEdit',{response:response});
    })

})

router.post('/edit/:id',upload.any('files'),function(req,res){
    console.log("update id",req.params.id)

    let product={};
    product.title=req.body.title;
    product.price=req.body.price;
    product.description=req.body.description;
    product.productImage=req.files[0].path,
    product.productImage2=req.files[1].path,
    product.productImage3=req.files[2].path


    let query={_id:req.params.id};

    Detail.update(query,product,function(err){
        if(err){
            console.log(err)
        }
        else{
            res.redirect('/admin/adminIndex');
        }
    })

})

router.get('/imageInsert',function(req,res){

    // Image.find(function(err,image){
    //     if(err){
    //         console.log(err)
    //     }

    //     else{
    //         res.render('admin/Image',{image:image})
    //     }
    // })
res.render('admin/insertImage')
   
})

router.post('/imageInsert',uploaded.single('productImage'),function(req,res){
    const image= new Image({
            title:req.body.title,
            productImage:req.file.path
        })

        image.save(function(err){
            if(err){
                console.log(err)
            }
            else{
                console.log("image insert")
            }
        })
})
//check for order


router.get('/checkOrder',function(req,res){
    Order.find(function(err,response){
        if(err){
            console.log(err)
        }
        else{
            var productChunks = [];
            var chunkSize = 3;
                for (var i = 0; i < response.length; i += chunkSize) {
                productChunks.push(response.slice(i, i + chunkSize));
                }
            res.render('admin/checkOrder', { response: productChunks});
            //res.render('admin/checkOrder',{response:response});
        }
    })
})


//get user
router.get('/getUser',function(req,res){
    User.find(function(err,data){
        if(err){
            throw err;
        }
        else{
            res.render('admin/getUser',{data:data})
        }
    })
})
router.get('/getUser/:id',function(req,res){
    User.findByIdAndRemove({'id':req.params.id},function(err){
        if(err){
            throw err;
        }
        else{
            redirect('/admin/getUser')
        }
    })
})
module.exports = router;

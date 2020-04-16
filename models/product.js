var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    productImage: {type: String, required: true,path:true},
    title: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true},
    //color:{type:String,required:true},
    //size:{type:String,required:true},
});

module.exports = mongoose.model('Product', schema);
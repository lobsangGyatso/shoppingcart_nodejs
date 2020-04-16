var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    productImage: {type: String, required: true},
    title: {type: String, required: true},
});

module.exports = mongoose.model('Image', schema);
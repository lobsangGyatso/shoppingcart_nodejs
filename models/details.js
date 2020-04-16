var mongoose = require('mongoose');
var Schema = mongoose.Schema;

detailSchema = new Schema( {
	productImage: {type: String, required: true},
	productImage2: {type: String, required: true},
	productImage3: {type: String, required: true},
    title: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true}
	
}),
Detail = mongoose.model('Detail', detailSchema);

module.exports = Detail;
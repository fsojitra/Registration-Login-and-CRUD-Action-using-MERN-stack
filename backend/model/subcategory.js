var mongoose = require('mongoose');
var Schema = mongoose.Schema;

subcategorySchema = new Schema( {
	name: String,
	date : { type : Date, default: Date.now }
}),
subcategory = mongoose.model('subcategory', subcategorySchema);

module.exports = subcategory;
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

categorySchema = new Schema( {
	name: String,
	date : { type : Date, default: Date.now }
}),
category = mongoose.model('category', categorySchema);

module.exports = category;
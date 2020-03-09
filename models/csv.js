var mongoose  = require('mongoose');

var csvSchema = new mongoose.Schema({
    firstName:String,
    lastName:String,
    phoneNumber:String
});

module.exports = mongoose.model('csv',csvSchema);
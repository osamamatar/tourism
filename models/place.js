//replace modelSchema,ModelName with whatever you want
var mongoose = require('mongoose');

var placeSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    descreption: {
        type: String,
    },
    image: {
        type: String,
    },
    builder: {
        type: String,
    },
    location: {
        type: String,
    },
});

var place = mongoose.model('modal', placeSchema);
module.exports = place;
var mongoose = require("mongoose");

var contactSchema = mongoose.Schema({
    name: String,
    number: String,
});

module.exports = mongoose.model("Contact", contactSchema);
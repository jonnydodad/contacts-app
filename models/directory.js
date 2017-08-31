var mongoose = require("mongoose");

var directorySchema = new mongoose.Schema({
    
    submitter:{
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username:String
    },
    contacts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Contact"
        }
    ]
});

module.exports = mongoose.model("Directory", directorySchema);

const mongoose = require('mongoose');

const NotesSchema = new Schema({

        title : {
            type:String,
            require:true
        },
        description : {
            type:String,
            require:true,
            unique:true
        },
        tag : {
            type:String,
            default:"Gerneral"
        },
        date : {
            type:Date,
            default:Date.now
        }
});

mondule.exports = mongoose.model('notes', NotesSchema);
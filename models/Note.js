const mongoose = require('mongoose');
const { Schema }= mongoose ;

const NotesSchema = new Schema({

        user : {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        },

        title : {
            type:String,
            require:true
        },
        description : {
            type:String,
            require:true
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
const  notes =  mongoose.model('notes', NotesSchema);

module.exports = notes
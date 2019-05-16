var mongoose=require('mongoose');

var schema=mongoose.Schema({
    files:[],
    fname:{
        type: String,
        required: true
    },
    lname:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    pwd:{
        type: String,
        required: true
    },
    online:{
        type: Boolean,
        required: true  
    }
})

var fileModel=mongoose.model('fileModel',schema);
module.exports={
    fileModel
}
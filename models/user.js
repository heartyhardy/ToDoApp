var mongoose =  require('mongoose');

var User = mongoose.model('User',{
    name:{
        type:String,
        required:true,
        minlength:2,
        maxlength:100,
        trim:true
    },
    email:{
        type:String,
        required:true,
        minlength:3,
        maxlength:50,
        trim:true
    }
});

module.exports={User}
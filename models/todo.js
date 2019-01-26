var mongoose =  require('mongoose');

var ToDo = mongoose.model('ToDo', {
    task:{
        type:String,
        required:true,
        minlength:3,
        maxlength:100,
        trim:true
    },
    completed:{
        type:Boolean,
        default:false
    },
    completedAt:{
        type:Number,
        default:null
    },
    _creator:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    }
});

module.exports={ToDo}
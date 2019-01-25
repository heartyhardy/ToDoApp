const mongoose =  require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _=require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
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
        trim:true,
        unique:true,
        validate: validator.isEmail,
        message:'{VALUE} is not a valid email'
    },
    password:{
        type:String,
        required:true,
        minlength:6
    },
    tokens:[{
        access:{
            type:String,
            required:true
        },
        token:{
            type:String,
            required:true
        }
    }]
});

UserSchema.methods.toJSON = function()
{
    var user = this;
    var userObj=user.toObject();

    return _.pick(userObj,['_id','name', 'email']);
};

UserSchema.methods.generateAuthToken = function()
{
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id:user._id.toHexString(),access}, 'hash_salted').toString();

    // For better compatibility with mongoose versions
    user.tokens = user.tokens.concat([{access,token}]);

    return user.save().then(()=>{
        return token;
    });
};

UserSchema.statics.findByToken = function(token)
{
    var User = this;
    var decoded;

    try
    {
        decoded = jwt.verify(token, 'hash_salted');
    }
    catch(e)
    {
        return Promise.reject(e);
    }

    return User.findOne({
        _id:decoded._id,
        'tokens.token': token,
        'tokens.access':'auth'
    });
};

UserSchema.pre('save', function(next) {
    var user= this;

    if(user.isModified('password'))
    {
        bcrypt.genSalt(10, (err, salt)=>{
            if(err)
                return Promise.reject();
            bcrypt.hash(user.password,salt, (err, hash)=>{
                if(err)
                    return Promise.reject();
                user.password=hash;
                next();
            })
        });
    }
    else
    {
        next();
    }
});


var User = mongoose.model('User',UserSchema);

module.exports={User}
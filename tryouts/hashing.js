const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var pass = '123321aa';

// bcrypt.genSalt(15, (err,salt)=>{
//     if(err)
//         return console.log("Error occcured in GenSalt");

//     bcrypt.hash(pass,salt, (err, hash)=>{
//         if(err)
//             return console.log("Error occured in Hash");
//         console.log(hash);
//     })
// });

 var hashedpass = "$2a$15$SnlbbCBuN7SCT2PYADp3xuo9njKKIvgYJnrM2RQrsPijjTvrtRu7O";

bcrypt.compare(pass, hashedpass, (err, hash)=>{
    if(err)
        return console.log("Error occured in compare");
    console.log(hash);
});

// ORIGINAL WAY

// var message = "Boogie woogie";
// var hash = SHA256(message).toString();

// console.log(message);
// console.log(hash);

// var salt = "addedsalt";

// var data = {
//     id:4
// }

// var token = {
//     data,
//     hash:SHA256(JSON.stringify(data)+salt).toString()
// }

// var resultHash =  SHA256(JSON.stringify(token.data)+salt).toString();

// console.log('Hash valid? = ', resultHash === token.hash);

// USING JASON WEB TOKEN

var data = {
    id:10
}

var token = jwt.sign(data,"salted");
console.log(token);

var decoded =  jwt.verify(token, "salted");
console.log('Decoded? ',decoded);


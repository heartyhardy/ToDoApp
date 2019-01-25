const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

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


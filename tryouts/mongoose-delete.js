const {ObjectID} = require('mongodb');

const {mongoose} = require('../db/mongoose');
const {ToDo} = require('../models/todo');
const {User} = require('../models/user');

//Deprecated Use DeleteMany
// ToDo.remove({}).then((result)=>{
//     console.log(result);
// },(err)=>{
//     console.log(err);
// });

// New way of deleting all
// ToDo.deleteMany({}).then((result)=>{
//     console.log(result);
// },(err)=>{
//     console.log(err);
// });

// Finds and deletes a one and returns the deleted record.
// findByIdAndRemove() also works the same
// ToDo.findOneAndDelete({
//     task:"go shopping"
// }).then((result)=>{
//     console.log(result);
// });

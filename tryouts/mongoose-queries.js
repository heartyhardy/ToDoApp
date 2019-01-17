const {ObjectID} = require('mongodb');

const {mongoose} = require('../db/mongoose');
const {ToDo} = require('../models/todo');

var id = '5c3daa7fa7af9c1e1471b128';

if(!ObjectID.isValid(id))
    return console.log("Invalid Object Id");

ToDo.find({
    _id:id
})
.then((todos)=>{
    console.log('ToDos',todos);
}, (err)=>{
    console.log(err);
});

ToDo.findOne({
    _id:id
}).then((todo)=>{
    console.log(todo);
}, (err)=>{
    console.log(err);
});

ToDo.findById(id).then((todo)=>{
    if(!todo)
        return console.log("Id doesn't exist in db.");
    console.log(todo);
},(err)=>{
    console.log(err);
});
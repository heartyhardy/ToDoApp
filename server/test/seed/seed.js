const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {ToDo} = require('./../../../models/todo');
const {User} = require('./../../../models/user');

const seedToDos=[
    {
        _id:new ObjectID(),
        task: "Learn Node"
    },
    {
        _id:new ObjectID(),
        task: "Go Hiking",
        completed:true,
        completedAt:23232
    },
    {
        _id:new ObjectID(),
        task: "Go Shopping"
    }
];

const firstUserId=new ObjectID();
const secUserId=new ObjectID();

const seedUsers = [
    {
        _id: firstUserId,
        name: 'charith neelanga',
        email: 'cnrathnayake@gmail.com',
        password: 'mypassword',
        tokens:[{
            access:'auth',
            token: jwt.sign({_id:firstUserId, auth:'auth'},'hash_salted').toString()
        }]
    },
    {
        _id:secUserId,
        name: 'adolf hitler',
        email: 'herrhitler@gmail.com',
        password: 'juden123'
    }
];

const populateTodos = ()=>{
    return ToDo.deleteMany({})
    .then(()=>{
        ToDo.insertMany(seedToDos);
    });  
};

const populateUsers =()=>{
    return User.deleteMany({})
    .then(()=>{
        var userone = new User(seedUsers[0]).save()
        .then(()=>{
            var usertwo = new User(seedUsers[1]).save();
        });
    });
};

module.exports = {seedToDos, seedUsers, populateTodos, populateUsers};
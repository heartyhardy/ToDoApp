const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {ToDo} = require('./../../../models/todo');
const {User} = require('./../../../models/user');

const firstUserId=new ObjectID();
const secUserId=new ObjectID();

const seedToDos=[
    {
        _id:new ObjectID(),
        _creator:firstUserId,
        task: "Learn Node"
    },
    {
        _id:new ObjectID(),
        _creator:secUserId,
        task: "Go Hiking",
        completed:true,
        completedAt:23232
    },
    {
        _id:new ObjectID(),
        _creator:firstUserId,
        task: "Go Shopping"
    }
];

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
        password: 'juden123',
        tokens:[{
            access:'auth',
            token: jwt.sign({_id:secUserId, auth:'auth'},'hash_salted').toString()
        }]
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
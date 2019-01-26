const _=require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('../db/mongoose');
var {connectdb} =require('../db/mongoose');
var {ToDo} = require('../models/todo');
var {User} = require('../models/user');
var {authenticate} = require('./middleware/authenticate');

var SERVER_PORT=process.env.PORT;

var app = express();
app.use(bodyParser.json());

connectdb();

//Post /todos
app.post('/todos', authenticate,(req, res)=>{
    //console.log("Request: ",req.body);
    
    var newtodo=new ToDo({
        _creator:req.user._id,
        task:req.body.task,
        completed:req.body.completed,
        completedAt:req.body.completedAt
    });

    newtodo.save().then((doc)=>{
        res.send(doc);
        console.log("Record saved successfully.");
    })
    .catch((err)=>{
        console.log("Error occured: " + err);
        res.status(400).send(err);
    });
});

// GET /todos

app.get('/todos',authenticate, (req, res)=>{

    ToDo.find({_creator:req.user._id}).then((todos)=>{
        res.send({todos});
    }, (err)=>{
        res.status(400).send(err);
    })
});

// GET by ID /todos

app.get('/todos/:id', authenticate, (req, res)=>{
    var id = req.params.id;

    if(!ObjectID.isValid(id))
        return res.status(400).send("Invalid ID format!");
    
    ToDo.findOne({_id:id, _creator:req.user._id}).then((todo)=>{
        if(!todo)
            return res.status(404).send("ID not found in the Database!");

        res.status(200).send(todo);
    }).catch((err)=>{
        res.status(500).send("Error occured.");
    });
});

// DELETE by ID /todos

app.delete('/todos/:id', authenticate, (req, res)=>{
    var id=req.params.id;

    if(!ObjectID.isValid(id))
        return res.status(400).send("Invalid ID format!");
    
    ToDo.deleteOne({_id:id, _creator:req.user._id}).then((deleted)=>{
        if(deleted.n==1)
            res.status(200).send({deleted});
        else if(deleted.n==0)
            res.status(404).send("Document could not be found!");
    })
    .catch((err)=>{
        res.status(500).send("Error occured");
    });
});

// PATCH by Id /todos

app.patch('/todos/:id', authenticate, (req, res)=>{
    var id=req.params.id;
    var body = _.pick(req.body, ['task', 'completed']);

    if(!ObjectID.isValid(id))
        return res.status(400).send("Invalid ID format!");
    
    if(_.isBoolean(body.completed) && body.completed)
    {
        body.completedAt=new Date().getTime();
    }
    else
    {
        body.completed=false;
        body.completedAt=null;
    }

    ToDo.findOneAndUpdate({_id:id, _creator:req.user._id}, {$set:body}, {new:true}).then((todo)=>{

        if(!todo)
            return res.status(404).send("Document does not exist in db!");
        
        res.status(200).send({todo});

    }).catch(e=>res.status(400).send(e));
});

// POST /users

app.post('/users', (req, res)=>{
    var body = _.pick(req.body, ['name', 'email', 'password']);

    var newUser = new User(body);

    newUser.save().then(()=>{
        //res.status(200).send(doc);
        return newUser.generateAuthToken();
    })
    .then((token)=>{
        res.status(200).header('x-auth',token).send(newUser);
    })
    .catch(e=>res.status(400).send(e));
});

// GET /users/me

app.get('/users/me', authenticate, (req, res)=>{
    res.send(req.user);
});

// POST /users/login

app.post('/users/login', (req, res)=>{
    var body = _.pick(req.body, ['email', 'password']);
    User.findByEmailPass(body.email, body.password).then((user)=>{
        return user.generateAuthToken().then((token)=>{
            res.status(200).header('x-auth',token).send(user);
        });
    }).catch(e=>res.status(400).send());
});

// DELETE /users/me/token

app.delete('/users/me/token', authenticate, (req,res)=>{
    req.user.removeToken(req.token).then((result)=>{
        res.status(200).send();
    })
    .catch(e=>res.status(401).send());
});

// Host the express server on SERVER_PORT

app.listen(SERVER_PORT,()=>{
    console.log(`Server started on port: ${SERVER_PORT} `);
});

module.exports={app}
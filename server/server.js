const express = require('express');
const bodyParser = require('body-parser');

var {mongoose} = require('../db/mongoose');
var {connectdb} =require('../db/mongoose');
var {ToDo} = require('../models/todo');
var {User} = require('../models/user');

var SERVER_PORT=process.env.PORT || 3000;

var app = express();
app.use(bodyParser.json());

//Post /todos
app.post('/todos', (req, res)=>{
    //console.log("Request: ",req.body);
    connectdb();
    var newtodo=ToDo({
        task:req.body.task,
        completed:req.body.completed,
        completedAt:req.body.completedAt
    });

    newtodo.save().then((doc)=>{
        res.send(doc);
        console.log("Record saved successfully.");
        return mongoose.disconnect();
    })
    .then((closing)=>{
        console.log("Connection successfully closed.");
    })
    .catch((err)=>{
        console.log("Error occured: " + err);
        res.status(400).send(err);
    })
});

// GET /todos

app.get('/todos', (req, res)=>{
    
    connectdb();
    ToDo.find().then((todos)=>{
        res.send({todos});
    }, (err)=>{
        res.status(400).send(err);
    })
})

app.listen(SERVER_PORT,()=>{
    console.log(`Server started on port: ${SERVER_PORT} `);
});

module.exports={app}
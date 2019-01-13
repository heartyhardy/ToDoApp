 var {mongoose} = require('../db/mongoose');

var newTask = new ToDo({
    task:'  Sleep tight  ',
    completed:false
});

var newUser=new User({
    name: ' Charith ',
    email:'charithr007@gmail.com'
});


// Save ToDo
newTask.save().then((doc)=>{
    console.log(JSON.stringify(doc,undefined,2));

    return mongoose.disconnect();

})
.then((closemsg)=>{
    console.log("Disconnected from mongoose");
})
.catch((err)=>{
    console.log("Error occured: "+err);
});

//Save User
newUser.save().then((doc)=>{
    console.log(JSON.stringify(doc,undefined,2));
    return mongoose.disconnect();
})
.then((closemsg)=>{
    console.log("Disconnected from mongoose");
})
.catch((err)=>{
    console.log("Error occured: "+err);
});
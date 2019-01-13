const mongoose = require('mongoose');
const connectionstring="mongodb://localhost:27017/ToDoApp";
const options = {useNewUrlParser:true}

mongoose.Promise=global.Promise;
mongoose.connect(connectionstring,options);

var connectdb = () =>{
    mongoose.connect(connectionstring,options);
}

module.exports={mongoose,connectdb}
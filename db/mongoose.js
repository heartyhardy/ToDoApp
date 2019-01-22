const mongoose = require('mongoose');

var env =  process.env.NODE_ENV || "development";

const username="defaultuser";
const password="def123321";
const cloudconnectionstring= `mongodb://${username}:${password}@ds161104.mlab.com:61104/todoapp`;
const localconnectionstring="mongodb://localhost:27017/ToDoApp";
const localtestconnectionstring = "mongodb://localhost:27017/ToDoAppTest";


switch(env)
{
    case "development":
        connectionstring=localconnectionstring;
        process.env.PORT=3000;
        break;
    case "testing":
        connectionstring=localtestconnectionstring;
        process.env.PORT=3000;
        break;
    case "production":
        connectionstring=cloudconnectionstring;
        break;
}

const options = {useNewUrlParser:true}
mongoose.Promise=global.Promise;
mongoose.set('useFindAndModify', false);

mongoose.connect(connectionstring,options);

var connectdb = () =>{
    mongoose.connect(connectionstring,options);
}

module.exports={mongoose,connectdb}
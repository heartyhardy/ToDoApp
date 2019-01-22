const mongoose = require('mongoose');

const env="prod";
const username="defaultuser";
const password="def123321";
const cloudconnectionstring= `mongodb://${username}:${password}@ds161104.mlab.com:61104/todoapp`;
const localconnectionstring="mongodb://localhost:27017/ToDoApp";
const connectionstring = (env!="dev")? cloudconnectionstring : localconnectionstring;
const options = {useNewUrlParser:true}

mongoose.Promise=global.Promise;
mongoose.set('useFindAndModify', false);
mongoose.connect(connectionstring,options);

var connectdb = () =>{
    mongoose.connect(connectionstring,options);
}

module.exports={mongoose,connectdb}
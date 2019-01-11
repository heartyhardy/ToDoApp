const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect("mongodb://localhost:27017/ToDoApp",{useNewUrlParser:true}, (err, client)=>{
    if(err)
        return console.log("Oops! Unable to connect to MongoDB");
    console.log("Successfully connected to MongoDB");

    const db=client.db('ToDoApp');

    var findupdateonefilter = {_id:new ObjectID("5c3880f49958ed2b6952d26d")}
    var updateobject={$set:{text:"Go Hiking", status:"incomplete"}}    
    var updateOptions= {returnOriginal:false}

    var findupdateonefilter = {_id:new ObjectID("5c386394ae5dc72a40886d1d")}
    var updateObject2= {$set:{name: "Chazing Dreams"},$inc:{age:-19}}


    //FindAndUpdateOneTodo(db,findupdateonefilter,updateobject,updateOptions);

    FindAndUpdateOneUser(db, findupdateonefilter, updateObject2, updateOptions);

    client.close();
})

function FindAndUpdateOneUser(db, filter, update, options) {
    db.collection('Users').findOneAndUpdate(filter, update, options).then((result) => {
        console.log(JSON.stringify(result));
    }, (err) => {
        console.log("Oops! Unable to update the record");
    });
}

function FindAndUpdateOneTodo(db,filter,update,options) {
    db.collection('ToDos').findOneAndUpdate(filter,update,options).then((result) => {
        console.log(JSON.stringify(result));
    }, (err) => {
        console.log("Oops! Unable to update the record");
    });
}

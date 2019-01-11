const {MongoClient} = require('mongodb');

MongoClient.connect("mongodb://localhost:27017/ToDoApp", {useNewUrlParser:true}, (err, client) => {
    if(err)
        return console.log("Oops! Unable to connect to MongoDB");
    
    console.log("Successfully connected to MongoDB");

    const db=client.db('ToDoApp');

    var delmanyfilter = {text:"Dummy"}
    var delonefilter = {text:"Dummy I"}

    //DeleteMany(db,delmanyfilter);

    //DeleteOne(db,delonefilter);

    FindAndDelOne(db, delonefilter);

    client.close();
})

function DeleteOne(db,filter) {
    db.collection('ToDos').deleteOne(filter).then((result) => {
        console.log(JSON.stringify(result, undefined, 2));
    }, (err) => {
        console.log("Oops! Unable to delete record.");
    });
}

function DeleteMany(db,filter) {
    db.collection('ToDos').deleteMany(filter).then((result) => {
        console.log(JSON.stringify(result, undefined, 2));
    }, (err) => {
        console.log("Oops! Unable to delete records.");
    });
}

function FindAndDelOne(db,filter) {
    db.collection('ToDos').findOneAndDelete(filter).then((result) => {
        console.log(JSON.stringify(result, undefined, 2));
    }, (err) => {
        console.log("Oops! Unable to delete records.");
    });
}
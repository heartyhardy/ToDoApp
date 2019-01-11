const {MongoClient, ObjectID}=require('mongodb');

// var obj=ObjectID();
// console.log(obj);

MongoClient.connect('mongodb://localhost:27017/ToDoApp', { useNewUrlParser: true }, (err, client)=>{
    if(err)
    {
        return console.log('OOps! Unable to connect to MongoDB server.');
    }
    console.log("\x1b[33m","Connected to MongoDB Server");
    const db=client.db('ToDoApp');

    //insertTodos(db);

    insertUsers(db);

    client.close();
});

function insertUsers(db) {
    db.collection('Users').insertOne({
        "name": "Charith Rathnayake",
        "age": 37,
        "location": "Sri Lanka"
    }, (err, result) => {
        if (err)
            return console.log("\x1b[31m", "Oops! could not add the collection to the db");
        console.log("\x1b[32m", JSON.stringify(result.ops, undefined, 2));
    });
}

function insertTodos(db) {
    db.collection('ToDos').insertOne({
        "text": "Learning Node",
        "status": "incomplete"
    }, (err, result) => {
        if (err)
            return console.log("\x1b[31m", "Oops! could not add the collection to the db");
        console.log("\x1b[32m", JSON.stringify(result.ops, undefined, 2));
    });
}

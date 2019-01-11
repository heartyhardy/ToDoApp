const { MongoClient, ObjectID } =require('mongodb');

MongoClient.connect("mongodb://localhost:27017/ToDoApp", {useNewUrlParser:true}, (err, client) => {
    if(err)
        return console.log("Oops! Unable to connect to the server.");
    
    console.log("Successfully connected to MongoDB");

    const db=client.db('ToDoApp');
    var filterbystatus={status:"incomplete"};
    var filterbyid={_id: new ObjectID('5c38531313981c22ecd51ae4')}
    var filterbyname= {name:"Charith Rathnayake"}
    var filterbynameage = {name: "Charith Rathnayake", age:37}
    //CountAll(db, 'ToDos');
    //FindToDos(db,filterbyid);

    CountAll(db, 'Users');
    FindUsers(db, filterbynameage);

    client.close();

})

function FindUsers(db, filterbyname) {
    db.collection('Users').find(filterbyname).toArray().then((docs) => {
        console.log(`----------------- Users: Results (${docs.length}) ---------------\n`);
        console.log(JSON.stringify(docs, undefined, 2));
        console.log("----------------- END ---------------\n");
    }, (err) => {
        console.log("Oops! Unable to fetch the records.");
    });
}

function CountAll(db, collection) {
    db.collection(collection).find().count().then((result) => {
        console.log("ToDos: Queried ", JSON.stringify(result, undefined, 2) + " Documents.\n");
    }, (err) => {
        console.log("Oops! Unable to fetch the records.");
    });
}

function FindToDos(db,filter) {
    db.collection('ToDos').find(filter).toArray().then((docs) => {
        console.log("-----------------ToDos: Results ---------------\n");
        console.log(JSON.stringify(docs, undefined, 2));
        console.log("----------------- END ---------------\n");
    }, (err) => {
        console.log("Oops! Unable to fetch the records.");
    });
}

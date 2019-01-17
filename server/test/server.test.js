const expect =  require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {ToDo} = require('../../models/todo');

var seedToDos=[
    {
        _id:new ObjectID(),
        task: "Learn Node"
    },
    {
        _id:new ObjectID(),
        task: "Go Hiking"
    },
    {
        _id:new ObjectID(),
        task: "Go Shopping"
    }
]

beforeEach((done)=>{
    ToDo.deleteMany({})
    .then(()=>{
        return ToDo.insertMany(seedToDos);
    }).then(()=>done());
});

describe('Server - Post(ToDos)', ()=>{
    it('Should create new ToDo', (done)=>{
        var task="Go Climbing";

        request(app)
        .post('/todos')
        .send({task})
        .expect(200)
        .expect((res)=>{
            expect(res.body.task).toBe(task);
        })
        .expect((res) =>{
            
            ToDo.find({task}).then((todos)=>{
                expect(todos.length).toBe(1);
                expect(todos[0].task).toBe(task);
                done();
            })
        }).catch((e)=>done(e));
    });

    it('Should not create todo with invalid data', (done)=>{
        var task = "";

        request(app)
        .post('/todos')
        .send({task})
        .expect(400)
        .expect((res)=>{

            ToDo.find().then((todos)=>{
                expect(todos.length).toBe(3);
                done();
            },(err)=>done(err));
           
        })
        .catch(e=>done(e));    
    });
});

describe('Server - GET(ToDos)', ()=>{
    it('Should fetch all the documents in ToDos', (done)=>{
        request(app)
        .get('/todos')
        .expect(200)
        .expect((res)=>{
            expect(res.body.todos.length).toBe(3);
            expect(res.body.todos[0].task).toBe("Learn Node");
        })
        .end(done);
    })
});

describe('Server - Get(ToDos) By ID', ()=>{
    it('Should fetch a valid document by ID',(done)=>{
        request(app)
        .get(`/todos/${seedToDos[0]._id.toHexString()}`)
        .expect(200)
        .expect((res)=>{
            expect(res.body.task).toBe(seedToDos[0].task);
        })
        .end(done);
    });


    it('Should return a 400 if ID is in invalid format', (done)=>{
        request(app)
        .get('/todos/5c409171d21871157c839a1d22')
        .expect(400)
        .expect((res)=>{
            expect(res.body).toMatchObject({});
        })
        .end(done);
    });


    it('Should return a 404  if ID does not exist in the DB', (done)=>{

        var fakeId=new ObjectID().toHexString();

        request(app)
        .get(`/todos/${fakeId}`)
        .expect(404)
        .expect((res)=>{
            expect(res.body).toMatchObject({});
        })
        .end(done);
    });
});
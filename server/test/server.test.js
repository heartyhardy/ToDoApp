const expect =  require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {ToDo} = require('../../models/todo');

var seedToDos=[
    {
        task: "Learn Node"
    },
    {
        task: "Go Hiking"
    },
    {
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
})
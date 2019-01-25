const expect =  require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {ToDo} = require('../../models/todo');
const {User} =require('./../../models/user');
const {seedToDos, seedUsers, populateTodos, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

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

describe('Server - DELETE(ToDos) By ID',()=>{
    it('Should return a valid deletion by Id', (done)=>{
        var id=seedToDos[0]._id.toHexString();

        request(app)
        .delete(`/todos/${id}`)
        .expect(200)
        .expect((res)=>{
            expect(res.body.deleted).toBeTruthy();
            expect(res.body.deleted).toHaveProperty('_id',seedToDos[0]._id.toHexString());
            expect(res.body.deleted).toHaveProperty('task', seedToDos[0].task.toString());
        })
        .end((err,res)=>{
            if(err)
                return done(err);

            ToDo.findById(res.body.deleted._id).then((todo)=>{
                expect(todo).not.toBeTruthy();
                done();
            }).catch(e=>done(e));
        });
    });

    it('Should  throw 400 if Id is in invalid format', (done)=>{
        var invalidId="5c46b672307aa01d14ed9a9511";
        
        request(app)
        .delete(`/todos/${invalidId}`)
        .expect(400)
        .expect((res)=>{
            expect(res.body).toMatchObject({});
        })
        .end(done);
    });

    it('Should throw 404 if Id is not found in db', (done)=>{
        var fakeId=new ObjectID().toHexString();

        request(app)
        .delete(`/todos/${fakeId}`)
        .expect(404)
        .expect((res)=>{
            expect(res.body).toMatchObject({});
        })
        .end((done));
    });
});

describe('Server - PATCH (ToDos) By ID',()=>{
    it('Should update the specified document',(done)=>{
        var id=seedToDos[0]._id.toHexString();
        var updatedTask = "Hit the Gym";
        var body = {task:updatedTask, completed:true};

        request(app)
        .patch(`/todos/${id}`)
        .send(body)
        .expect(200)
        .expect((res)=>{
            expect(res.body.todo).toBeTruthy();
            expect(res.body.todo.task).toBe(updatedTask);
            expect(res.body.todo.completed).toBe(true);
            expect(typeof res.body.todo.completedAt).toBe('number');
        })
        .end(done);
    });

    it('Should change completedAt to null when completed is false', (done)=>{
        var id = seedToDos[1]._id.toHexString();
        var updatedTask = "Hit the Gym";
        var body = {task:updatedTask, completed:false};

        request(app)
        .patch(`/todos/${id}`)
        .send(body)
        .expect(200)
        .expect((res)=>{
            expect(res.body.todo).toBeTruthy();
            expect(res.body.todo.task).toBe(updatedTask);
            expect(res.body.todo.completed).toBe(false);
            expect(res.body.todo.completedAt).not.toBeTruthy();
        })
        .end(done);
    });

    it('Should throw 400 if in invalid format', (done)=>{
        var invalidId="5c46b672307aa01d14ed9a9511";
        var updatedTask = "Hit the Gym";
        var body = {task:updatedTask, completed:false};

        request(app)
        .patch(`/todos/${invalidId}`)
        .send(body)
        .expect(400)
        .expect((res)=>{
            expect(res.body.todo).toBeUndefined();
            expect(res.body).toMatchObject({});
        })
        .end(done);
    });

    it('Should throw 404 if id is not found in db', (done)=>{
        var fakeId=new ObjectID().toHexString();
        var updatedTask = "Hit the Gym";
        var body = {task:updatedTask, completed:false};

        request(app)
        .patch(`/todos/${fakeId}`)
        .send(body)
        .expect(404)
        .expect((res)=>{
            expect(res.body.todo).toBeUndefined();
            expect(res.body).toMatchObject({});
        })
        .end(done);
    });
});

describe('Server - GET /users/me', ()=>{

    it('Should return the authenticated user',()=>{
        return request(app)
        .get('/users/me')
        .set('x-auth',seedUsers[0].tokens[0].token)
        .expect(200)
        .expect((res)=>{
            expect(res.body._id).toBe(seedUsers[0]._id.toHexString());
            expect(res.body.name).toBe(seedUsers[0].name);
            expect(res.body.email).toBe(seedUsers[0].email);
        });
    });

    it('Should return a 401 Unauthorized error',()=>{
        return request(app)
        .get('/users/me')
        .set('x-auth', null)
        .expect(401)
        .expect((res)=>{
            expect(res.body).toMatchObject({});
        });
    });
});

describe('Server - POST /users',()=>{

    it('Should create a new user with a token', ()=>{

        var name ="Chubu kuboni";
        var email = "chubutobilay@gmail.com";
        var password ="tobi123321";

        return request(app)
        .post('/users')
        .send({name, email, password})
        .expect(200)
        .expect((res)=>{
            expect(res.headers['x-auth']).toBeTruthy();
            expect(res.body._id).toBeTruthy();
            expect(res.body.name).toBe(name);
            expect(res.body.email).toBe(email);
        })
        .expect((res)=>{
            User.findOne({email}).then((user)=>{
                expect(user).toBeTruthy();
                expect(user.password).not.toBe(password);
                expect(user.name).toBe(name);
                expect(user.email).toBe(email);
            });
        });
    });

    it('Should throw an error if email/password validation violated', ()=>{
        var name ="B";
        var email = 'invalidmail';
        var password ="bin";

        return request(app)
        .post('/users')
        .send({name, email, password})
        .expect(400)
        .expect((res)=>{
            expect(res.body).toMatchObject({});
        })
        .expect((res)=>{
            User.find({email}).then((users)=>{
                expect(users.length).toBe(0);
            });
        });
    });

    it('Should throw an error if email is not unique',()=>{

        var name ="Bin Ladeen";
        var email = seedUsers[0].email;
        var password ="bin123321";

        return request(app)
        .post('/users')
        .send({name, email, password})
        .expect(400)
        .expect((res)=>{
            expect(res.body).toMatchObject({});
        })
        .expect((res)=>{
            User.find({email}).then((users)=>{
                expect(users.length).toBe(1);
            });
        });
    });

});
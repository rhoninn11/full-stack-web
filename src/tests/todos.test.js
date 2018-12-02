const { App } = require('../app.js');
const request = require('supertest');
const { ObjectId } = require('mongodb');

const { ToDo } = require('../models/todo.js');

const todos = [{
    _id: new ObjectId(),
    text: 'First to do text'
}, {
    _id: new ObjectId(),
    text: 'Second to do text'
}]

beforeEach((done) => {
    ToDo.deleteMany({}).then(() => {
        return ToDo.insertMany(todos);
    }).then(() => done());
});

describe('To Do functionality', () => {
    describe('POST /todos', () => {
        it('should create new to do', (done) => {
            let text = 'jakieś nowe zadanie';

            request(App)
                .post('/todos')
                .send({ text })
                .expect(200)
                .expect((result) => {
                    expect(result.body.todo.text).toBe(text);
                })
                .end((error, response) => {
                    if (error) {
                        return done(error);
                    }

                    ToDo.find().then((todos) => {
                        expect(todos.length).toBe(3);
                        expect(todos[2].text).toBe(text);
                        done();
                    }).catch(e => done(e))
                })
        });

        it('should not create to do with invalide data', (done) => {
            let tst = 'zadanko'

            request(App)
                .post('/todos')
                .send({ tst })
                .expect(400)
                .end((error, response) => {
                    if (error) {
                        return done(error);
                    }

                    ToDo.find().then((todos) => {
                        expect(todos.length).toBe(2);
                        done();
                    }).catch(e => done(e))
                });
        })
    });

    describe('GET /todos', () => {
        it('should get all to dos', (done) => {
            request(App)
                .get('/todos')
                .expect(200)
                .expect((serverResponse) => {
                    expect(serverResponse.body.todos.length).toBe(2);
                })
                .end(done);
        });
    });

    describe('GET /todos/:id', () => {
        it('should return 404 with not valid id', (done) => {
            request(App)
                .get(`/todos/${new ObjectId().toHexString()}${'fff'}`)
                .expect(404)
                .end(done);

        });

        it('should return 404 with id that not exists', (done) => {
            request(App)
                .get(`/todos/${new ObjectId().toHexString()}`)
                .expect(404)
                .end(done);
        });

        it('should return to do with proper id', (done) => {
            request(App)
                .get(`/todos/${todos[0]._id.toHexString()}`)
                .expect(200)
                .expect((serverResponse) => {
                    expect(serverResponse.body.todo.text).toBe(todos[0].text)
                })
                .end(done);
        });
    });

    describe('DELETE /todos/:id', () => {
        it('should return 404 for not valid id', (done) => {
            let id = '123'

            request(App)
                .delete(`/todos/${id}`)
                .expect(404)
                .expect((response) => {
                    expect(response.body.message).toBe('invalid id')
                })
                .end(done);
        });

        it('should return 404 if id dont exists', (done) => {
            let id = new ObjectId().toHexString();

            request(App)
                .delete(`/todos/${id}`)
                .expect(404)
                .expect((response) => {
                    expect(response.body.message).toBe('id dont exists')
                })
                .end(done);
        })

        it('should delete id from database', (done) => {
            let id = todos[0]._id.toHexString();

            request(App)
                .delete(`/todos/${id}`)
                .expect(200)
                .end((error, response) => {
                    expect(response.body.todo.text).toBe('First to do text');

                    if (error) {
                        return done(error);
                    }

                    ToDo.findById(id).then((todo) => {
                        expect(todo).toBeNull();
                        done();
                    }).catch(e => done(e))
                });
        });
    });
});
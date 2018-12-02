const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');

const { dbHook } = require('./db');
const mongoose = require('mongoose');
const { ToDo } = require('./models/todo');
const { User } = require('./models/user');

let app = express();
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.post('/todos', (request, response) => {

    console.log(request.body);

    /** @type {mongoose.Model} */
    let todo = new ToDo(request.body);
    todo.save().then((todo) => {
        response.send({ todo });
    }).catch((error) => {
        response.status(400).send(error);
    });
});

app.get('/todos', (request, response) => {

    ToDo.find().then((todos) => {
        response.send({ todos });
    }).catch((error) => {
        response.status(400).send(error);
    });
});

app.get('/todos/:id', (request, response) => {
    let id = request.params.id;

    if (!ObjectID.isValid(id)) {
        return response.status(404).send();
    }

    ToDo.findById(id).then((todo) => {
        if (!todo) {
            return response.status(404).send();
        }

        response.send({ todo });
    }).catch((e) => {
        response.status(400).send(e);
    });
});

app.delete('/todos/:id', (request, response) => {
    let id = request.params.id;

    if (!ObjectID.isValid(id)) {
        return response.status(404).send({ message: 'invalid id' })
    }

    ToDo.findByIdAndDelete(id).then((todo) => {
        if (!todo) {
            return response.status(404).send({ message: 'id dont exists' });
        }

        response.send({ todo });
    }).catch((e) => {
        response.status(400).send(e)
    })
})

app.post('/user', (request, response) => {

    console.log(request.body);

    let user = new User(request.body);

    user.saveWithAuthToken().then((result) => {
        let { dbUser, token } = result;
        response.header('x-auth', token).send(dbUser);

    }).catch((error) => {
        response.status(400).send(error);
    });
});

app.get('/user/me', (request, response) => {
    let token = request.header('x-auth');

    User.findByToken(token).then((user) => {
        if (!user) {
            return Promise.reject();
        }

        response.send(user);
    }).catch((error) => {
        response.status(401).send();
    });
});


exports = module.exports = { App: app }

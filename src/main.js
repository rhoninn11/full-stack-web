import express from 'express'
import bodyParser from 'body-parser';

import { dbHook } from './db';
import { ToDo } from './models/todo';
import { User } from './models/user';

var port = process.env.PORT || 3000;
var app = express();
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('hallo World');
});

app.post('/todos', (req, res) => {

    console.log(req.body);
    var newToDo = new ToDo(req.body);

    newToDo.save().then((dbEntity) => {
        res.send(dbEntity);
    }, (e) => {
        res.status(400).send(e);
    })
});

app.listen(port, () => console.log('server is running'));
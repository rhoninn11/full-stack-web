const mongoose = require('mongoose')
const url = 'mongodb://localhost:27017/TDApp';


mongoose.Promise = global.Promise;
mongoose.set('useCreateIndex', true);
mongoose.connect(url, { useNewUrlParser: true }).catch(error => {
    return console.log('db connection error')
});

exports = module.exports = {dbHook: mongoose}



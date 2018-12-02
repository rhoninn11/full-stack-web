const mongoose = require('mongoose')
const dbUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017/TDApp';


mongoose.Promise = global.Promise;
mongoose.set('useCreateIndex', true);
mongoose.connect(dbUrl, { useNewUrlParser: true }).catch(error => {
    return console.log('db connection error')
});

exports = module.exports = {dbHook: mongoose}



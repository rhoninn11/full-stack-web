import mongoose from 'mongoose';
const url = 'mongodb://localhost:27017/TDApp';

mongoose.Promise = global.Promise;
mongoose.connect(url)

export const dbHook = mongoose;



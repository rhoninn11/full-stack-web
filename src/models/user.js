import mongoose from 'mongoose'

var userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
    },
});

export var User = mongoose.model('User',userSchema);
import mongoose from 'mongoose'

var toDoSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Date,
        default: null
    }
})

export var ToDo = mongoose.model('ToDo', toDoSchema);


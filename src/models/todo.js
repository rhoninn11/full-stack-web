const mongoose = require('mongoose')

let toDoSchema = new mongoose.Schema({
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
let Todo = mongoose.model('ToDo', toDoSchema)
exports = module.exports = {ToDo: Todo}

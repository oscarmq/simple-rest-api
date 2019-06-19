import mongoose from 'mongoose'

const todoSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    }
})

export const Todo = mongoose.model('Todo', todoSchema)
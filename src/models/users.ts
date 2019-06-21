import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 32
    },
    email: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 64,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 256,
    }
})

export const User = mongoose.model('User', userSchema)

import express from 'express'
import Joi from 'joi'
import mongoose from 'mongoose'
import { DB_URL, DB_USER, DB_USER_PASSWORD } from './dbcredentials'

mongoose.connect(`mongodb+srv://${DB_USER}:${DB_USER_PASSWORD}@${DB_URL}`, { useNewUrlParser: true })

const todoSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    }
})

const Todo = mongoose.model('Todo', todoSchema)

const app = express()

app.use(express.json())

app.get('/api/todos', async (req, res) => {
    const todos = await Todo.find().sort('description')

    res.send(todos)
})

app.get('/api/todos/:id', async (req, res) => {
    const todo = await Todo.findById(req.params.id)

    if (!todo) return res.status(404).send('There is no todo with the given ID')

    res.send(todo)
})

app.post('/api/todos', async (req, res) => {
    const { error } = validateTodo(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    let todo = new Todo({ description: req.body.name })
    todo = await todo.save()

    res.send(todo)
})

app.put('/api/todos/:id', async (req, res) => {
    const { error } = validateTodo(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const todo = await Todo.findByIdAndUpdate(req.params.id, { description: req.body.description }, {
        new: true
    })

    if (!todo) return res.status(404).send('There is no todo with the given ID')

    res.send(todo)
})

app.delete('/api/todos/:id', async (req, res) => {
    const todo = await Todo.findByIdAndRemove(req.params.id)

    if (!todo) return res.status(404).send('There is no todo with the given ID')

    res.send(todo)
})

const validateTodo = (todo: any) => {
    const schema = {
        description: Joi.string().required()
    }
    return Joi.validate(todo, schema)
}

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Server started at http://localhost:${port}`))

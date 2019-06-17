import express from 'express'
import Joi from 'joi'
const app = express()

app.use(express.json())

interface ITodo {
    id: number,
    description: string
}

const todos = [
    { id: 1, description: 'ride your bike' },
    { id: 2, description: 'ride again' },
    { id: 3, description: 'learn something interesting' }
]

const validateTodo = (todo: ITodo) => {
    const schema = {
        description: Joi.string().required()
    }
    return Joi.validate(todo, schema)
}

app.get('/api/todos', (req, res) => res.send(todos))

app.get('/api/todos/:id', (req, res) => {
    const todo = todos.find((t) => t.id === parseInt(req.params.id))

    if (!todo) {
        return res.status(404).send('There is no todo with the given ID')
    }
    res.send(todo)
})

app.post('/api/todos', (req, res) => {
    const { error } = validateTodo(req.body)
    if (error) {
        return res.status(400).send(error.details[0].message)
    }

    const todo = {
        description: req.body.description,
        id: todos.length + 1
    }

    todos.push(todo)
    res.send(todo)
})

app.put('/api/todos/:id', (req, res) => {
    const todo = todos.find((t) => t.id === parseInt(req.params.id))

    if (!todo) {
        return res.status(404).send('There is no todo with the given ID')
    }

    const { error } = validateTodo(req.body)
    if (error) {
        return res.status(400).send(error.details[0].message)
    }

    todo.description = req.body.description
    res.send(todo)
})

app.delete('/api/todos/:id', (req, res) => {
    const todo = todos.find((t) => t.id === parseInt(req.params.id))

    if (!todo) {
        return res.status(404).send('There is no todo with the given ID')
    }

    const index = todos.indexOf(todo)
    todos.splice(index, 1)

    res.send(todo)
})

const port = process.env.PORT || 3000
// tslint:disable-next-line:no-console
app.listen(port, () => console.log(`Server started at http://localhost:${port}`))

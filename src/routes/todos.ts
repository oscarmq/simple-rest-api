import express from 'express'
import Joi from 'joi'
import { Todo } from '../models/todos'
export const router = express.Router()

router.get('/', async (req, res) => {
    const todos = await Todo.find().sort('description')
    res.send(todos)
})

router.get('/:id', async (req, res) => {
    const todo = await Todo.findById(req.params.id)

    if (!todo) return res.status(404).send('There is no todo with the given ID')

    res.send(todo)
})

router.post('/', async (req, res) => {
    const { error } = validateTodo(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    let todo = new Todo({ description: req.body.description })
    todo = await todo.save()

    res.send(todo)
})

router.put('/:id', async (req, res) => {
    const { error } = validateTodo(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const todo = await Todo.findByIdAndUpdate(req.params.id, { description: req.body.description }, {
        new: true
    })

    if (!todo) return res.status(404).send('There is no todo with the given ID')

    res.send(todo)
})

router.delete('/:id', async (req, res) => {
    const todo = await Todo.findByIdAndRemove(req.params.id)

    if (!todo) return res.status(404).send('There is no todo with the given ID')

    res.send(todo)
})

const validateTodo = (todo: any) => {
    const schema = {
        description: Joi.string().min(5).max(50).required()
    }
    return Joi.validate(todo, schema)
}

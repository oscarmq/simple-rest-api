import express from 'express'
import Joi from 'joi'
import { User } from '../models/users'

export const router = express.Router()

router.post('/', async (req, res) => {
    const { error } = validateUser(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    let user = await User.findOne({ email: req.body.email })
    if (user) return res.status(404).send('There is already an account with this email')

    user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    })
    user = await user.save()

    res.send(user)
})

const validateUser = (user: any) => {
    const schema = {
        name: Joi.string().min(2).max(32).required(),
        email: Joi.string().min(8).max(64).required().email(),
        password: Joi.string().min(8).max(256).required()
    }
    return Joi.validate(user, schema)
}

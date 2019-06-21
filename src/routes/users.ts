import bcrypt from 'bcrypt'
import express from 'express'
import Joi from 'joi'
import _ from 'lodash'
import { User } from '../models/users'


export const router = express.Router()

router.post('/', async (req, res) => {
    const { error } = validateUser(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    let user = await User.findOne({ email: req.body.email })
    if (user) return res.status(404).send('There is already an account with this email')

    user = new User(_.pick(req.body, ['name', 'email', 'password']))
    user.toObject({ getters: true })
    const salt = await bcrypt.genSalt()
    const password = await bcrypt.hash(user.get('password'), salt)

    user = new User({
        name: user.get('name'),
        email: user.get('email'),
        password: password
    })
    await user.save()

    res.send(_.pick(user, ['_id', 'name', 'email', 'password']))
})

const validateUser = (user: any) => {
    const schema = {
        name: Joi.string().min(2).max(32).required(),
        email: Joi.string().min(8).max(64).required().email(),
        password: Joi.string().min(8).max(256).required()
    }
    return Joi.validate(user, schema)
}

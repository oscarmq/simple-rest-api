import bcrypt from 'bcrypt'
import express from 'express'
import Joi from 'joi'
import jwt from 'jsonwebtoken'
import _ from 'lodash'
import { User } from '../models/users'

export const router = express.Router()

router.post('/', async (req, res) => {
    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    let user = await User.findOne({ email: req.body.email })
    if (!user) return res.status(400).send('Invalid email or password')

    user.toObject({ getters: true })
    const isValid = await bcrypt.compare(req.body.password, user.get('password'))
    if (!isValid) return res.status(400).send('Invalid email or password')
    
    const token = genAuthToken(user)
    res.send(token)
})

const genAuthToken = (user: any) => {
    return jwt.sign({ _id: user._id }, 'jwtDummySecretKey')
}

const validate = (req: any) => {
    const schema = {
        email: Joi.string().min(8).max(64).required().email(),
        password: Joi.string().min(8).max(256).required()
    }
    return Joi.validate(req, schema)
}

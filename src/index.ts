import express from 'express'
const app = express()

const todos = [
    { id: 1, todo: 'ride your bike' },
    { id: 1, todo: 'ride again' },
    { id: 1, todo: 'learn something interesting' }
]

app.get('/api/todos', (req, res) => res.send(todos))

const port = process.env.PORT || 3000
// tslint:disable-next-line:no-console
app.listen(port, () => console.log(`Server started at http://localhost:${port}`))

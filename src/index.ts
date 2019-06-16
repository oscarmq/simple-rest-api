import express from 'express'
const app = express()

app.get('/', (req, res) => res.send('Hello World!'))

const port = process.env.PORT || 3000
// tslint:disable-next-line:no-console
app.listen(port, () => console.log(`Server started at http://localhost:${port}`))

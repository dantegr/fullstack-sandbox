const express = require('express')
const cors = require('cors')
const bodyParser = require("body-parser")

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));



const routes = require('./endpoints/route.js')
app.use('/', routes)

/* app.get('/', (req, res) => res.send('Hello World!')) */

const PORT = 3001
app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))

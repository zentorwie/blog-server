const app = require('./app')

const port = process.env.NODE_ENV || 3000

app.listen(port)

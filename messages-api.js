// setup imports
const express = require('express')
const bodyParser = require('body-parser')

// setup express app and port
const app = express()
const port = 3000

// setup app to use bodyParser
app.use(bodyParser.json())

// setup app port listening
app.listen(port, () => {
  console.log(`I'm listening on port ${port} `)
})

// defined variables for API request limit
let count = 0
const requestLimit = 5

// setup endpoint to log text property and respond with JSON message object
app.post('/messages', (req, res) => {
  if (count < requestLimit) {
    if (req.body.text) {
      console.log(req.body.text)
      res.status(200).json({
        "message": "Message received loud and clear"
      })
      count ++
    } else if (!req.body.text || req.body.text === "") {
      res.status(400).send({"error": "Bad Request"})
    }
  }
  else {
    res.status(429).send({"error": "Too Many Requests"})
  }
})
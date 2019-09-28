// setup imports
const express = require('express')
const Sequelize = require('sequelize');
const databaseURL = 'postgres://postgres:secret@localhost:5432/postgres'
const db = new Sequelize(databaseURL);
const bodyParser = require('body-parser')

// setup express app and port
const app = express()
const port = 3001

// setup app to use bodyParser
app.use(bodyParser.json())

// setup app port listening
app.listen(port, () => {
  console.log(`I'm listening on port ${port}`)
})

// connected to DB
db
    .sync({force: true})
    // created 3 rows of example movies
    .then(() => 
        Movie.create({
          title: "The Godfather",
          yearOfRelease: 1972,
          synopsis: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son."
        })
    )
    .then(() => 
        Movie.create({
          title: "The Shawshank Redemption",
          yearOfRelease: 1994,
          synopsis: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency."
        })
    )
    .then(() => 
        Movie.create({
          title: "Schindler's List",
          yearOfRelease: 1993,
          synopsis: "In German-occupied Poland during World War II, industrialist Oskar Schindler gradually becomes concerned for his Jewish workforce after witnessing their persecution by the Nazis."
        })
    )
    .then(() => console.log('DB and table are synchronized'))
    .catch(error => {
        console.error('Unable to synchronize with DB', error);
    })

// created Movie model
const Movie = db.define('movie', {
  title: {
      type: Sequelize.STRING
  },
  yearOfRelease: {
      type: Sequelize.INTEGER
  },
  synopsis: {
      type: Sequelize.STRING
  }
})

// route for creating movie resource
app.post('/movies', (req, res, next) => {
  Movie.create(req.body)
    .then(movie => res.json(movie))
    .catch(next)
})

// route for reading all movies resources
app.get('/movies', (req, res, next) => {
  Movie.findAll()
      .then((movies) => {
        return res.status(200).send(movies)
      })
      .catch(next)
})

// route for reading a single movie resource
app.get('/movies/:id', (req, res, next) => {
  Movie.findByPk(req.params.id)
    .then(movie => {
      if (movie) {
        return res.status(200).json(movie)
      } else {
        return res.status(404).end()
      }
    })
    .catch(next)
})

// route for updating a single movie resource
app.put('/movies/:id', (req, res, next) => {
  Movie.findByPk(req.params.id)
    .then(movie => {
      if (movie) {
        return movie.update(req.body)
        .then(movie => res.status(200).json(movie))
      } else {
        return res.status(404).end()
      }
    })
    .catch(next)
})

// route for deleting a single movie resource
app.delete('/movies/:id', (req, res, next) => {
  Movie.findByPk(req.params.id)
    .then(movie => {
      if (movie) {
        return movie.destroy(req.body)
        .then(res.status(200).send("Movie deleted successfully"))
      } else {
        return res.status(404).end()
      }
    })
    .catch(next)
})
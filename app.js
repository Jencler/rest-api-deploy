const express = require('express')
const crypto = require('node:crypto')
const cors = require('cors')
const moviesAll = require('./movies.json')
const { validateMovie, validatePartialMovie } = require('./schemas/movies')
const app = express()
app.disable('x-powered-by') 

app.use(express.json())
app.use(cors({
  origin: (origin, callback) => {
    const ACCEPED_ORIGINS = [
      'http://localhost:8080',
      'http://localhost:1234',
      'https://movies.com',
      'https://jencler.com',
      'https:doobril.com'
    ]
    if (ACCEPED_ORIGINS.includes(origin)) {
      return callback(null, true)
    }
    if (!origin) {
      return callback(null, true)
    }

    return callback(new Error('Not allowed by CORS'))
  }
}))

app.get('/', (req, res) => {
  res.json({ message: 'Bienvenidos a mi API de peliculas' })
})

// Todas Las movies
app.get('/movies', (req, res) => {

  const { genre } = req.query
  if (genre) {
    const filterMovie = moviesAll.filter(
      movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
    )
    return res.json(filterMovie)
  }

  res.json(moviesAll)
})

app.get('/movies/:id', (req, res) => { // Path-to -regexp
  const { id } = req.params // Los datos entre llaves {}
  const movie = moviesAll.find(movie => movie.id === id)
  if (movie) return res.json(movie)
  res.status(400).json({ message: 'La película no fue encontrado' })
})

app.post('/movies', (req, res) => { // siempre usar el mismo recurso la misma url que trae todas las peliculas solo quje en este caso el metodo POST
  const result = validateMovie(req.body)

  // Si hay errores
  if (result.error) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }

  const newMovie = {
    id: crypto.randomUUID(), // uui v4
    ...result.data
  }

  moviesAll.push(newMovie)
  // devolvemos la pelicula creada
  res.status(201).json(newMovie)
})

app.patch('/movies/:id', (req, res) => {
  const result = validatePartialMovie(req.body)
  // Si hay errores
  if (result.error) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }

  const { id } = req.params
  // Usamos findIndex  en esta manera pero en base de datos seguro sera otra
  const movieIndex = moviesAll.findIndex(movie => movie.id === id)

  if (movieIndex === -1) {
    return res.status(404).json({ message: 'Película no encontrada' })
  }

  const updateMovie = {
    ...moviesAll[movieIndex],
    ...result.data
  }

  moviesAll[movieIndex] = updateMovie

  res.json(updateMovie)
})

app.delete('/movies/:id', (req, res) => {

  const { id } = req.params
  const movieIndex = moviesAll.findIndex(movie => movie.id === id)

  if (movieIndex === -1) {
    return res.status(404).json({ message: 'Película no encontrada' })
  }
  moviesAll.splice(movieIndex, 1)

  return res.json({ message: 'Pelicula eliminada' })
})

app.use((req, res) => {
  res.send('<h1>404</h1>')
})

const PORT = process.env.PORT ?? 1234


app.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT}`)
})

const z = require('zod')

const MovieSchema = z.object({
  title: z.string({
    invalid_type_error: 'El titulo de la película debe ser un texto',
    required_error: 'EL titulo de la película es requerido'
  }),
  year: z.number().int().min(1900).positive(),
  director: z.string(),
  duration: z.number().int().positive(),
  poster: z.string().url({
    message: 'La URL del poster es invalidad'
  }),
  genre: z.array(
    z.enum(['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Thriller', 'Sci-Fi']),
    {
      required_error: 'Genero de la película requerido',
      invalid_type_error: 'Es un array de generos'
    }
  ),
  rate: z.number().int().min(0).max(10).default(5)

})

function validateMovie (object) {
  return MovieSchema.safeParse(object) // Con safeParse validaremos si hubo un error o hay datos.
}

function validatePartialMovie (object) {
  return MovieSchema.partial().safeParse(object)
}

module.exports = {
  validateMovie,
  validatePartialMovie
}

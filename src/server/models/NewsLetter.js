  import mongoose, { Schema } from 'mongoose'
  import mongoosePaginate from 'mongoose-paginate'
  import { _extend } from 'util'

  // se crea el schema que utilizará el modelo
  let NewsLetterSchema = new Schema({
    email: {
      type: String,
      unique: true,
      required: true,
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  })

  // se agrega el plugin de paginacion de mongoose
  NewsLetterSchema.plugin(mongoosePaginate);

  // se obtiene la estructura del NewsLetterSchema
  let NewsLetterSchemaPaths = _extend({}, NewsLetterSchema.paths)

  if (NewsLetterSchemaPaths.createdAt) {
    delete NewsLetterSchemaPaths.createdAt
  }
  if (NewsLetterSchemaPaths.updatedAt) {
    delete NewsLetterSchemaPaths.updatedAt
  }

  // retorna un array con todas las propuedades del modelo
  let NewsLetterSchemaKeys = Object.keys(NewsLetterSchemaPaths)

  // se crea el modelo de la coleccion
  let model = mongoose.model('NewsLetter', NewsLetterSchema)

  // se exporta el mapeo del modelo
  export const LevelKeys = NewsLetterSchemaKeys

  // se exporta el nuevo modelo
  export default model

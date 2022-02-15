import mongoose, { Schema } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate'
import { _extend } from 'util'

// se crea el schema que utilizará el modelo
let WordSchema = new Schema({
  word: String,
  lenguageId: {
    type: Schema.Types.ObjectId,
    ref: 'Language',
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

// se agrega el plugin de paginacion de mongoose
WordSchema.plugin(mongoosePaginate);

// se obtiene la estructura del UserSchema
let WordSchemaPaths = _extend({}, WordSchema.paths)

if (WordSchemaPaths.createdAt) {
  delete WordSchemaPaths.createdAt
}
if (WordSchemaPaths.updatedAt) {
  delete WordSchemaPaths.updatedAt
}

// retorna un array con todas las propuedades del modelo
let WordSchemaKeys = Object.keys(WordSchemaPaths)

// se crea el modelo de la coleccion
let model = mongoose.model('Word', WordSchema)

// se exporta el mapeo del modelo
export const WordKeys = WordSchemaKeys

// se exporta el nuevo modelo
export default model

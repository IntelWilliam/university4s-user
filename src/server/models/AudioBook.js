import mongoose, { Schema } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate'
import { _extend } from 'util'

// se crea el schema que utilizará el modelo
let AudioBookSchema = new Schema({
  name: String,
  audioUrl: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

// se agrega el plugin de paginacion de mongoose
AudioBookSchema.plugin(mongoosePaginate);

// se obtiene la estructura del UserSchema
let AudioBookSchemaPaths = _extend({}, AudioBookSchema.paths)

if (AudioBookSchemaPaths.createdAt) {
  delete AudioBookSchemaPaths.createdAt
}
if (AudioBookSchemaPaths.updatedAt) {
  delete AudioBookSchemaPaths.updatedAt
}

// retorna un array con todas las propuedades del modelo
let AudioBookSchemaKeys = Object.keys(AudioBookSchemaPaths)

// se crea el modelo de la coleccion
let model = mongoose.model('AudioBook', AudioBookSchema)

// se exporta el mapeo del modelo
export const AudioBookKeys = AudioBookSchemaKeys

// se exporta el nuevo modelo
export default model

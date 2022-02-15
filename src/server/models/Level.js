import mongoose, { Schema } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate'
import { _extend } from 'util'

// se crea el schema que utilizará el modelo
let LevelSchema = new Schema({
  name: String,
  phraseId: {
    type: Schema.Types.ObjectId,
    ref: 'Phrase',
  },
  isEnabled: { type: Boolean, default: true},
  position: Number,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

// se agrega el plugin de paginacion de mongoose
LevelSchema.plugin(mongoosePaginate);

// se obtiene la estructura del LevelSchema
let LevelSchemaPaths = _extend({}, LevelSchema.paths)

if (LevelSchemaPaths.createdAt) {
  delete LevelSchemaPaths.createdAt
}
if (LevelSchemaPaths.updatedAt) {
  delete LevelSchemaPaths.updatedAt
}

// retorna un array con todas las propuedades del modelo
let LevelSchemaKeys = Object.keys(LevelSchemaPaths)

// se crea el modelo de la coleccion
let model = mongoose.model('Level', LevelSchema)

// se exporta el mapeo del modelo
export const LevelKeys = LevelSchemaKeys

// se exporta el nuevo modelo
export default model

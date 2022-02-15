import mongoose, { Schema } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate'
import { _extend } from 'util'

// se crea el schema que utilizará el modelo
let SubLevelSchema = new Schema({
  name: String,
  position: Number,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  levelId: {
    type: Schema.Types.ObjectId,
    ref: 'Level'
  },
  phraseId: {
    type: Schema.Types.ObjectId,
    ref: 'Phrase',
  },
  isEnabled: { type: Boolean, default: true}
})

// se agrega el plugin de paginacion de mongoose
SubLevelSchema.plugin(mongoosePaginate);

// se obtiene la estructura del SubLevelSchema
let SubLevelSchemaPaths = _extend({}, SubLevelSchema.paths)

if (SubLevelSchemaPaths.createdAt) {
  delete SubLevelSchemaPaths.createdAt
}
if (SubLevelSchemaPaths.updatedAt) {
  delete SubLevelSchemaPaths.updatedAt
}

// retorna un array con todas las propuedades del modelo
let SubLevelSchemaKeys = Object.keys(SubLevelSchemaPaths)

// se crea el modelo de la coleccion
let model = mongoose.model('SubLevel', SubLevelSchema)

// se exporta el mapeo del modelo
export const SubLevelKeys = SubLevelSchemaKeys

// se exporta el nuevo modelo
export default model

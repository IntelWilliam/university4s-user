import mongoose, { Schema } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate'
import { _extend } from 'util'

// se crea el schema que utilizará el modelo
let EntitySchema = new Schema({
  name: String,
  isEnabled: { type: Boolean, default: true},
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

// se agrega el plugin de paginacion de mongoose
EntitySchema.plugin(mongoosePaginate);

// se obtiene la estructura del EntitySchema
let EntitySchemaPaths = _extend({}, EntitySchema.paths)

if (EntitySchemaPaths.createdAt) {
  delete EntitySchemaPaths.createdAt
}
if (EntitySchemaPaths.updatedAt) {
  delete EntitySchemaPaths.updatedAt
}

// retorna un array con todas las propuedades del modelo
let EntitySchemaKeys = Object.keys(EntitySchemaPaths)

// se crea el modelo de la coleccion
let model = mongoose.model('Entity', EntitySchema)

// se exporta el mapeo del modelo
export const EntityKeys = EntitySchemaKeys

// se exporta el nuevo modelo
export default model

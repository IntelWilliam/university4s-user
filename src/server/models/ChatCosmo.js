import mongoose, { Schema } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate'
import { _extend } from 'util'

// se crea el schema que utilizará el modelo
let ChatCosmoSchema = new Schema({
  story: String,
  storyRaw: [
    String,
  ],
  phrase: String,
  sesionId: String,
  cosmoResponse: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

// se agrega el plugin de paginacion de mongoose
ChatCosmoSchema.plugin(mongoosePaginate);

// se obtiene la estructura del ChatCosmoSchema
let ChatCosmoSchemaPaths = _extend({}, ChatCosmoSchema.paths)

if (ChatCosmoSchemaPaths.createdAt) {
  delete ChatCosmoSchemaPaths.createdAt
}
if (ChatCosmoSchemaPaths.updatedAt) {
  delete ChatCosmoSchemaPaths.updatedAt
}

// retorna un array con todas las propuedades del modelo
let ChatCosmoSchemaKeys = Object.keys(ChatCosmoSchemaPaths)

// se crea el modelo de la coleccion
let model = mongoose.model('ChatCosmo', ChatCosmoSchema)

// se exporta el mapeo del modelo
export const ChatCosmoKeys = ChatCosmoSchemaKeys

// se exporta el nuevo modelo
export default model

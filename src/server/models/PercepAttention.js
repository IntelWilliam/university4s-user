import mongoose, { Schema } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate'
import { _extend } from 'util'

// se crea el schema que utilizará el modelo
let PercepAttentionSchema = new Schema({
  comment: String,
  roomId: String,
  score: Number,
  studentId: Number,
  time: Number,
  userName: String,
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  entityName: String,
  entityId: {
    type: Schema.Types.ObjectId,
    ref: 'Entity',
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

// se agrega el plugin de paginacion de mongoose
PercepAttentionSchema.plugin(mongoosePaginate);

// se obtiene la estructura del PercepAttentionSchema
let PercepAttentionSchemaPaths = _extend({}, PercepAttentionSchema.paths)

if (PercepAttentionSchemaPaths.createdAt) {
  delete PercepAttentionSchemaPaths.createdAt
}
if (PercepAttentionSchemaPaths.updatedAt) {
  delete PercepAttentionSchemaPaths.updatedAt
}

// retorna un array con todas las propuedades del modelo
let PercepAttentionSchemaKeys = Object.keys(PercepAttentionSchemaPaths)

// se crea el modelo de la coleccion
let model = mongoose.model('PercepAttention', PercepAttentionSchema)

// se exporta el mapeo del modelo
export const PercepAttentionKeys = PercepAttentionSchemaKeys

// se exporta el nuevo modelo
export default model

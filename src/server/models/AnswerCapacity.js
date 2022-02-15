import mongoose, { Schema } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate'
import { _extend } from 'util'

// se crea el schema que utilizará el modelo
let AnswerCapacitySchema = new Schema({
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
  callDate: { type: Date, default: Date.now },
  callRespose: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

// se agrega el plugin de paginacion de mongoose
AnswerCapacitySchema.plugin(mongoosePaginate);

// se obtiene la estructura del AnswerCapacitySchema
let AnswerCapacitySchemaPaths = _extend({}, AnswerCapacitySchema.paths)

if (AnswerCapacitySchemaPaths.createdAt) {
  delete AnswerCapacitySchemaPaths.createdAt
}
if (AnswerCapacitySchemaPaths.updatedAt) {
  delete AnswerCapacitySchemaPaths.updatedAt
}

// retorna un array con todas las propuedades del modelo
let AnswerCapacitySchemaKeys = Object.keys(AnswerCapacitySchemaPaths)

// se crea el modelo de la coleccion
let model = mongoose.model('AnswerCapacity', AnswerCapacitySchema)

// se exporta el mapeo del modelo
export const AnswerCapacityKeys = AnswerCapacitySchemaKeys

// se exporta el nuevo modelo
export default model

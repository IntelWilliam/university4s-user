import mongoose, { Schema } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate'
import { _extend } from 'util'

// se crea el schema que utilizará el modelo
let UserDateSchema = new Schema({
  userName: String,
  userLastName: String,
  userEmail: String,
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  platform: String,
  enterDate: { type: Date, default: Date.now },
  GetOutDate: { type: Date, default: Date.now },
  isChat: Boolean,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

// se agrega el plugin de paginacion de mongoose
UserDateSchema.plugin(mongoosePaginate);

// se obtiene la estructura del UserDateSchema
let UserDateSchemaPaths = _extend({}, UserDateSchema.paths)

if (UserDateSchemaPaths.createdAt) {
  delete UserDateSchemaPaths.createdAt
}
if (UserDateSchemaPaths.updatedAt) {
  delete UserDateSchemaPaths.updatedAt
}

// retorna un array con todas las propuedades del modelo
let UserDateSchemaKeys = Object.keys(UserDateSchemaPaths)

// se crea el modelo de la coleccion
let model = mongoose.model('UserDate', UserDateSchema)

// se exporta el mapeo del modelo
export const UserDateKeys = UserDateSchemaKeys

// se exporta el nuevo modelo
export default model

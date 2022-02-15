import mongoose, { Schema } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate'
import { _extend } from 'util'

// se crea el schema que utilizará el modelo
let ChatBoxSchema = new Schema({
  studentId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  messages: [
    {
      messageType: Number, // 0 enviado por el estudiante, 1 enviado por el profesor
      isUrl: Boolean,
      message: String
    }
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  userName: String,
  userLastname: String,
  unReadMessage: Boolean,
  lastMesage: String,
  lastMesageFrom: Number,
})

// se agrega el plugin de paginacion de mongoose
ChatBoxSchema.plugin(mongoosePaginate);

// se obtiene la estructura del ChatBoxSchema
let ChatBoxSchemaPaths = _extend({}, ChatBoxSchema.paths)

if (ChatBoxSchemaPaths.createdAt) {
  delete ChatBoxSchemaPaths.createdAt
}
if (ChatBoxSchemaPaths.updatedAt) {
  delete ChatBoxSchemaPaths.updatedAt
}

// retorna un array con todas las propuedades del modelo
let ChatBoxSchemaKeys = Object.keys(ChatBoxSchemaPaths)

// se crea el modelo de la coleccion
let model = mongoose.model('ChatBox', ChatBoxSchema)

// se exporta el mapeo del modelo
export const ChatBoxKeys = ChatBoxSchemaKeys

// se exporta el nuevo modelo
export default model

import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate'
import { _extend } from 'util'

let Schema = mongoose.Schema

// se crea el schema que utilizará el modelo
let UserSchema = new Schema({
  userIdDev: { type: Number, unique: true },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  notifyType: Number,
  notifyNumber: Number,
  name: String,
  lastname: String,
  email: String,
  role: String,
  status: Number, // 0 desconectado, 1 disponible
  inCall: Number, // 0 disponible, 1 en llamada
  studentsOnline: Number, // numero de estudiantes que atiende
  socket: {
    id: String
  },
  profileImg: String
}, {
  timestamps: true
});

// se agrega el plugin de paginacion de mongoose
UserSchema.plugin(mongoosePaginate);

// se crea el modelo de la coleccion
let model = mongoose.model('UserChat', UserSchema)

let UserSchemaPaths = _extend({}, UserSchema.paths)
let UserSchemaKeys = Object.keys(UserSchemaPaths)

// se exporta el mapeo del usuario
export const UserChatKeys = UserSchemaKeys


// se exporta el nuevo modelo
export default model

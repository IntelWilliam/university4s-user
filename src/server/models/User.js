import mongoose, {Schema} from 'mongoose'
import mongoosePaginate from 'mongoose-paginate'
import {_extend} from 'util'

// se crea el schema que utilizará el modelo
let UserSchema = new Schema({
  languageId: Schema.Types.ObjectId,
  password: String,
  userIdDev: {type: Number, unique: true},
  username: {type: String, unique: true, required: true, dropDups: true},
  email: {type: String, unique: true, required: true, dropDups: true},
  name: String,
  lastname: String,
  documentID: Number,
  profileImg: String,

  userCountry: String,
  userState: String,
  userProvince: String,
  userCity: String,

  // datos de la persona que compro el curso
  titularId: Number,
  titularName: String,
  titularLastName: String,
  direction: String,
  phone: Number,
  homePhone: Number,

  //informacion del titular
  titularCountry: String,
  titularState: String,
  titularProvince: String,
  titularCity: String,
  // department: String,

  role: String,
  salt: String,
  birthdate: Date,
  gender: Boolean,
  status: Boolean,
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now},
  learningLanguages: [Schema.Types.ObjectId],
  facebookId: String,
  //  T = accountLevel= 1  B = accountLevel =2
  accountLevel: Number,
  lastConection: {type: Date, default: Date.now},
  missingOral: Boolean,
  approveDifficult: Number,
  missingOralSubLevel: String,
  entityCode: {
    type: Schema.Types.ObjectId,
    ref: 'Entity',
  },
  entityName: {
    type: String,
  },
  lastMesage: String,
  lastMesageDate: Date,
  unReadMesage: Boolean,
  coupleId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  coupleName: String,
  coupleLastName: String,
  coupleEmail: String,
  notifyCert: Number,
  acceptTerms: {type: Boolean, default: false},

  // buyerName: String,
  // buyerLastName: String,
  // buyerDirection: String,
  // buyerDepartamento: String,
  // buyerPhone: String,
  // buyerHomePhone: String,

  isMonthDisconnectNotify: {type: Boolean, default: false},
})

// se agrega el plugin de paginacion de mongoose
UserSchema.plugin(mongoosePaginate);

// se obtiene la estructura del UserSchema
let UserSchemaPaths = _extend({}, UserSchema.paths)
// se eliminan los keys que no sirven para una query
// if (UserSchemaPaths._id) {
//   delete UserSchemaPaths._id
// }
if (UserSchemaPaths.languageId) {
  delete UserSchemaPaths.languageId
}
if (UserSchemaPaths.birthdate) {
  delete UserSchemaPaths.birthdate
}
if (UserSchemaPaths.gender) {
  delete UserSchemaPaths.gender
}
if (UserSchemaPaths.password) {
  delete UserSchemaPaths.password
}
if (UserSchemaPaths.status) {
  delete UserSchemaPaths.status
}
if (UserSchemaPaths.createdAt) {
  delete UserSchemaPaths.createdAt
}
if (UserSchemaPaths.updatedAt) {
  delete UserSchemaPaths.updatedAt
}
if (UserSchemaPaths.learningLanguages) {
  delete UserSchemaPaths.learningLanguages
}

// retorna un array con todas las propuedades del modelo
let UserSchemaKeys = Object.keys(UserSchemaPaths)

// se crea el modelo de la coleccion
let model = mongoose.model('User', UserSchema)

// se exporta el nuevo modelo
export default model

// se exporta el mapeo del usuario
export const UserKeys = UserSchemaKeys

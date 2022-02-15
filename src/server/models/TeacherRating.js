import mongoose, { Schema } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate'
import { _extend } from 'util'

// se crea el schema que utilizará el modelo
let TeacherRatingSchema = new Schema({
  lessonStuding: String,
  currentLevel: Number,
  hasHomework: {type: Boolean, default: true},
  objection: String,

  userIdDev: {type: Number},
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  userName: String,
  userEmail: String,

  teacherIdDev: {type: Number},
  teacherId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  teacherName: String,
  teacherEmail: String,

  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now},
})

// se agrega el plugin de paginacion de mongoose
TeacherRatingSchema.plugin(mongoosePaginate);

// se obtiene la estructura del TeacherRatingSchema
let TeacherRatingSchemaPaths = _extend({}, TeacherRatingSchema.paths)

if (TeacherRatingSchemaPaths.createdAt) {
  delete TeacherRatingSchemaPaths.createdAt
}
if (TeacherRatingSchemaPaths.updatedAt) {
  delete TeacherRatingSchemaPaths.updatedAt
}

// retorna un array con todas las propuedades del modelo
let TeacherRatingSchemaKeys = Object.keys(TeacherRatingSchemaPaths)

// se crea el modelo de la coleccion
let model = mongoose.model('TeacherRating', TeacherRatingSchema)

// se exporta el mapeo del modelo
export const TeacherRatingKeys = TeacherRatingSchemaKeys

// se exporta el nuevo modelo
export default model

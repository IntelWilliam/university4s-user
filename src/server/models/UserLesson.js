import mongoose, { Schema } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate'
import { _extend } from 'util'

// se crea el schema que utilizará el modelo
let UserLessonSchema = new Schema({
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  subLevelId: {
    type: Schema.Types.ObjectId,
    ref: 'SubLevel'
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  unlockedLessons: [{
    type: Schema.Types.ObjectId,
    ref: 'Lesson'
  }]
})


// se obtiene la estructura del LessonSchema
let UserLessonSchemaPaths = _extend({}, UserLessonSchema.paths)

if (UserLessonSchemaPaths.createdAt) {
  delete UserLessonSchemaPaths.createdAt
}
if (UserLessonSchemaPaths.updatedAt) {
  delete UserLessonSchemaPaths.updatedAt
}

// retorna un array con todas las propuedades del modelo
let UserLessonSchemaKeys = Object.keys(UserLessonSchemaPaths)

// se crea el modelo de la coleccion
let model = mongoose.model('UserLesson', UserLessonSchema)

// se exporta el mapeo del modelo
export const UserLessonKeys = UserLessonSchemaKeys

// se exporta el nuevo modelo
export default model

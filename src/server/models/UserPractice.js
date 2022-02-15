import mongoose, { Schema } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate'
import { _extend } from 'util'

// se crea el schema que utilizará el modelo
let UserPracticeSchema = new Schema({
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  lessonId: {
    type: Schema.Types.ObjectId,
    ref: 'Lesson'
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  unlockedPractices: [{
    type: Schema.Types.ObjectId,
    ref: 'Practice',
  }]
})


// se obtiene la estructura del LessonSchema
let UserPracticeSchemaPaths = _extend({}, UserPracticeSchema.paths)

if (UserPracticeSchemaPaths.createdAt) {
  delete UserPracticeSchemaPaths.createdAt
}
if (UserPracticeSchemaPaths.updatedAt) {
  delete UserPracticeSchemaPaths.updatedAt
}

// retorna un array con todas las propuedades del modelo
let UserPracticeSchemaKeys = Object.keys(UserPracticeSchemaPaths)

// se crea el modelo de la coleccion
let model = mongoose.model('UserPractice', UserPracticeSchema)

// se exporta el mapeo del modelo
export const UserPracticeKeys = UserPracticeSchemaKeys

// se exporta el nuevo modelo
export default model

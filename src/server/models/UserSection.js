import mongoose, { Schema } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate'
import { _extend } from 'util'

// se crea el schema que utilizará el modelo
let UserSectionSchema = new Schema({
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  practiceId: {
    type: Schema.Types.ObjectId,
    ref: 'Practice'
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  unlockedSections: [{
    type: Schema.Types.ObjectId,
    ref: 'Section'
  }]
})


// se obtiene la estructura del LessonSchema
let UserSectionSchemaPaths = _extend({}, UserSectionSchema.paths)

if (UserSectionSchemaPaths.createdAt) {
  delete UserSectionSchemaPaths.createdAt
}
if (UserSectionSchemaPaths.updatedAt) {
  delete UserSectionSchemaPaths.updatedAt
}

// retorna un array con todas las propuedades del modelo
let UserSectionSchemaKeys = Object.keys(UserSectionSchemaPaths)

// se crea el modelo de la coleccion
let model = mongoose.model('UserSection', UserSectionSchema)

// se exporta el mapeo del modelo
export const UserSectionKeys = UserSectionSchemaKeys

// se exporta el nuevo modelo
export default model

import mongoose, { Schema } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate'
import { _extend } from 'util'

// se crea el schema que utilizará el modelo
let LessonSchema = new Schema({
  name: String,
  position: Number,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  subLevelId: {
    type: Schema.Types.ObjectId,
    ref: 'SubLevel'
  },
  isEnabled: { type: Boolean, default: true},
  smallImage: String,
  imageUrl: String,
  description: String,
  phraseId: {
    type: Schema.Types.ObjectId,
    ref: 'Phrase',
  },
})

// se agrega el plugin de paginacion de mongoose
LessonSchema.plugin(mongoosePaginate);

// se obtiene la estructura del LessonSchema
let LessonSchemaPaths = _extend({}, LessonSchema.paths)

if (LessonSchemaPaths.createdAt) {
  delete LessonSchemaPaths.createdAt
}
if (LessonSchemaPaths.updatedAt) {
  delete LessonSchemaPaths.updatedAt
}

// retorna un array con todas las propuedades del modelo
let LessonSchemaKeys = Object.keys(LessonSchemaPaths)

// se crea el modelo de la coleccion
let model = mongoose.model('Lesson', LessonSchema)

// se exporta el mapeo del modelo
export const LessonKeys = LessonSchemaKeys

// se exporta el nuevo modelo
export default model

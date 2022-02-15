import mongoose, { Schema } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate'
import { _extend } from 'util'

// se crea el schema que utilizará el modelo
let moodleLessonEditSchema = new Schema({
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  moodleLesonId: Number,
  smallImage: String,
  imageUrl: String
})

// se agrega el plugin de paginacion de mongoose
moodleLessonEditSchema.plugin(mongoosePaginate);

// se obtiene la estructura del moodleLessonEditSchema
let moodleLessonEditSchemaPaths = _extend({}, moodleLessonEditSchema.paths)

if (moodleLessonEditSchemaPaths.createdAt) {
  delete moodleLessonEditSchemaPaths.createdAt
}
if (moodleLessonEditSchemaPaths.updatedAt) {
  delete moodleLessonEditSchemaPaths.updatedAt
}

// retorna un array con todas las propuedades del modelo
let moodleLessonEditSchemaKeys = Object.keys(moodleLessonEditSchemaPaths)

// se crea el modelo de la coleccion
let model = mongoose.model('moodleLessonEdit', moodleLessonEditSchema)

// se exporta el mapeo del modelo
export const moodleLessonEditKeys = moodleLessonEditSchemaKeys

// se exporta el nuevo modelo
export default model

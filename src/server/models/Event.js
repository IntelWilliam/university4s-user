import mongoose, { Schema } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate'
import { _extend } from 'util'

/*
 * se crea el modelo para los examenes
 */
let EventSchema = new Schema({
  entryId: {
    type: Schema.Types.ObjectId,
    ref: 'Entry',
  },
  entryType: Number,
  entryName: String,
  lessonWebLessonId: {
    type: Schema.Types.ObjectId,
    ref: 'Lesson'
  },
  lessonMoodleId: Number, // ID de una leccion (moodle)
  lessonIndex: Number,
  lessonName: String,
  lessonTranslate: String,
  lastLesson: String,
  subWebSublevelId: {
    type: Schema.Types.ObjectId,
    ref: 'SubLevel'
  },
  examEvent: Boolean,
  sublevelMoodleId: Number, // ID del sublevel (moodle)
  subLevelName: String,
  levelName: String,
  levelWebLevelId: {
    type: Schema.Types.ObjectId,
    ref: 'Level'
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  date: { type: Date, default: Date.now, index: true },
})
// se agrega el plugin de paginacion de mongoose
EventSchema.plugin(mongoosePaginate);

// se obtiene la estructura del InteractionSchema
let EventSchemaPaths = _extend({}, EventSchema.paths)

// retorna un array con todas las propiedades del modelo
let EventSchemaKeys = Object.keys(EventSchemaPaths)

// se crea el modelo de la coleccion
let model = mongoose.model('Event', EventSchema)

// se exporta el mapeo del modelo
export const EventKeys = EventSchemaKeys

// se exporta el nuevo modelo
export default model

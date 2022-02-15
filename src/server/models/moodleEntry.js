import mongoose, { Schema } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate'
import { _extend } from 'util'

/*
 * se crea el modelo para las entradas
 */
let EntrySchema = new Schema({
  // Nombre de la entrada input
  name: String,
  position: Number,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  // tipo de plactica de Laboratorio
  labPracticeType: Number,
  // Tipo de entrada
  entryType: Number,
  // section ID
  sectionId: String,
  sectionObjId: {
    type: Schema.Types.ObjectId,
    ref: 'Section'
  },
  // opcional si es de tipo subir archivo
  extension: String,
  // opcional si es de tipo subir archivo
  uriFile: String,
  // opcional si es de tipo subir Audio-Texto
  text: String,
  // ID de una leccion (no moodle)
  lessonWebLessonId: {
    type: Schema.Types.ObjectId,
    ref: 'Lesson'
  },
  subWebSublevelId: {
    type: Schema.Types.ObjectId,
    ref: 'SubLevel'
  },
  levelWebLevelId: {
    type: Schema.Types.ObjectId,
    ref: 'Level'
  },
  // ID de una leccion (moodle)
  lessonMoodleId: Number,
  // ID del sublevel (moodle)
  sublevelMoodleId: Number,
  // Nombre de la lección
  nameLesson: String,
  //Nombre del subnivel
  nameSubLevel: String,
  //Nombre del nivel
  nameLevel: String,
  // Acceso a crear un nuevo examen del Modelo tipo examen
  examId: {
    type: Schema.Types.ObjectId,
    ref: 'Exam'
  },
  isEnabled: {
    type: Boolean,
    default: true
  }

})

// se agrega el plugin de paginacion de mongoose
EntrySchema.plugin(mongoosePaginate);

// se obtiene la estructura del EntrySchema
let EntrySchemaPaths = _extend({}, EntrySchema.paths)

if (EntrySchemaPaths.createdAt) {
  delete EntrySchemaPaths.createdAt
}
if (EntrySchemaPaths.updatedAt) {
  delete EntrySchemaPaths.updatedAt
}

// retorna un array con todas las propuedades del modelo
let EntrySchemaKeys = Object.keys(EntrySchemaPaths)

// se crea el modelo de la coleccion
let model = mongoose.model('Entry', EntrySchema)

// se exporta el mapeo del modelo
export const EntryKeys = EntrySchemaKeys

// se exporta el nuevo modelo
export default model

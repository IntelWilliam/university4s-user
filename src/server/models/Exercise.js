import mongoose, { Schema } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate'
import { _extend } from 'util'

/*
 * se crea el modelo para los ejercicios
 */
let ExerciseSchema = new Schema({
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  phraseId: {
    type: Schema.Types.ObjectId,
    ref: 'Phrase',
  },
  description: String,
  castell: String,
  languageId: {
    type: Schema.Types.ObjectId,
    ref: 'Language',
  },
  fakePhrase: String,
  interactionId: {
    type: Schema.Types.ObjectId,
    ref: 'Interaction',
  },
  phrasesAndPictures: [{
    phraseId: {
      type: Schema.Types.ObjectId,
      ref: 'Phrase',
    },
    imageUrl: String,
    phrase: String
  }],
  missingWords: [{
    word: String,
    isHidden: Boolean
  }],

  fakeTranslations: [String],
  exerciseType: Number,
  phrase: String,

})

// se agrega el plugin de paginacion de mongoose
ExerciseSchema.plugin(mongoosePaginate);

// se obtiene la estructura del InteractionSchema
let ExerciseSchemaPaths = _extend({}, ExerciseSchema.paths)

if (ExerciseSchemaPaths.createdAt) {
  delete ExerciseSchemaPaths.createdAt
}
if (ExerciseSchemaPaths.updatedAt) {
  delete ExerciseSchemaPaths.updatedAt
}

// retorna un array con todas las propuedades del modelo
let ExerciseSchemaKeys = Object.keys(ExerciseSchemaPaths)

// se crea el modelo de la coleccion
let model = mongoose.model('Exercise', ExerciseSchema)

// se exporta el mapeo del modelo
export const ExerciseKeys = ExerciseSchemaKeys

// se exporta el nuevo modelo
export default model

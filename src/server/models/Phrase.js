import mongoose, { Schema } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate'
import { _extend } from 'util'

// se crea el schema que utilizará el modelo
let PhraseSchema = new Schema({
  lenguageId: {
    type: Schema.Types.ObjectId,
    ref: 'Language',
  },
  phrase: String,
  phraseRaw: String,
  words: [{
    type: Schema.Types.ObjectId,
    ref: 'Phrase',
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

// se agrega el plugin de paginacion de mongoose
PhraseSchema.plugin(mongoosePaginate);

// se obtiene la estructura del PhraseSchema
let PhraseSchemaPaths = _extend({}, PhraseSchema.paths)

if (PhraseSchemaPaths.createdAt) {
  delete PhraseSchemaPaths.createdAt
}
if (PhraseSchemaPaths.updatedAt) {
  delete PhraseSchemaPaths.updatedAt
}

// retorna un array con todas las propuedades del modelo
let PhraseSchemaKeys = Object.keys(PhraseSchemaPaths)

// se crea el modelo de la coleccion
let model = mongoose.model('Phrase', PhraseSchema)

// se exporta el mapeo del modelo
export const PhraseKeys = PhraseSchemaKeys

// se exporta el nuevo modelo
export default model

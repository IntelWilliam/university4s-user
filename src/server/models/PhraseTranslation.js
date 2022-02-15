import mongoose, { Schema } from 'mongoose'

// se crea el schema que utilizará el modelo
let PhraseTranslationSchema = new Schema({
  phrases: [{
    type: Schema.Types.ObjectId,
    ref: 'Phrase',
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

// se crea el modelo de la coleccion
let model = mongoose.model('PhraseTranslation', PhraseTranslationSchema)

// se exporta el nuevo modelo
export default model

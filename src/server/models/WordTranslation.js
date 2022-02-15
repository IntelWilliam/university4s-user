import mongoose, { Schema } from 'mongoose'

// se crea el schema que utilizará el modelo
let WordTranslationSchema = new Schema({
  words: [{
    type: Schema.Types.ObjectId,
    ref: 'Word',
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

// se crea el modelo de la coleccion
let model = mongoose.model('WordTranslation', WordTranslationSchema)

// se exporta el nuevo modelo
export default model

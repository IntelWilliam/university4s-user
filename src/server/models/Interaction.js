import mongoose, { Schema } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate'
import { _extend } from 'util'

/*
 * se crea el schema que utilizará el modelo
 * interactionType tipo de interacción, 1: comentario, 2: accion, 3:reacción
 * un comentario no tiene consecuencia
 * una accion tiene una reacción
 * author quien dice la acción o comentario el usuario o cosmo, 1: cosmo, 2: Aprendiz
 */
let InteractionSchema = new Schema({
  name: String,
  position: Number,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  imageUrl: String,
  phraseId: {
    type: Schema.Types.ObjectId,
    ref: 'Phrase',
  },
  description: String,
  castell: String,
  reactionId: {
    type: Schema.Types.ObjectId,
    ref: 'Interaction',
  },
  sectionId: {
    type: Schema.Types.ObjectId,
    ref: 'Section'
  },
  interactionType: Number,
  author: Number
})

// se agrega el plugin de paginacion de mongoose
InteractionSchema.plugin(mongoosePaginate);

// se obtiene la estructura del InteractionSchema
let InteractionSchemaPaths = _extend({}, InteractionSchema.paths)

if (InteractionSchemaPaths.createdAt) {
  delete InteractionSchemaPaths.createdAt
}
if (InteractionSchemaPaths.updatedAt) {
  delete InteractionSchemaPaths.updatedAt
}

// retorna un array con todas las propuedades del modelo
let InteractionSchemaKeys = Object.keys(InteractionSchemaPaths)

// se crea el modelo de la coleccion
let model = mongoose.model('Interaction', InteractionSchema)

// se exporta el mapeo del modelo
export const InteractionKeys = InteractionSchemaKeys

// se exporta el nuevo modelo
export default model

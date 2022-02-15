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
let SectionSchema = new Schema({
    name: String,
    position: Number,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    practiceId: {
        type: Schema.Types.ObjectId,
        ref: 'Practice'
    },
    isEnabled: { type: Boolean, default: true}
})

// se agrega el plugin de paginacion de mongoose
SectionSchema.plugin(mongoosePaginate);

// se obtiene la estructura del InteractionSchema
let SectionSchemaPaths = _extend({}, SectionSchema.paths)

if (SectionSchemaPaths.createdAt) {
    delete SectionSchemaPaths.createdAt
}
if (SectionSchemaPaths.updatedAt) {
    delete SectionSchemaPaths.updatedAt
}

// retorna un array con todas las propuedades del modelo
let SectionSchemaKeys = Object.keys(SectionSchemaPaths)

// se crea el modelo de la coleccion
let model = mongoose.model('Section', SectionSchema)

// se exporta el mapeo del modelo
export const SectionKeys = SectionSchemaKeys

// se exporta el nuevo modelo
export default model

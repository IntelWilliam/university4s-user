import mongoose, { Schema } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate'
import { _extend } from 'util'

/*
 * se crea el schema que utilizará el modelo
 */
let PracticeSchema = new Schema({
    name: String,
    description: String,
    imageUrl: String,
    position: Number,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    lessonId: {
        type: Schema.Types.ObjectId,
        ref: 'Lesson'
    },
    isEnabled: { type: Boolean, default: true},
    phraseId: {
        type: Schema.Types.ObjectId,
        ref: 'Phrase',
    },
})

// se agrega el plugin de paginacion de mongoose
PracticeSchema.plugin(mongoosePaginate);

// se obtiene la estructura del InteractionSchema
let PracticeSchemaPaths = _extend({}, PracticeSchema.paths)

if (PracticeSchemaPaths.createdAt) {
    delete PracticeSchemaPaths.createdAt
}
if (PracticeSchemaPaths.updatedAt) {
    delete PracticeSchemaPaths.updatedAt
}

// retorna un array con todas las propuedades del modelo
let PracticeSchemaKeys = Object.keys(PracticeSchemaPaths)

// se crea el modelo de la coleccion
let model = mongoose.model('Practice', PracticeSchema)

// se exporta el mapeo del modelo
export const PracticeKeys = PracticeSchemaKeys

// se exporta el nuevo modelo
export default model

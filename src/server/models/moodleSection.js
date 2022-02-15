import mongoose, { Schema } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate'
import { _extend } from 'util'

let MoodleSectionSchema = new Schema({
    name: String,
    position: Number,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    lessonId: Number,
    isEnabled: { type: Boolean, default: true}
})

// se agrega el plugin de paginacion de mongoose
MoodleSectionSchema.plugin(mongoosePaginate);

// se obtiene la estructura del InteractionSchema
let MoodleSectionSchemaPaths = _extend({}, MoodleSectionSchema.paths)

if (MoodleSectionSchemaPaths.createdAt) {
    delete MoodleSectionSchemaPaths.createdAt
}
if (MoodleSectionSchemaPaths.updatedAt) {
    delete MoodleSectionSchemaPaths.updatedAt
}

// retorna un array con todas las propuedades del modelo
let MoodleSectionSchemaKeys = Object.keys(MoodleSectionSchemaPaths)

// se crea el modelo de la coleccion
let model = mongoose.model('MoodleSection', MoodleSectionSchema)

// se exporta el mapeo del modelo
export const MoodleSectionKeys = MoodleSectionSchemaKeys

// se exporta el nuevo modelo
export default model

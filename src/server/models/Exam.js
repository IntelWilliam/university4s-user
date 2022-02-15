import mongoose, { Schema } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate'
import { _extend } from 'util'

/*
 * se crea el modelo para los examenes
 */
let ExamSchema = new Schema({
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    question: String,
    answers: [{
        answer: String,
        isRight: Boolean
    }]

})

// se agrega el plugin de paginacion de mongoose
ExamSchema.plugin(mongoosePaginate);

// se obtiene la estructura del InteractionSchema
let ExamSchemaPaths = _extend({}, ExamSchema.paths)

if (ExamSchemaPaths.createdAt) {
    delete ExamSchemaPaths.createdAt
}
if (ExamSchemaPaths.updatedAt) {
    delete ExamSchemaPaths.updatedAt
}

// retorna un array con todas las propuedades del modelo
let ExamSchemaKeys = Object.keys(ExamSchemaPaths)

// se crea el modelo de la coleccion
let model = mongoose.model('Exam', ExamSchema)

// se exporta el mapeo del modelo
export const ExamKeys = ExamSchemaKeys

// se exporta el nuevo modelo
export default model

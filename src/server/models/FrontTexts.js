import mongoose, { Schema } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate'
import { _extend } from 'util'

/*
 * se crea el schema que utilizará el modelo
 */
let FrontTextsSchema = new Schema({
  name: { type: String, unique: true, required: true },
  texts: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

// se agrega el plugin de paginacion de mongoose
FrontTextsSchema.plugin(mongoosePaginate);

// se obtiene la estructura del FrontTextsSchema
let FrontTextsSchemaPaths = _extend({}, FrontTextsSchema.paths)

if (FrontTextsSchemaPaths.createdAt) {
  delete FrontTextsSchemaPaths.createdAt
}
if (FrontTextsSchemaPaths.updatedAt) {
  delete FrontTextsSchemaPaths.updatedAt
}

// retorna un array con todas las propuedades del modelo
let FrontTextsSchemaKeys = Object.keys(FrontTextsSchemaPaths)

// se crea el modelo de la coleccion
let model = mongoose.model('FrontTexts', FrontTextsSchema)

// se exporta el mapeo del modelo
export const FrontTextsKeys = FrontTextsSchemaKeys

// se exporta el nuevo modelo
export default model

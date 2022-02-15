import mongoose, { Schema } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate'
import { _extend } from 'util'

// se crea el schema que utilizará el modelo
let LanguageSchema = new Schema({
  code: { type: String, unique: true, required: true, dropDups: true },
  name: { type: String, unique: true, required: true, dropDups: true },
  createdAt: Date,
  updatedAt: { type: Date, default: Date.now }
})

// se agrega el plugin de paginacion de mongoose
LanguageSchema.plugin(mongoosePaginate);

// se obtiene la estructura del UserSchema
let LanguageSchemaPaths = _extend({}, LanguageSchema.paths)

if (LanguageSchemaPaths.createdAt) {
  delete LanguageSchemaPaths.createdAt
}
if (LanguageSchemaPaths.updatedAt) {
  delete LanguageSchemaPaths.updatedAt
}

// retorna un array con todas las propuedades del modelo
let LanguageSchemaKeys = Object.keys(LanguageSchemaPaths)

// se crea el modelo de la coleccion
let model = mongoose.model('Language', LanguageSchema)

// se exporta el mapeo del modelo
export const LanguageKeys = LanguageSchemaKeys

// se exporta el nuevo modelo
export default model


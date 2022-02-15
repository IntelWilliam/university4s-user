import mongoose, { Schema } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate'
import { _extend } from 'util'

// se crea el schema que utilizará el modelo
let CodeSchema = new Schema({
  codeId: {
    type: String,
    required: true,
  },
  entityCode: {
    type: Schema.Types.ObjectId,
    ref: 'Entity',
  },
  entityName: {
    type: String,
  },
  stateCode: {
    type: Boolean,
    default: false,
  },
  useCode: {
    type: Date,
  },
  userEmail: String,
  userName: String,
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

// se agrega el plugin de paginacion de mongoose
CodeSchema.plugin(mongoosePaginate);

// se obtiene la estructura del CodeSchema
let CodeSchemaPaths = _extend({}, CodeSchema.paths)

if (CodeSchemaPaths.createdAt) {
  delete CodeSchemaPaths.createdAt
}
if (CodeSchemaPaths.updatedAt) {
  delete CodeSchemaPaths.updatedAt
}

// retorna un array con todas las propuedades del modelo
let CodeSchemaKeys = Object.keys(CodeSchemaPaths)

// se crea el modelo de la coleccion
let model = mongoose.model('Code', CodeSchema)

// se exporta el mapeo del modelo
export const LevelKeys = CodeSchemaKeys

// se exporta el nuevo modelo
export default model

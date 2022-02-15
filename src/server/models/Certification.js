import mongoose, { Schema } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate'
import { _extend } from 'util'

// se crea el schema que utilizará el modelo
let CertificationSchema = new Schema({
  comment: String,
  certificationId: String,
  certificationLevel: Number,

  userName: String,
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  entityName: String,
  entityId: {
    type: Schema.Types.ObjectId,
    ref: 'Entity',
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

// se agrega el plugin de paginacion de mongoose
CertificationSchema.plugin(mongoosePaginate);

// se obtiene la estructura del CertificationSchema
let CertificationSchemaPaths = _extend({}, CertificationSchema.paths)

if (CertificationSchemaPaths.createdAt) {
  delete CertificationSchemaPaths.createdAt
}
if (CertificationSchemaPaths.updatedAt) {
  delete CertificationSchemaPaths.updatedAt
}

// retorna un array con todas las propuedades del modelo
let CertificationSchemaKeys = Object.keys(CertificationSchemaPaths)

// se crea el modelo de la coleccion
let model = mongoose.model('Certification', CertificationSchema)

// se exporta el mapeo del modelo
export const CertificationKeys = CertificationSchemaKeys

// se exporta el nuevo modelo
export default model

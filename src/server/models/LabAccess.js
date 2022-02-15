import mongoose, { Schema } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate'
import { _extend } from 'util'

// se crea el schema que utilizará el modelo
let LabAccessSchema = new Schema({
  // type, 1 - video, 2 - practicas
  userName: String,
  userLastName: String,
  userEmail: String,

  category: Number,
  // category -> videos - practicas
  // 1 Completar - Clase, 2 Ordenar - Conversacion, 3 Marcar-Reforzamiento
  nivel: Number,
  sublevel: Number,
  lesson: Number,

  type: {
    type: String,
    required: true,
  },
  videoName: {
    type: String
  },
  platform: String,
  enterDate: { type: Date, default: Date.now },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

// se agrega el plugin de paginacion de mongoose
LabAccessSchema.plugin(mongoosePaginate);

// se obtiene la estructura del LabAccessSchema
let LabAccessSchemaPaths = _extend({}, LabAccessSchema.paths)

if (LabAccessSchemaPaths.updatedAt) {
  delete LabAccessSchemaPaths.updatedAt
}

// retorna un array con todas las propuedades del modelo
let LabAccessSchemaKeys = Object.keys(LabAccessSchemaPaths)

// se crea el modelo de la coleccion
let model = mongoose.model('LabAccess', LabAccessSchema)

// se exporta el mapeo del modelo
export const LabAccessKeys = LabAccessSchemaKeys

// se exporta el nuevo modelo
export default model

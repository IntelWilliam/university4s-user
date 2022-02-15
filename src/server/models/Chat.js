import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate'

let Schema = mongoose.Schema

// se crea el schema que utilizará el modelo
let ChatSchema = new Schema({

  studentId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  isUrl: Boolean,
  senderId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  message: String,
  messageType: Number, // 0 enviado por el estudiante, 1 enviado por el profesor
  createdAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// se agrega el plugin de paginacion de mongoose
ChatSchema.plugin(mongoosePaginate);

// se crea el modelo de la coleccion
let model = mongoose.model('Chat', ChatSchema)

// se exporta el nuevo modelo
export default model

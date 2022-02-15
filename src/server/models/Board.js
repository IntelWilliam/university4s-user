import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate'

let Schema = mongoose.Schema

// se crea el schema que utilizará el modelo
let BoardSchema = new Schema({
    studentId: Number,
    teacherId: Number,
    content: String,
    createdAt: { type: Date, default: Date.now }
});

// se agrega el plugin de paginacion de mongoose
BoardSchema.plugin(mongoosePaginate);

// se crea el modelo de la coleccion
let model = mongoose.model('Board', BoardSchema)

// se exporta el nuevo modelo
export default model

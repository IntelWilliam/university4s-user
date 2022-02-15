import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate'

let Schema = mongoose.Schema
// se crea el schema que utilizará el modelo
let UserNotesSchema = new Schema({
  userId: Number,
  sectionId: Number,
  subLevelId: Number,
  examId: Number,
  totalQuestionsExam: Number,
  totalQuestionsTrue: Number,
  score: Number,
  createdAt: { type: Date, default: Date.now }
});
// se agrega el plugin de paginacion de mongoose
UserNotesSchema.plugin(mongoosePaginate);
// se crea el modelo de la coleccion
let model = mongoose.model('UserNotes', UserNotesSchema)
// se exporta el nuevo modelo
export default model

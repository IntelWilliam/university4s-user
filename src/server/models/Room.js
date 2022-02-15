import mongoose from 'mongoose'
let Schema = mongoose.Schema

// se crea el schema que utilizará el modelo
let RoomSchema = new Schema({
        id: { type: String , unique: true },
        roomType: Number, // 1 teacher student, 2 admin student or admin teacher
        status: Number, // 0 chat, 1 llamada
        users: [{
            id: Number,
            socket: {
                id: String
            },
            userType: String,
            name: String,
            lastname: String
        }],
    },
    {
        timestamps: true
    });

// se crea el modelo de la coleccion
let model = mongoose.model('Room', RoomSchema)

// se exporta el nuevo modelo
export default model

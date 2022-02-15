import Chat from 'src/server/models/Chat'
import { mongoose, Types } from 'mongoose'

/*
 * Esta función permite devolver los 20 ultimos registros que coincidan con la query enviada
 */
export function getChat(query, callback) {
  // se convierte a object id
  if ("studentId" in query) {
    // id del lenguaje
    let _studentId = query.studentId
      // se comvierte a un tipo object id para ser buscado
    query.studentId = new Types.ObjectId(_studentId)
  }

  let skipMessages = 0
  let mLimit = 20

  if ("skipMessages" in query) {
    // id del lenguaje
    skipMessages = parseInt(query.skipMessages)
    mLimit += skipMessages
    delete query.skipMessages
  }

  let result = {}
  Chat.aggregate([{ $match: query }, { "$sort": { "createdAt": -1 } }, { "$limit": mLimit }, {"$skip": skipMessages} , { "$sort": { "createdAt": 1 } }])
    .exec((err, response) => {
      result.data = response
      callback(null, result)
    })
}

/*
 * Esta función crea un nuevo registro
 */
export function addChat(newChat) {
  // se crea el chat
  Chat.create(newChat)
}

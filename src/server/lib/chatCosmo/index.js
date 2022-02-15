import {
  default as ChatCosmo
} from 'src/server/models/ChatCosmo'

/*
 * Esta función crea un nuevo registro
 */
export function addChatCosmo(newChatCosmo, callback) {
  // console.log('newChatCosmo', newChatCosmo);
  ChatCosmo.create(newChatCosmo, (err, answerCapacity) => {
    if (err) return callback(err)
    callback(null, answerCapacity)
  })
}

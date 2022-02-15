import {
  default as ChatBox,
  ChatBoxKeys
} from 'src/server/models/ChatBox'
import { getParsedInt } from 'src/server/common/utilities'
import { filterQuery } from 'src/server/lib'
import _ from 'lodash'
import { Types } from 'mongoose'
import {default as User, UserKeys} from 'src/server/models/User'

/*
 * Esta función permite devolver todos los registros que coincidan con la query enviada
 */
export function getChatBox(query, callback) {
  // si se necesita buscar con una condicion excluyente
  if ("different" in query) {
    // id del estudiante
    query._id = { $ne: query.different }
    query._matchExactly = '1'
      // se elimina el queryetro different
    delete query['different']

  }

  if ("studentId" in query) {

    // id del estudiante
    let _studentId = query.studentId
      // se comvierte a un tipo object id para ser buscado
    query.studentId = new Types.ObjectId(_studentId)
    query._matchExactly = '1'
      // se elimina el queryetro different
  }



  // objeto que se usa para almacenar el criterio de ordenamiento de la lista
  let sort = {}
  let sortField = _.isUndefined(query.sortField) ? 'createdAt' : query.sortField
  let sortType = _.isUndefined(query.sortType) ? 1 : (query.sortType === "1" ? 1 : -1)
  sort[sortField] = sortType

  // variables para paginación
  let offset = getParsedInt(query.offset, null)
  let page = getParsedInt(query.page, null)
  let limit = getParsedInt(query.limit, null)

  // se filtra el query para que sólo queden los que son necesarios para un
  // criterio de búsqueda
  // console.log('ChatBoxKeys', ChatBoxKeys);
  query = filterQuery(query, ChatBoxKeys)

  // opciones para la query
  let options = {
    select: {},
    sort: sort
  }

  // si hay algun offset se indica
  if (!_.isNull(offset)) {
    options.offset = offset
  }

  // si hay algun page se indica
  if (!_.isNull(page)) {
    options.page = page
  }

  // si hay algun límite se indica
  if (!_.isNull(limit)) {
    options.limit = limit
  }

  // console.log('query', query ,'options', options);

  ChatBox.paginate(query, options, (err, result) => {
    if (err) return callback(err)
    result.data = result.docs
    delete result.docs
    callback(null, result)
  })

}

/*
 * Esta función crea un nuevo registro
 */
export function addChatBox(newChatBox, callback) {
  // console.log('newChatBox', newChatBox);
  ChatBox.create(newChatBox, (err, chatBox) => {
    if (err) {
      console.log('err addChat =' , err);
      return callback(err)
}
    if(newChatBox.lastMesageFrom == 0){

      let newData = {
        lastMesage: newChatBox.lastMesage,
        unReadMesage : true,
        lastMesageDate: new Date()
      }

      console.log('newData', newData);

      User.findByIdAndUpdate(newChatBox.studentId, {
          $set: newData
      }, {
          safe: true,
          upsert: true,
          new: true
      }, (err, user) => {
          if (err)
              return callback(err)
              // se eliminan propiedades que no queremos que se vean en el servidor
          // callback(null, 'success')
          console.log('addChatBox-user = ', user);
          callback(null, chatBox)

      })
    }else{
      callback(null, chatBox)
    }
  })
}

/*
 * Esta función actualiza un registro
 */
export function updateChatBox(id, newDataChat, callback) {
  ChatBox.findByIdAndUpdate(id, { $set: newDataChat }, { safe: true, upsert: true, new: true }, (err, chatBox) => {
    if (err) return callback(err)


    if(newDataChat.lastMesageFrom == 0){

      let newData = {
        lastMesage: newDataChat.lastMesage,
        unReadMesage : true,
        lastMesageDate: new Date()
      }

      User.findByIdAndUpdate(newDataChat.studentId, {
          $set: newData
      }, {
          safe: true,
          upsert: true,
          new: true
      }, (err, user) => {
          if (err)
              return callback(err)
              // se eliminan propiedades que no queremos que se vean en el servidor
          // callback(null, 'success')
          console.log('addChatBox-user = ', user);
          callback(null, chatBox)

      })
    }else{
      callback(null, chatBox)
    }


  })
}

/*
 * Esta función elimina un nuevo registro
 */
export function removeChatBox(id, callback) {
  ChatBox.remove({ _id: id }, (err, info) => {
    if (err) return callback(err)
    callback(null, info)
  })
}

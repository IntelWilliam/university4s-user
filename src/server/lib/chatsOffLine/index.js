/**
 * Dependencies
 */
import {default as UserChat, UserChatKeys} from 'src/server/models/UserChat'
import {filterQuery} from 'src/server/lib'

// import { mongoose, Types } from 'mongoose'
import _ from 'lodash'
import {getParsedInt} from 'src/server/common/utilities'

/*
 * Esta función permite devolver todos los registros que coincidan con la query enviada
 */
export function getChatsOffLine(query, callback) {

  // objeto que se usa para almacenar el criterio de ordenamiento de la lista
  let sort = {}
  let sortField = _.isUndefined(query.sortField)
    ? 'createdAt'
    : query.sortField
  let sortType = _.isUndefined(query.sortType)
    ? 1
    : (query.sortType === "1"
      ? 1
      : -1)
  sort[sortField] = sortType

  // variables para paginación
  let offset = getParsedInt(query.offset, null)
  let page = getParsedInt(query.page, null)
  let limit = getParsedInt(query.limit, null)

  if(query.excludeStatus){
    query.status = { $ne: 1}
    query._matchExactly = '1'
  }

  query = filterQuery(query, UserChatKeys)

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

  UserChat.paginate(query, options, (err, result) => {
    if (err){
      console.log('err', err);
      return callback(err)
    }
    result.data = result.docs
    delete result.docs
    callback(null, result)
  })

}

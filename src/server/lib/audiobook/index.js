import {  default as AudioBook,  AudioBookKeys } from 'src/server/models/AudioBook'
import { mongoose, Types } from 'mongoose'
import { filterQuery } from 'src/server/lib'
import _ from 'lodash'
import { getParsedInt } from 'src/server/common/utilities'
import { Promise } from 'bluebird'

/*
 * Esta función permite devolver todos los registros que coincidan con la query enviada
 */
export function getAudioBook(query, callback) {
  // si se necesita buscar con una condicion excluyente
  if ("lenguageId" in query && "different" in query) {
    // id del lenguaje
    let _lenguageId = query.lenguageId
      // se comvierte a un tipo object id para ser buscado
    query.lenguageId = new Types.ObjectId(_lenguageId)
      // se agrega la variable que sea diferente al id
    query._id = { $ne: query.different }
      // se elimina el queryetro different
    delete query['different']
      // se buscan las palabras y se hace un join (populate)
    AudioBook.find(query).populate({ path: 'lenguageId', select: 'name _id' }).exec(function(err, audiosbooks) {
      if (err) return callback(err)
      callback(null, audiosbooks)
    })

  }
  // si se necesita buscar con una condicion excluyente
  else if ("many" in query) {
    // id del lenguaje
    let _lenguageId = query.lenguageId
      // se comvierte a un tipo object id para ser buscado
    query.lenguageId = new Types.ObjectId(_lenguageId)
      // se agrega la variable que sea diferente al id
    query.audiobook = { $in: JSON.parse(query.audiobook) }
      // se elimina el queryetro different
    delete query['many']
      // se buscan las palabras y se hace un join (populate)
    AudioBook.find(query, { audiobook: 1 }).exec(function(err, audiosbooks) {
      if (err) return callback(err)
      callback(null, audiosbooks)
    })

  }
  // si len la busqueda se incluye el object id
  else if ("lenguageId" in query) {
    // id del lenguaje
    let _lenguageId = query.lenguageId
      // se comvierte a un tipo object id para ser buscado
    query.lenguageId = new Types.ObjectId(_lenguageId)
      // se buscan las palabras y se hace un join (populate)
    AudioBook.find(query).populate({ path: 'lenguageId', select: 'name _id' }).exec(function(err, audiosbooks) {
      if (err) return callback(err)
      callback(null, audiosbooks)
    })
  } else {

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
    query = filterQuery(query, AudioBookKeys)

    // opciones para la query
    let options = {
      select: {},
      sort: sort,
      populate: [{ path: 'lenguageId', select: 'name _id' }]
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

    AudioBook.paginate(query, options, (err, result) => {
      if (err) return callback(err)
      result.data = result.docs
      delete result.docs
      callback(null, result)
    })
  }

}

export function addAudioBook(newAudioBook, callback) {
  AudioBook.create(newAudioBook, (err, audiobook) => {
    if (err) return callback(err)
    callback(null, audiobook)
  })
}

/*
 * Esta función actualiza un registro
 */
export function updateAudioBook(id, newData, callback) {
  AudioBook.findByIdAndUpdate(id, { $set: newData }, { safe: true, upsert: true, new: true }, (err, audiobook) => {
    if (err) return callback(err)
    callback(null, audiobook)
  })
}

/*
 * Esta función elimina un nuevo registro
 */
export function removeAudioBook(id, callback) {
  AudioBook.remove({ _id: id }, (err, info) => {
    if (err) return callback(err)
    callback(null, info)
  })
}

import {
  default as NewsLetter,
  NewsLetterKeys
} from 'src/server/models/NewsLetter'
import { getParsedInt } from 'src/server/common/utilities'
import { filterQuery } from 'src/server/lib'
import _ from 'lodash'

/*
 * Esta función permite devolver todos los registros que coincidan con la query enviada
 */
export function getNewsLetter(query, callback) {
  // si se necesita buscar con una condicion excluyente
  if ("different" in query) {
    // id del lenguaje
    query._id = { $ne: query.different }
    query._matchExactly = '1'
      // se elimina el queryetro different
    delete query['different']

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
  query = filterQuery(query, NewsLetterKeys)

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

  NewsLetter.paginate(query, options, (err, result) => {
    if (err) return callback(err)
    result.data = result.docs
    delete result.docs
    callback(null, result)
  })

}

/*
 * Esta función crea un nuevo registro
 */
export function addNewsLetter(newNewsLetter, callback) {
  NewsLetter.create(newNewsLetter, (err, newsletter) => {
    if (err) return callback(err)
    callback(null, newsletter)
  })
}

/*
 * Esta función actualiza un registro
 */
export function updateNewsLetter(id, newData, callback) {
  NewsLetter.findByIdAndUpdate(id, { $set: newData }, { safe: true, upsert: true, new: true }, (err, newsletter) => {
    if (err) return callback(err)
    callback(null, newsletter)
  })
}

/*
 * Esta función elimina un nuevo registro
 */
export function removeNewsLetter(id, callback) {
  NewsLetter.remove({ _id: id }, (err, info) => {
    if (err) return callback(err)
    callback(null, info)
  })
}

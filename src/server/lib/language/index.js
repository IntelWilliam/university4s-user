import {
  default as Language,
  LanguageKeys
} from 'src/server/models/Language'
import { getParsedInt } from 'src/server/common/utilities'
import mongoose from 'mongoose'
import User from 'src/server/models/User'
import { filterQuery } from 'src/server/lib'
import _ from 'lodash'

/*
 * Esta función permite devolver todos los registros que coincidan con la query enviada
 */
export function getLanguage(query, callback) {

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
  query = filterQuery(query, LanguageKeys)

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

  Language.paginate(query, options, (err, result) => {
    if (err) return callback(err)
    result.data = result.docs
    delete result.docs
    callback(null, result)
  })

}

/*
 * Esta función crea un nuevo registro
 */
export function addLanguage(newLanguage, callback) {
  Language.create(newLanguage, (err, language) => {
    if (err) return callback(err)
    callback(null, language)
  })
}

/*
 * Esta función actualiza un registro
 */
export function updateLanguage(id, newData, callback) {
  Language.findByIdAndUpdate(id, { $set: newData }, { safe: true, upsert: true, new: true }, (err, language) => {
    if (err) return callback(err)
    callback(null, language)
  })
}

/*
 * Esta función elimina un nuevo registro
 */
export function removeLanguage(id, callback) {
  var idref = mongoose.Types.ObjectId(id)
  User.find({ learningLanguages: idref }, (err, docs) => {
    if (err) { console.log(err) } else {
      docs.forEach((item) => {
        item.learningLanguages.splice(id, 1)
        item.save()
      })
    }
  })
  Language.remove({ _id: id }, (err, info) => {
    if (err) return callback(err)
    callback(null, info)
  })
}

import SubLevel from 'src/server/models/SubLevel'
import {
  default as Level,
  LevelKeys
} from 'src/server/models/Level'
import { getParsedInt } from 'src/server/common/utilities'
import { mongoose, Types } from 'mongoose'
import { filterQuery } from 'src/server/lib'
import _ from 'lodash'

/*
 * Esta función permite devolver todos los registros que coincidan con la query enviada
 */
export function getLevel(query, callback) {
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
  query = filterQuery(query, LevelKeys)

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

  Level.paginate(query, options, (err, result) => {
    if (err) return callback(err)
    result.data = result.docs
    delete result.docs
    callback(null, result)
  })

}

/*
 * Esta función crea un nuevo registro
 */
export function addLevel(newLevel, callback) {
  Level.create(newLevel, (err, level) => {
    if (err) return callback(err)
    callback(null, level)
  })
}

/*
 * Esta función actualiza un registro
 */
export function updateLevel(id, newData, callback) {
  Level.findByIdAndUpdate(id, { $set: newData }, { safe: true, upsert: true, new: true }, (err, level) => {
    if (err) return callback(err)
    callback(null, level)
  })
}

/*
 * Esta función elimina un nuevo registro
 */
export function removeLevel(id, callback) {
  var idref = mongoose.Types.ObjectId(id)
  SubLevel.update({ levelId: idref }, { $set: { levelId: null } }, { multi: true }, (err, doc) => {
    if (err) { console.log(err) }
  })
  Level.remove({ _id: id }, (err, info) => {
    if (err) return callback(err)
    callback(null, info)
  })
}

/*
 * Esta función permite devolver el primer nivel
 */
export function getFirstLevel(callback) {

  Level.findOne({isEnabled: true}).sort({"position": 1}).exec((err, level) => {
    if(err) return callback(err)
     callback(null, level)
  });

}

export function getNextLevelFromArray(levelId, callback){
  let idref = new Types.ObjectId(levelId)
  Level.find({isEnabled: true}).sort({"position": 1})
  .exec((err, level) => {
    if(err) return callback(err)
    if(level.length == 0) return callback(true)
    for (let index in level){
      if(level[index]._id == levelId){
        let nextIndex = parseInt(index) + 1
        if(typeof level[nextIndex] !== undefined) {
          return callback(null, level[nextIndex])
        } else {
          return callback(true)
        }
      }
    }
  });
}

/*
 * Esta función una practica de una leccion dada su posicion
 */

export function getNextLevel(levelId, callback) {
  let idref = new Types.ObjectId(levelId)
  Level.findOne({"_id": {$gt: idref} ,isEnabled: true }).sort({"position": 1})
      .exec((err, level) => {
        if(err) return callback(err)
        callback(null, level)
      });

}

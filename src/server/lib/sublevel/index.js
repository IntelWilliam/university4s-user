import {
  default as SubLevel,
  SubLevelKeys
} from 'src/server/models/SubLevel'
import { getParsedInt } from 'src/server/common/utilities'
import { mongoose, Types } from 'mongoose'
import { filterQuery } from 'src/server/lib'
import _ from 'lodash'

/*
 * Esta función permite devolver todos los registros que coincidan con la query enviada
 */
export function getSubLevel(query, callback) {

  // si se necesita buscar con una condicion excluyente
  if ("different" in query) {
    // id del lenguaje
    query._id = { $ne: query.different }
    query._matchExactly = '1'
      // se elimina el queryetro different
    delete query['different']

  }

  // se convierte a object id
  if ("levelId" in query) {
    // id del lenguaje
    let _levelId = query.levelId
      // se comvierte a un tipo object id para ser buscado
    query.levelId = new Types.ObjectId(_levelId)
    query._matchExactly = '1'

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
  query = filterQuery(query, SubLevelKeys)

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
  SubLevel.paginate(query, options, (err, result) => {
    if (err) return callback(err)
    result.data = result.docs
    delete result.docs
    callback(null, result)
  })

}

/*
 * Esta función crea un nuevo registro
 */
export function addSubLevel(newSubLevel, callback) {
  SubLevel.create(newSubLevel, (err, sublevel) => {
    if (err) return callback(err)
    callback(null, sublevel)
  })
}

/*
 * Esta función actualiza un registro
 */
export function updateSubLevel(id, newData, callback) {
  SubLevel.findByIdAndUpdate(id, { $set: newData }, { safe: true, upsert: true, new: true }, (err, sublevel) => {
    if (err) return callback(err)
    callback(null, sublevel)
  })
}

/*
 * Esta función elimina un nuevo registro
 */
export function removeSubLevel(id, callback) {
  var idref = mongoose.Types.ObjectId(id)
  SubLevel.update({ subLevelId: idref }, { $set: { subLevelId: null } }, { multi: true }, (err, doc) => {
    if (err) { console.log(err) }
  })
  SubLevel.remove({ _id: id }, (err, info) => {
    if (err) return callback(err)
    callback(null, info)
  })
}

/*
 * Esta función permite devolver el primer subnivel de un nivel
 */
export function getFirstSubLevel(levelId, callback) {
  let idref = new Types.ObjectId(levelId)
  SubLevel.findOne({"levelId":idref, isEnabled: true}).sort({"position": 1}).exec((err, subLevel) => {
    if(err) return callback(err)
    callback(null, subLevel)
  });

}

export function getNextSubLevelFromArray(levelId, currentSubLevelId, callback) {
  let idref = new Types.ObjectId(levelId)
  let subLevelRef = new Types.ObjectId(currentSubLevelId)
  Sublevel.find({"levelId":idref ,isEnabled: true }).sort({"position": 1})
  .exec((err, subLevel) => {
    if(err) return callback(err)
    if(subLevel.length == 0) return callback(true)
    for (let index in subLevel){
      console.log('subLevel[index]._id', subLevel[index]._id);
      console.log('currentSubLevelId', currentSubLevelId);
      if(subLevel[index]._id == currentSubLevelId){
        let nextIndex = parseInt(index) + 1
        if(typeof subLevel[nextIndex] !== undefined) {
          return callback(null, subLevel[nextIndex])
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
export function getNextSubLevel(levelId, currentSubLevelId, callback) {
  let idref = new Types.ObjectId(levelId)
  let subLevelRef = new Types.ObjectId(currentSubLevelId)
  SubLevel.findOne({"levelId":idref, "_id": {$gt: subLevelRef} ,isEnabled: true }).sort({"position": 1})
      .exec((err, subLevel) => {
        if(err) return callback(err)
        callback(null, subLevel)
      });

}

import {
  default as Section,
  SectionKeys
} from 'src/server/models/Section'
import { getParsedInt } from 'src/server/common/utilities'
import { mongoose, Types } from 'mongoose'
import { filterQuery } from 'src/server/lib'
import _ from 'lodash'

/*
 * Esta función permite devolver todos los registros que coincidan con la query enviada
 */
export function getSection(query, callback) {

  if ("practiceId" in query) {
    // id del lenguaje
    let _practiceId = query.practiceId
    // se comvierte a un tipo object id para ser buscado
    query.practiceId = new Types.ObjectId(_practiceId)
    query._matchExactly = '1'

  }

  // objeto que se usa para almacenar el criterio de ordenamiento de la lista
  let sort = {}
  let sortField = _.isUndefined(query.sortField) ? 'position' : query.sortField
  let sortType = _.isUndefined(query.sortType) ? 1 : (query.sortType === "1" ? 1 : -1)
  sort[sortField] = sortType

  // variables para paginación
  let offset = getParsedInt(query.offset, null)
  let page = getParsedInt(query.page, null)
  let limit = getParsedInt(query.limit, null)

  // se filtra el query para que sólo queden los que son necesarios para un
  // criterio de búsqueda
  query = filterQuery(query, SectionKeys)

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

  Section.paginate(query, options, (err, result) => {
    if (err) return callback(err)
    result.data = result.docs
    delete result.docs
    callback(null, result)
  })

}

/*
 * Esta función permite devolver el primer subnivel de un nivel
 */
export function getFirstSection(practiceId, callback) {
  let idref = new Types.ObjectId(practiceId)
  Section.findOne({"practiceId":idref, isEnabled: true}).sort({"position": 1}).exec((err, section) => {
    if(err) return callback(err)
    callback(null, section)
  });
}

/*
 * Esta función permite devolver el primer subnivel de un nivel
 */
export function getSectionByPosition(practiceId, position, callback) {
  let idref = new Types.ObjectId(practiceId)
  Section.findOne({"practiceId":idref, isEnabled: true, position: position}).exec((err, section) => {
    if(err) return callback(err)
    callback(null, section)
  });

}

/*
 * Esta función permite devolver el primer subnivel de un nivel
 */
export function getSectionById(sectionId, callback) {
  let idref = new Types.ObjectId(sectionId)
  Section.findById(idref).exec((err, section) => {
    if(err) return callback(err)
    callback(null, section)
  });

}

import {
  default as Interaction,
  InteractionKeys
} from 'src/server/models/Interaction'
import { getParsedInt } from 'src/server/common/utilities'
import Exercise from 'src/server/models/Exercise'
import { mongoose, Types } from 'mongoose'
import { filterQuery } from 'src/server/lib'
import _ from 'lodash'

/*
 * Esta función permite devolver todos los registros que coincidan con la query enviada
 */
export function getInteraction(query, callback) {
  // si se necesita buscar con una condicion excluyente
  if ("different" in query) {
    // id del lenguaje
    query._id = { $ne: query.different }
    query._matchExactly = '1'
      // se elimina el queryetro different
    delete query['different']

  }

  // si se necesita buscar con una condicion excluyente
  if ("differentType" in query) {
    // id del lenguaje
    query.interactionType = { $ne: query.differentType }
    query._matchExactly = '1'
      // se elimina el queryetro different
    delete query['differentType']

  }

  // se convierte a object id
  if ("sectionId" in query) {
    // id del lenguaje
    let _sectionId = query.sectionId
      // se comvierte a un tipo object id para ser buscado
    query.sectionId = new Types.ObjectId(_sectionId)
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
  query = filterQuery(query, InteractionKeys)

  // opciones para la query
  let options = {
    select: {},
    sort: sort,
    populate: 'reactionId'
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

  Interaction.paginate(query, options, (err, result) => {
    if (err) return callback(err)
    result.data = result.docs
    delete result.docs
    callback(null, result)
  })
}

/*
 * Esta función crea un nuevo registro
 */
export function addInteraction(newInteraction, callback) {
  Interaction.create(newInteraction, (err, interaction) => {
    if (err) return callback(err)
    callback(null, interaction)
  })
}

/*
 * Esta función actualiza un registro
 */
export function updateInteraction(id, newData, callback) {
  Interaction.findByIdAndUpdate(id, { $set: newData }, { safe: true, upsert: true, new: true }, (err, interaction) => {
    if (err) return callback(err)
    callback(null, interaction)
  })
}

/*
 * Esta función elimina un nuevo registro
 */
export function removeInteraction(id, callback) {
  var idref = Types.ObjectId(id)
  Exercise.remove({ interactionId: idref }, (err, doc) => {
    if (err) { console.log(err) }
  })

  Interaction.findOne({ _id: idref }, (err, interaction) => {
    if (err) {return callback(err)}

      if(interaction) {
          if(interaction.interactionType == 2) {
              let idRefReaction = Types.ObjectId(interaction.reactionId)
              Interaction.remove({ $or :[{_id : idref},{_id: idRefReaction}] }, (err, info) => {
                  if (err) { console.log(err) }
                  callback(null, info);
              })
          } else {
              Interaction.remove({_id : idref}, (err, info) => {
                  if (err) { console.log(err) }
                  callback(null, info);
              })
          }
      }
  })
}


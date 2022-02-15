import {
  default as Exercise,
  ExerciseKeys
} from 'src/server/models/Exercise'
import { getParsedInt } from 'src/server/common/utilities'
import { mongoose, Types } from 'mongoose'
import { filterQuery } from 'src/server/lib'
import _ from 'lodash'

/*
 * Esta función permite devolver todos los registros que coincidan con la query enviada
 */
export function getExercise(query, callback) {
  // se convierte a object id
  if ("interactionId" in query) {
    // id del lenguaje
    let _interactionId = query.interactionId
      // se comvierte a un tipo object id para ser buscado
    query.interactionId = new Types.ObjectId(_interactionId)
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
  query = filterQuery(query, ExerciseKeys)

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
  if (!limit) {
    options.limit = limit
  }

  Exercise.paginate(query, options, (err, result) => {
    if (err) return callback(err)
    result.data = result.docs
    delete result.docs
    callback(null, result)
  })
}

/*
 * Esta función crea un nuevo registro
 */
export function addExercise(newExercise, callback) {

  // si len la busqueda se incluye el object id
  if ("exerciseToSave" in newExercise) {
    // arreglo a guardar
    let newExerciseMod = JSON.parse(newExercise.exerciseToSave)
      // se combierte a un tipo object id para ser buscado
    newExercise = newExerciseMod
  }

  Exercise.create(newExercise, (err, exercise) => {
    if (err) return callback(err)
    callback(null, exercise)
  })
}

/*
 * Esta función actualiza un registro
 */
export function updateExercise(id, newData, callback) {
  // si len la busqueda se incluye el object id
  if ("phrasesAndPictures" in newData) {
    // arreglo a guardar
    let phrasesAndPicturesMod = JSON.parse(newData.phrasesAndPictures)
      // se combierte a un tipo object id para ser buscado
    newData.phrasesAndPictures = phrasesAndPicturesMod
  }
  if ("fakeTranslations" in newData) {
    // arreglo a guardar
    let fakeTranslationsMod = JSON.parse(newData.fakeTranslations)
    // se combierte a un tipo object id para ser buscado
    newData.fakeTranslations = fakeTranslationsMod
  }

  if ("missingWords" in newData) {
    // arreglo a guardar
    let missingWordsMod = JSON.parse(newData.missingWords)
    // se combierte a un tipo object id para ser buscado
    newData.missingWords = missingWordsMod
  }
  Exercise.findByIdAndUpdate(id, { $set: newData }, { safe: true, upsert: true, new: true }, (err, exercise) => {
    if (err) return callback(err)
    callback(null, exercise)
  })
}

/*
 * Esta función elimina un nuevo registro
 */
export function removeExercise(id, callback) {
  var idref = mongoose.Types.ObjectId(id)
  Exercise.remove({ _id: id }, (err, info) => {
    if (err) return callback(err)
    callback(null, info)
  })
}

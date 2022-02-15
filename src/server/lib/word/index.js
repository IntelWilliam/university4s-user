import {
  default as Word,
  WordKeys
} from 'src/server/models/Word'
import { mongoose, Types } from 'mongoose'
import WordTranslation from 'src/server/models/WordTranslation'
import { filterQuery } from 'src/server/lib'
import _ from 'lodash'
import { getParsedInt } from 'src/server/common/utilities'
import { Promise } from 'bluebird'

/*
 * Esta función permite devolver todos los registros que coincidan con la query enviada
 */
export function getWord(query, callback) {
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
    Word.find(query).populate({ path: 'lenguageId', select: 'name _id' }).exec(function(err, words) {
      if (err) return callback(err)
      callback(null, words)
    })

  }
  // si se necesita buscar con una condicion excluyente
  else if ("many" in query) {
    // id del lenguaje
    let _lenguageId = query.lenguageId
      // se comvierte a un tipo object id para ser buscado
    query.lenguageId = new Types.ObjectId(_lenguageId)
      // se agrega la variable que sea diferente al id
    query.word = { $in: JSON.parse(query.word) }
      // se elimina el queryetro different
    delete query['many']
      // se buscan las palabras y se hace un join (populate)
    Word.find(query, { word: 1 }).exec(function(err, words) {
      if (err) return callback(err)
      callback(null, words)
    })

  }
  // si len la busqueda se incluye el object id
  else if ("lenguageId" in query) {
    // id del lenguaje
    let _lenguageId = query.lenguageId
      // se comvierte a un tipo object id para ser buscado
    query.lenguageId = new Types.ObjectId(_lenguageId)
      // se buscan las palabras y se hace un join (populate)
    Word.find(query).populate({ path: 'lenguageId', select: 'name _id' }).exec(function(err, words) {
      if (err) return callback(err)
      callback(null, words)
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
    query = filterQuery(query, WordKeys)

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

    Word.paginate(query, options, (err, result) => {
      if (err) return callback(err)
      result.data = result.docs
      delete result.docs
      callback(null, result)
    })
  }

}

/*
 * Esta función crea un nuevo registro
 */
export function addWord(newWord, callback) {
  // si len la busqueda se incluye el object id
  if ("tosave" in newWord) {
    // arreglo a guardar
    let newWordMod = JSON.parse(newWord.tosave)
      // se combierte a un tipo object id para ser buscado
    newWord = newWordMod
    Promise.map(newWord, (element) => {
      return Promise.resolve(findOrRegisterWord(element))
    }).then((allItems) => {
      return callback(null, allItems)
    })
  } else {
    return Promise.resolve(findOrRegisterWord(newWord))
      .then((res) => {
        return callback(null, res)
      })
  }

}

/*
 * Esta función actualiza un registro
 */
export function updateWord(id, newData, callback) {
  Word.findByIdAndUpdate(id, { $set: newData }, { safe: true, upsert: true, new: true }, (err, word) => {
    if (err) return callback(err)
    callback(null, word)
  })
}

/*
 * Esta función elimina un nuevo registro
 */
export function removeWord(id, callback) {
  var idref = Types.ObjectId(id)
  WordTranslation.remove({ words: idref }, (err, info) => {
    if (err) return callback(err)
  })
  Translation.find({ words: idref }, (err, docs) => {
    if (err) { console.log(err) } else {
      docs.forEach((item) => {
        item.words.splice(id, 1)
        item.save()
      })
    }
  })
  Word.remove({ _id: id }, (err, info) => {
    if (err) return callback(err)
    callback(null, info)
  })
}

/*
 * Esta función crea un nuevo indice en la relación de traduccion
 */
export function addRelationWord(newWordTranslation, callback) {
  // si len los parametros se incluye newWordTranslation
  if ("newWordTranslation" in newWordTranslation) {
    // arreglo a guardar
    let newWordTranslationMod = JSON.parse(newWordTranslation.newWordTranslation)
      // se combierte a un tipo object id para ser buscado
    newWordTranslation = newWordTranslationMod
  } else {
    // se convierte el json a un arreglo
    newWordTranslation.words = JSON.parse(newWordTranslation.words)
  }
  // se agrega la nueva palabra
  WordTranslation.create(newWordTranslation, (err, wordTranslation) => {
    if (err) return callback(err)
    callback(null, wordTranslation)
  })
}

/*
 * Esta función elimina un indice especifico en la relación de traduccion
 */
export function removeRelationWord(id, callback) {
  WordTranslation.remove({ _id: id }, (err, info) => {
    if (err) return callback(err)
    callback(null, info)
  })
}

/*
 * Esta función retorna las palabras que traducen una palabra
 */
export function getRelationWord(id, param, callback) {
  var idref = Types.ObjectId(id)
    // se buscan las palabras y se hace un join (populate)
  WordTranslation.aggregate([{ $match: { words: idref } }, { $unwind: '$words' }, { $match: { words: { $ne: idref } } }]).exec(function(err, wordTranslations) {
    WordTranslation.populate(wordTranslations, { path: 'words', select: 'word _id lenguageId' }, function(err, populatedTransactions) {
      // Your populated translactions are inside populatedTransactions
      if (err) return callback(err)
      callback(null, populatedTransactions)
    })

  })

}

/*
 * Crea o devuelve una palabra
 */
export function findOrRegisterWord(word) {
  return Word.findOneAndUpdate({
    word: word.word,
    lenguageId: new Types.ObjectId(word.lenguageId)
  }, word, {
    upsert: true,
    new: true,
  })
}

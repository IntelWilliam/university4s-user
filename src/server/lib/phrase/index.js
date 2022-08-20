import { default as Phrase, PhraseKeys } from 'src/server/models/Phrase';
import { mongoose, Types } from 'mongoose';
import PhraseTranslation from 'src/server/models/PhraseTranslation';
import { filterQuery } from 'src/server/lib';
import _ from 'lodash';
import { getParsedInt } from 'src/server/common/utilities';
import { Promise } from 'bluebird';

/*
 * Esta función permite devolver todos los registros que coincidan con la query enviada
 */
export function getPhrase(query, callback) {
  // si se necesita buscar con una condicion excluyente
  if ('lenguageId' in query && 'different' in query) {
    // id del lenguaje
    let _lenguageId = query.lenguageId;
    // se comvierte a un tipo object id para ser buscado
    query.lenguageId = new Types.ObjectId(_lenguageId);
    // se agrega la variable que sea diferente al id
    query._id = { $ne: query.different };
    // se elimina el queryetro different
    delete query['different'];
    // se buscan las frases y se hace un join (populate)
    Phrase.find(query)
      .populate({ path: 'lenguageId', select: 'name _id' })
      .exec(function (err, phrases) {
        if (err) return callback(err);
        callback(null, phrases);
      });
  }
  // si len la busqueda se incluye el object id
  else if ('lenguageId' in query) {
    // id del lenguaje
    let _lenguageId = query.lenguageId;
    // se comvierte a un tipo object id para ser buscado
    query.lenguageId = new Types.ObjectId(_lenguageId);
    // se buscan las frases y se hace un join (populate)
    Phrase.find(query)
      .populate({ path: 'lenguageId', select: 'name _id' })
      .exec(function (err, phrases) {
        if (err) return callback(err);
        callback(null, phrases);
      });
  } else {
    // objeto que se usa para almacenar el criterio de ordenamiento de la lista
    let sort = {};
    let sortField = _.isUndefined(query.sortField)
      ? 'createdAt'
      : query.sortField;
    let sortType = _.isUndefined(query.sortType)
      ? 1
      : query.sortType === '1'
      ? 1
      : -1;
    sort[sortField] = sortType;

    // variables para paginación
    let offset = getParsedInt(query.offset, null);
    let page = getParsedInt(query.page, null);
    let limit = getParsedInt(query.limit, null);

    // se filtra el query para que sólo queden los que son necesarios para un
    // criterio de búsqueda
    query = filterQuery(query, PhraseKeys);

    // opciones para la query
    let options = {
      select: {},
      sort: sort,
      populate: [{ path: 'lenguageId', select: 'name _id' }],
    };

    // si hay algun offset se indica
    if (!_.isNull(offset)) {
      options.offset = offset;
    }

    // si hay algun page se indica
    if (!_.isNull(page)) {
      options.page = page;
    }

    // si hay algun límite se indica
    if (!_.isNull(limit)) {
      options.limit = limit;
    }

    Phrase.paginate(query, options, (err, result) => {
      if (err) return callback(err);
      result.data = result.docs;
      delete result.docs;
      callback(null, result);
    });
  }
}

/*
 * Esta función crea un nuevo registro
 */
export function addPhrase(newPhrase, callback) {
  // si len la busqueda se incluye el object id
  if ('tosave' in newPhrase) {
    // arreglo a guardar
    let newPhraseMod = JSON.parse(newPhrase.tosave);
    newPhrase = newPhraseMod;

    Promise.map(newPhrase, (element) => {
      return Promise.resolve(findOrRegisterPhrase(element));
    }).then((allItems) => {
      return callback(null, allItems);
    });
  } else {
    newPhrase.words = JSON.parse(newPhrase.words);
    Promise.resolve(findOrRegisterPhrase(newPhrase)).then((res) => {
      return callback(null, res);
    });
  }
}

/*
 * Esta función actualiza un registro
 */
export function updatePhrase(id, newData, callback) {
  // se convierte el json a un arreglo
  newData.words = JSON.parse(newData.words);

  Phrase.findByIdAndUpdate(
    id,
    { $set: newData },
    { safe: true, upsert: true, new: true },
    (err, phrase) => {
      if (err) return callback(err);
      callback(null, phrase);
    }
  );
}

/*
 * Esta función elimina un nuevo registro
 */
export function removePhrase(id, callback) {
  Phrase.remove({ _id: id }, (err, info) => {
    if (err) return callback(err);
    callback(null, info);
  });
}

/*
 * Esta función crea un nuevo indice en la relación de traduccion
 */
export function addRelationPhrase(newPhraseTranslation, callback) {
  // si len los parametros se incluye newPhraseTranslation
  if ('newPhraseTranslation' in newPhraseTranslation) {
    // arreglo a guardar
    let newPhraseTranslationMod = JSON.parse(
      newPhraseTranslation.newPhraseTranslation
    );
    // se combierte a un tipo object id para ser buscado
    newPhraseTranslation = newPhraseTranslationMod;
  } else {
    // se convierte el json a un arreglo
    newPhraseTranslation.phrases = JSON.parse(newPhraseTranslation.phrases);
  }
  // se agrega la nueva palabra
  PhraseTranslation.create(newPhraseTranslation, (err, phraseTranslation) => {
    if (err) return callback(err);
    callback(null, phraseTranslation);
  });
}

/*
 * Esta función elimina un indice especifico en la relación de traduccion
 */
export function removeRelationPhrase(id, callback) {
  PhraseTranslation.remove({ _id: id }, (err, info) => {
    if (err) return callback(err);
    callback(null, info);
  });
}

/*
 * Esta función retorna las frases que traducen una palabra
 */
export function getRelationPhrase(id, param, callback) {
  var idref = Types.ObjectId(id);
  // se buscan las frases y se hace un join (populate)
  PhraseTranslation.aggregate([
    { $match: { phrases: idref } },
    { $unwind: '$phrases' },
    { $match: { phrases: { $ne: idref } } },
  ]).exec(function (err, phraseTranslations) {
    PhraseTranslation.populate(
      phraseTranslations,
      { path: 'phrases', select: 'phrase _id lenguageId' },
      function (err, populatedTransactions) {
        // Your populated translactions are inside populatedTransactions
        if (err) return callback(err);
        callback(null, populatedTransactions);
      }
    );
  });
}

/*
 * Crea o devuelve una palabra
 */
export function findOrRegisterPhrase(phrase) {
  return Phrase.findOneAndUpdate(
    {
      phrase: phrase.phrase,
      lenguageId: new Types.ObjectId(phrase.lenguageId),
    },
    phrase,
    {
      upsert: true,
      new: true,
    }
  );
}

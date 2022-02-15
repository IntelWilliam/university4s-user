import {default as Entry, EntryKeys} from 'src/server/models/moodleEntry'
import {getParsedInt} from 'src/server/common/utilities'
import {mongoose, Types} from 'mongoose'
import {filterQuery} from 'src/server/lib'
import _ from 'lodash'

/*
 * Esta función permite devolver todos los registros que coincidan con la query enviada
 */
export function getEntry(query, callback) {
    // si se necesita buscar con una condicion excluyente
    if ("different" in query) {
        // id del lenguaje
        query._id = {
            $ne: query.different
        }
        query._matchExactly = '1'
        // se elimina el queryetro different
        delete query['different']

    }

    // se convierte a object id
    if ("sectionId" in query) {
        // id del lenguaje
        let _sectionId = query.sectionId
        // se comvierte a un tipo object id para ser buscado
        query.sectionId = (_sectionId)
        query._matchExactly = '1'

    }
    // objeto que se usa para almacenar el criterio de ordenamiento de la lista
    let sort = {}
    let sortField = _.isUndefined(query.sortField)
        ? 'createdAt'
        : query.sortField
    let sortType = _.isUndefined(query.sortType)
        ? 1
        : (query.sortType === "1"
            ? 1
            : -1)
    sort[sortField] = sortType

    // variables para paginación
    let offset = getParsedInt(query.offset, null)
    let page = getParsedInt(query.page, null)
    let limit = getParsedInt(query.limit, null)

    // se filtra el query para que sólo queden los que son necesarios para un
    // criterio de búsqueda
    query = filterQuery(query, EntryKeys)

    // opciones para la query
    let options = {
        select: {},
        sort: sort,
        populate: [{ path: 'examId', select: 'question answers _id' }]
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

    Entry.paginate(query, options, (err, result) => {
        if (err)
            return callback(err)
        result.data = result.docs
        delete result.docs
        callback(null, result)
    })

}

/*
 * Esta función crea un nuevo registro
 */
export function addEntry(newEntry, callback) {
    if ("examId" in newEntry) {
        // id del lenguaje
            newEntry.examId = new Types.ObjectId(newEntry.examId)
    }
    Entry.create(newEntry, (err, entry) => {
        if (err) {
            console.log('error', err)
            return callback(err)
        }
        callback(null, entry)
    })
}

/*
 * Esta función actualiza un registro
 */
export function updateEntry(id, newData, callback) {
    Entry.findByIdAndUpdate(id, {
        $set: newData
    }, {
        safe: true,
        upsert: true,
        new: true
    }, (err, level) => {
        if (err)
            return callback(err)
        callback(null, level)
    })
}

/*
 * Esta función elimina un nuevo registro
 */
export function removeEntry(id, callback) {
    var idref = id
    Entry.update({
        entryId: idref
    }, {
        $set: {
            entryId: null
        }
    }, {
        multi: true
    }, (err, doc) => {
        if (err) {
            console.log(err)
        }
    })
    Entry.remove({
        _id: id
    }, (err, info) => {
        if (err)
            return callback(err)
        callback(null, info)
    })
}

/*
 * Esta función permite devolver el primer subnivel de un nivel
 */
export function getFirstEntry(sectionId, callback) {
    let idref = new Types.ObjectId(sectionId)
    Entry.findOne({"sectionId": idref, isEnabled: true}).sort({"position": 1}).exec((err, entry) => {
        if (err)
            return callback(err)
        callback(null, entry)
    });

}

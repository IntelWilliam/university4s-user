import { default as UserDate, UserDateKeys } from 'src/server/models/UserDate'
import { mongoose, Types } from 'mongoose'
import { filterQuery } from 'src/server/lib'
import _ from 'lodash'
import { getParsedInt } from 'src/server/common/utilities'

/*
 * Esta función permite devolver todos los registros que coincidan con la query enviada
 */
export function getUserDate(query, callback) {
    // si se necesita buscar con una condicion excluyente

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
    query = filterQuery(query, UserDateKeys)

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

    UserDate.paginate(query, options, (err, result) => {
        if (err) return callback(err)
        result.data = result.docs
        delete result.docs
        callback(null, result)
    })
}

export function addUserDate(newUserDate, callback) {
    UserDate.create(newUserDate, (err, UserDate) => {
        if (err) return callback(err)
        callback(null, UserDate)
    })
}

/*
 * Esta función actualiza un registro
 */
export function updateUserDate(query, newData, callback) {

    UserDate.update({ _id: new Types.ObjectId(query) },
        newData,
        {
            // safe: true,
            // upsert: true,
            // new: true
        }, (err, UserDate) => {
            if (err) return callback(err)
            callback(null, UserDate)
        })
}

/*
 * Esta función elimina un nuevo registro
 */
export function removeUserDate(id, callback) {
    UserDate.remove({ _id: id }, (err, info) => {
        if (err) return callback(err)
        callback(null, info)
    })
}

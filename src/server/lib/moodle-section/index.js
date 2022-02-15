import {
    default as MoodleSection,
    MoodleSectionKeys
} from 'src/server/models/moodleSection'
import {
    getParsedInt
} from 'src/server/common/utilities'
import {
    mongoose,
    Types
} from 'mongoose'
import {
    filterQuery
} from 'src/server/lib'
import _ from 'lodash'

import Promise from 'bluebird'

export function crateSection(section) {
    return MoodleSection.create(section)
}

/*
 * Esta función permite devolver todos los registros que coincidan con la query enviada
 */
export function getMoodleSection(query, callback) {

    if ("lessonId" in query) {
        // id del lenguaje
        var _lessonId = query.lessonId
            // se comvierte a un tipo object id para ser buscado
        query.lessonId = _lessonId
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
    query = filterQuery(query, MoodleSectionKeys)

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

    MoodleSection.paginate(query, options, (err, result) => {

        if (err) return callback(err)


        var AuxData = [];


        if (result.docs.length == 0) {

            let moodleSections = [{
                name: "Vocabulary",
                position: 1,
                lessonId: _lessonId
            }, {
                name: "Grammar",
                position: 2,
                lessonId: _lessonId
            }, {
                name: "Exercises",
                position: 3,
                lessonId: _lessonId
            }, {
                name: "Reading",
                position: 4,
                lessonId: _lessonId

            }, {
                name: "Writing",
                position: 5,
                lessonId: _lessonId

            }, {
                name: "Listening",
                position: 6,
                lessonId: _lessonId

            }, {
                name: "Speaking",
                position: 7,
                lessonId: _lessonId

            }, {
                name: "Reinforcement",
                position: 8,
                lessonId: _lessonId

            }, {
                name: "Evaluación",
                position: 9,
                lessonId: _lessonId

            }]

            Promise.map(moodleSections, (section) => {
                return Promise.resolve(crateSection(section))
            }).then((allItems) => {
              result.data = allItems
              delete result.docs
                return callback(null, result)
            })

        } else {

            result.data = result.docs
            delete result.docs
            callback(null, result)
        }
    })

}

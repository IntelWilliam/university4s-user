import SubLevel from 'src/server/models/SubLevel'
import {default as Practice, PracticeKeys} from 'src/server/models/Practice'
import {getParsedInt} from 'src/server/common/utilities'
import Section from 'src/server/models/Section'
import {mongoose, Types} from 'mongoose'
import {filterQuery} from 'src/server/lib'
import _ from 'lodash'

/*
 * Esta función permite devolver todos los registros que coincidan con la query enviada
 */
export function getPractice(query, callback) {
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
    if ("lessonId" in query) {
        // id del lenguaje
        let _lessonId = query.lessonId
        // se comvierte a un tipo object id para ser buscado
        query.lessonId = new Types.ObjectId(_lessonId)
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
    query = filterQuery(query, PracticeKeys)

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

    Practice.paginate(query, options, (err, result) => {
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
export function addPractice(newPractice, callback) {
    Practice.create(newPractice, (err, practice) => {
        if (err) {
            console.log('error', err)
            return callback(err)
        }
        // Se añaden las secciones a la practica
        let sections = [
            {
                name: "Vocabulary",
                position: 1,
                practiceId: practice._id
            }, {
                name: "Grammar",
                position: 2,
                practiceId: practice._id
            }, {
                name: "Pronunciation",
                position: 3,
                practiceId: practice._id
            }, {
                name: "Conversation",
                position: 4,
                practiceId: practice._id
            }
        ]

        sections.forEach((section) => {
            Section.create(section, (err) => {
                if (err)
                    return callback(err)
            })
        })
        callback(null, practice)
    })
}

/*
 * Esta función actualiza un registro
 */
export function updatePractice(id, newData, callback) {
    Practice.findByIdAndUpdate(id, {
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
export function removePractice(id, callback) {
    var idref = mongoose.Types.ObjectId(id)
    Practice.update({
        practiceId: idref
    }, {
        $set: {
            practiceId: null
        }
    }, {
        multi: true
    }, (err, doc) => {
        if (err) {
            console.log(err)
        }
    })
    Practice.remove({
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
export function getFirstPractice(lessonId, callback) {
    let idref = new Types.ObjectId(lessonId)
    Practice.findOne({"lessonId": idref, isEnabled: true}).sort({"position": 1}).exec((err, practice) => {
        if (err)
            return callback(err)
        callback(null, practice)
    });

}

export function getNextPracticeFromArray(lessonId, currentPracticeId, callback) {
  let idref = new Types.ObjectId(lessonId)
  let practiceRef = new Types.ObjectId(currentPracticeId)
  Practice.find({"lessonId":idref, isEnabled: true }).sort({"position": 1})
  .exec((err, practice) => {
    if(err) return callback(err)
    if(practice.length == 0) return callback(true)
    for(let index in practice){
      if(practice[index]._id == currentPracticeId){
        let nextIndex = parseInt(index) + 1
        if(typeof practice[nextIndex] !== undefined) {
          return callback(null,practice[nextIndex])
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
export function getNextPractice(lessonId, currentPracticeId, callback) {
  console.log('lessonId', lessonId);
  console.log('currentPracticeId', currentPracticeId);

    let idref = new Types.ObjectId(lessonId)
    let practiceRef = new Types.ObjectId(currentPracticeId)

    Practice.findById(practiceRef).exec((err, curPractice) => {
        if (err || !curPractice) return callback(err)
        Practice.findOne({"lessonId":idref, "position": {$gt: curPractice.position} ,isEnabled: true }).sort({"position": 1})
            .exec((err, practice) => {
            if(err) return callback(err)
            callback(null, practice)
        });
    });
}

/*
 * Esta función permite devolver una practica dado su id
 */
export function getPracticeById(practiceId, callback) {
    let idref = new Types.ObjectId(practiceId)
    Practice.findById(idref).exec((err, practice) => {
        if (err) return callback(err)
        callback(null, practice)
    });
}

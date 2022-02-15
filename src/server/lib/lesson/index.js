import {
  default as Lesson,
  LessonKeys
} from 'src/server/models/Lesson'
import { getParsedInt } from 'src/server/common/utilities'
import { mongoose, Types } from 'mongoose'
import { filterQuery } from 'src/server/lib'
import _ from 'lodash'
import Interaction from 'src/server/models/Interaction'
import {getMoodleLessons} from 'src/server/lib/event'

/*
 * Esta función permite devolver todos los registros que coincidan con la query enviada
 */
export function getLesson(query, callback) {
  // si se necesita buscar con una condicion excluyente
  if ("different" in query) {
    // id del lenguaje
    query._id = { $ne: query.different }
    query._matchExactly = '1'
      // se elimina el queryetro different
    delete query['different']

  }

  // se convierte a object id
  if ("subLevelId" in query) {
    // id del lenguaje
    let _subLevelId = query.subLevelId
      // se comvierte a un tipo object id para ser buscado
    query.subLevelId = new Types.ObjectId(_subLevelId)
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
  query = filterQuery(query, LessonKeys)

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

  Lesson.paginate(query, options, (err, result) => {
    if (err) return callback(err)
    result.data = result.docs
    delete result.docs
    callback(null, result)
  })

}

/*
 * Esta función crea un nuevo registro
 */
export function addLesson(newLesson, callback) {
  Lesson.create(newLesson, (err, lesson) => {
    if (err) return callback(err)
    callback(null, lesson)
  })
}

/*
 * Esta función actualiza un registro
 */
export function updateLesson(id, newData, callback) {
  Lesson.findByIdAndUpdate(id, { $set: newData }, { safe: true, upsert: true, new: true }, (err, lesson) => {
    if (err) return callback(err)
    callback(null, lesson)
  })
}

/*
 * Esta función elimina un registro
 */
export function removeLesson(id, callback) {
  var idref = mongoose.Types.ObjectId(id)
  Interaction.update({ lessonId: idref }, { $set: { lessonId: null } }, { new: true }, (err, doc) => {
    if (err) { console.log(err) }
  })
  Lesson.remove({ _id: id }, (err, info) => {
    if (err) return callback(err)
    callback(null, info)
  })
}

/*
 * Esta función permite devolver la primera leccion de un subnivel
 */
export function getFirstLesson(sublevelId, callback) {

  let idref = new Types.ObjectId(sublevelId)
  Lesson.findOne({"subLevelId":idref, isEnabled: true}).sort({"position": 1}).exec((err, lesson) => {
    if(err) return callback(err)
    callback(null, lesson)
  });
}

export function getNextLessonFromArray(subLevelId, currentLessonId, callback){
  let idref = new Types.ObjectId(subLevelId)
  let lessonRef = new Types.ObjectId(currentLessonId)
  Lesson.find({"subLevelId":idref, isEnabled: true}).sort({"position": 1})
  .exec((err, practices) => {
    if(err) return callback(err)
    if(practices.length == 0) return callback(true)
    for (let index in practices){
      if(practices[index]._id == currentLessonId){
        let nextIndex = parseInt(index) + 1
        if(typeof practices[nextIndex] !== undefined) {
          return callback(null, practices[nextIndex])
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

 // Lesson.findOne({"subLevelId":idref, "_id": {$gt: lessonRef} ,isEnabled: true }).sort({"position": 1})

export function getNextLesson(subLevelId, currentLessonId, callback) {
  let idref = new Types.ObjectId(subLevelId)
  let lessonRef = new Types.ObjectId(currentLessonId)

  Lesson.findById(lessonRef).exec((err, curLesson) => {
      if (err || !curLesson) return callback(err)

  Lesson.findOne({"subLevelId":idref, "position": {$gt: curLesson.position} ,isEnabled: true }).sort({"position": 1})
      .exec((err, practice) => {
        if(err) return callback(err)
        callback(null, practice)
      });
  });
}

// {
//   levelName: Fundamental,
//   subLevelName: Fundamental % 202,
//   subLevelId: 6,
//   lessonName: I % 20 had % 20 to % 20 write % 20 this % 20 poem.,
//   lessonId: 55,
//   lessonType: 2,
//   lessonIndex: 7
// }

function jsonToURL(obj){
  var str = Object.keys(obj).map(function(key){
    return encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]);
  }).join('&');

  return str;
}

export function getAllLinks(callback){

  const baseUrl = 'https://akronenglish1.com/user-area/practices/lessons/exercise/?'
  var params = {}

  var links=[]
  var objLinks = {}

  getMoodleLessons((err, resp)=>{
    if(err) return callback(err)

    if (!resp.hasOwnProperty("Lessons")) {
      return callback("No hay lecciones")
    }

    var lessons = resp.Lessons

    lessons.forEach((element)=>{

      let levelName =  element.Nivel == 1 ? 'Inicial' :
      element.Nivel == 2 ?  'Fundamental':
      element.Nivel == 3 ? 'Operacional': ''

      links.push(baseUrl + jsonToURL(params))

      if (!objLinks.hasOwnProperty(element.subLevelName)) {
        objLinks[element.subLevelName] = {}
      }

      if(!objLinks[element.subLevelName].hasOwnProperty( 'lesson ' +  element.lessonIndex)){
        objLinks[element.subLevelName][ 'lesson ' +  element.lessonIndex] = []
      }

      for (var i = 1; i <= 3; i++) {

        params ={
          levelName: levelName,
          subLevelName: element.subLevelName,
          subLevelId: element.subNivel,
          lessonName: element.lessonName,
          lessonId: element.lessonId,
          lessonType: i,
          lessonIndex: element.lessonIndex
        }

        objLinks[element.subLevelName][ 'lesson ' +  element.lessonIndex].push(baseUrl + jsonToURL(params))
      }

    })

    return callback(null, objLinks)

  })

}

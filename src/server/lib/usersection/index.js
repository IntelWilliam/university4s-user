import {
    default as UserSection,
    UserSectionKeys
} from 'src/server/models/UserSection'
import { mongoose, Types } from 'mongoose'
import { filterQuery } from 'src/server/lib'
import { getParsedInt } from 'src/server/common/utilities'
import { getSectionById, getSectionByPosition } from 'src/server/lib/section'
import { Promise } from 'bluebird'

/*
 * Esta función permite devolver todos los registros que coincidan con la query enviada
 */
export function getUserSections(practiceId, userId, callback) {
  UserSection.findOne({
    practiceId: practiceId,
    userId: userId
  }, (err, sections) => {
    if(err) return callback(err)
    callback(null, sections)
  })
}

/*
 * Esta función crea un nuevo registro
 */
export function addUserSection(practiceId, userId, sectionId, callback) {
  var practiceRef =  new Types.ObjectId(practiceId)
  var userRef =  new Types.ObjectId(userId)
  var sectionRef =  new Types.ObjectId(sectionId)
  UserSection.findOneAndUpdate({"practiceId": practiceRef, "userId": userRef}, { $addToSet: { unlockedSections: sectionRef } }, { safe: true, upsert: true, new: true }, (err, info) => {
    if (err) return callback(err)
    callback(null, info)
  })
}
/**
 * metodo encargado de verificar que la seccion que se finalizó si es la ultima sección que hizo el usuario
 * para posteriormente poder desbloquear la siguiente
 * @param practiceId, el id de la practica a la que pertenece la sección
 * @param userId, el id del usuario que desbloqueó la lección
 * @param sectionId, la sección que se finalizó
 * @param callback, retrollamada para enviar la información de la query
 */
export function checkIfSectionIsUnlockedAndIsLast(practiceId, userId, sectionId, callback) {
  var practiceRef =  new Types.ObjectId(practiceId)
  var userRef =  new Types.ObjectId(userId)
  // se busca la info y se organiza el arreglo de secciones desbloqueadas por la ultima insertada
  UserSection.findOne({"practiceId": practiceRef, "userId": userRef})
      .select({ "unlockedSections": { "$slice": -1 }}).exec((err, sectionInfo) => {
    if (err) return callback(err)
    if(sectionInfo) {
      let lastUnlockedSection = sectionInfo.unlockedSections[0]
      // si la ultima sección insertada corresponde con la enviada se envia true para que se 
      // pueda desbloquear la siguiente
      if(lastUnlockedSection == sectionId) {
        // se procede a desbloquear la siguiente lección
        unlockNextSection(practiceId, sectionId, userId, callback)
      } else {
        // la lección enviada como parametro no es la ultima insertada
        // el usuario puede no haberla desbloqueado aún o ya haberla desbloqueado
        // pero no se desbloquea una siguiente
        callback({error: 404, message: "section not unlocked or already passed"})
      }
    } else {
      return callback({error: 404, message:"No sections found with this practice"})
    }
  })
}

export function unlockNextSection(practiceId, currentSectionId, userId, callback) {
  getSectionById(currentSectionId, (err, section) => {
    if (err) return callback(err)
    // se encontró la lección actual, se coge la posición para saber la posicion de la siguiente  desbloquear
    if(section) {
      // se busca la sección que le sigue
      getSectionByPosition(practiceId, section.position + 1, (err, sectionToUnlock) => {
        if(sectionToUnlock) {
          // si se encuentra la sección se desbloquea
          addUserSection(practiceId, userId, sectionToUnlock._id, callback)
          // si no se encuentra es por que ya pasa a la siguiente practica, se llamó al servicio equivocado
        } else {
          return callback({error: 404, message:"No sections to unlock"})
        }
      })

    } else {
      return callback({error: 404, message:"No sections found"})
    }
  })
}

/*
 * Esta función actualiza un registro
 */
export function updateUserSections(id, newData, callback) {

}

/*
 * Esta función elimina un nuevo registro
 */
export function removeUserSection(id, callback) {

}

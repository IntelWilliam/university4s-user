import {
    default as UserPractice,
    UserPracticeKeys
} from 'src/server/models/UserPractice'
import { mongoose, Types } from 'mongoose'
import { filterQuery } from 'src/server/lib'
import { getPracticeById, getNextPracticeFromArray } from 'src/server/lib/practice'
import { addUserSection } from 'src/server/lib/usersection'
import { getFirstSection } from 'src/server/lib/section'
import { getParsedInt } from 'src/server/common/utilities'
import { Promise } from 'bluebird'

/*
 * Esta función permite devolver todos los registros que coincidan con la query enviada
 */
export function getUserPractices(lessonId, userId, callback) {
    UserPractice.findOne({
        lessonId: lessonId,
        userId: userId
    }, (err, practices) => {
        if(err) return callback(err)
        callback(null, practices)
    })
}

/*
 * Esta función crea un nuevo registro
 */
export function addUserPractice(lesson, user, practice, callback) {
    var lessonRef =  new Types.ObjectId(lesson)
    var userRef =  new Types.ObjectId(user)
    var idref =  new Types.ObjectId(practice)
    UserPractice.findOneAndUpdate({lessonId: lessonRef, userId: userRef}, { $addToSet: { unlockedPractices: idref } }, { upsert: true, new: true }, (err, info) => {
        if (err) return callback(err)
        callback(null, info)
    })
}

/**
 * metodo encargado de verificar que la practica que se finalizó si es la ultima practica que hizo el usuario
 * para posteriormente poder desbloquear la siguiente
 * @param lessonId, el id de la leccion a la que pertenece la practica
 * @param userId, el id del usuario que desbloqueó la lección
 * @param practiceId, la practica que se finalizó
 * @param callback, retrollamada para enviar la información de la query
 */
export function checkIfPracticeIsUnlockedAndIsLast(lessonId, userId, practiceId, callback) {
    var lessonRef =  new Types.ObjectId(lessonId)
    var userRef =  new Types.ObjectId(userId)
    // se busca la info y se organiza el arreglo de practicas desbloqueadas por la ultima insertada
    UserPractice.findOne({"lessonId": lessonRef, "userId": userRef})
        .select({ "unlockedPractices": { "$slice": -1 }}).exec((err, practiceInfo) => {
        if (err) return callback(err)
        if(practiceInfo) {
            let lastUnlockedPractice = practiceInfo.unlockedPractices[0]
            // si la ultima practica insertada corresponde con la enviada se envia true para que se
            // pueda desbloquear la siguiente
            if(lastUnlockedPractice == practiceId) {
                // se procede a desbloquear la siguiente lección
                unlockNextPractice(lessonId, practiceId, userId, callback)
            } else {
                // la practica enviada como parametro no es la ultima insertada
                // el usuario puede no haberla desbloqueado aún o ya haberla desbloqueado
                // pero no se desbloquea una siguiente
                callback({error: 404, message: "practice not unlocked or already passed"})
            }
        } else {
            return callback({error: 404, message:"No practices found with this lesson"})
        }
    })
}

export function unlockNextPractice(lessonId, currentPracticeId, userId, callback) {
    console.log("entra");
        // se encontró la practica actual, se coge la posición para saber la posicion de la siguiente  desbloquear
            // se busca la practica que le sigue
            getNextPracticeFromArray(lessonId, currentPracticeId, (err, practiceToUnlock) => {
              console.log("practiceToUnlock", practiceToUnlock)
                if(practiceToUnlock) {
                    // se busca la primera seccion de esta practica para desbloquearla
                    getFirstSection(practiceToUnlock._id, (sectionError, section) => {
                                addUserSection(practiceToUnlock._id, userId, section._id,
                                    (userSectionError, userSections) => {
                                    if(userSectionError) return callback(userSectionError);
                                        // finalmente se desbloquea la practica
                                        addUserPractice(lessonId, userId, practiceToUnlock._id, callback)
                                })

                    })
                    // si no se encuentra es por que ya pasa a la siguiente practica, se llamó al servicio equivocado
                } else {
                    return callback({error: 404, message:"No practices to unlock"})
                }
            })
}

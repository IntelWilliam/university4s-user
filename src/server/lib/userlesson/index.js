import {
    default as UserLesson,
    UserLessonKeys
} from 'src/server/models/UserLesson'
import { mongoose, Types } from 'mongoose'
import { filterQuery } from 'src/server/lib'
import { getNextLesson, getNextLessonFromArray } from 'src/server/lib/lesson'
import { addUserSection } from 'src/server/lib/usersection'
import { addUserPractice } from 'src/server/lib/userpractice'
import { getFirstSection } from 'src/server/lib/section'
import { getFirstPractice } from 'src/server/lib/practice'
import { getParsedInt } from 'src/server/common/utilities'

/*
 * Esta función devuelve las lecciones de un usuario
 */
export function getUserLessons(subLevelId, userId, callback) {
    var subLevelRef =  new Types.ObjectId(subLevelId)
    var userRef =  new Types.ObjectId(userId)
    UserLesson.findOne({
        "subLevelId": subLevelRef,
        "userId": userRef
    }).exec((err, lessons) => {
        if(err) return callback(err)
        callback(null, lessons)
    });
}

/*
 * Esta función crea un nuevo registro
 */
export function addUserLesson(userId, subLevelId, lessonId, callback) {
    var subLevelRef =  new Types.ObjectId(subLevelId)
    var userRef =  new Types.ObjectId(userId)
    var idref =  new Types.ObjectId(lessonId)
    UserLesson.findOneAndUpdate({"subLevelId": subLevelRef, "userId": userRef}, { $addToSet: { unlockedLessons: idref } }, { safe: true, upsert: true, new: true }, (err, info) => {
        if (err) return callback(err)
        callback(null, info)
    })
}

/**
 * metodo encargado de verificar que la practica que se finalizó si es la ultima leccion que hizo el usuario
 * para posteriormente poder desbloquear la siguiente
 * @param lessonId, el id de la leccion que se finalizo
 * @param userId, el id del usuario que desbloqueó la lección
 * @param subLevelId, el subnivel de la leccion que se finalizó
 * @param callback, retrollamada para enviar la información de la query
 */
export function checkIfLessonIsUnlockedAndIsLast(lessonId, userId, subLevelId, callback) {
    var subLevelRef =  new Types.ObjectId(subLevelId)
    var userRef =  new Types.ObjectId(userId)
    // se busca la info y se organiza el arreglo de lecciones desbloqueadas por la ultima insertada
    UserLesson.findOne({"subLevelId": subLevelRef, "userId": userRef})
        .select({ "unlockedLessons": { "$slice": -1 }}).exec((err, lessonInfo) => {
        if (err) return callback(err)
        if(lessonInfo) {
            let lastUnlockedLesson = lessonInfo.unlockedLessons[0]
            console.log('lastUnlockedLesson', lastUnlockedLesson);
            console.log('lessonId', lessonId);
            // si la ultima leccion insertada corresponde con la enviada se envia true para que se
            // pueda desbloquear la siguiente;
            // if(lastUnlockedLesson == lessonId) {
                // se procede a desbloquear la siguiente lección
                unlockNextLesson(lessonId, subLevelId, userId, callback)
            // } else {
            //     // la practica enviada como parametro no es la ultima insertada
            //     // el usuario puede no haberla desbloqueado aún o ya haberla desbloqueado
            //     // pero no se desbloquea una siguiente
            //     callback({error: 404, message: "lesson not unlocked or already passed"})
            // }
        } else {
            return callback({error: 404, message:"No lessons found with this sublevel"})
        }
    })
}

export function unlockNextLesson(lessonId, subLevelId, userId, callback) {
            // se busca la lección que le sigue
            getNextLessonFromArray(subLevelId, lessonId, (err, lessonToUnlock) => {
                console.log("lessonToUnlock", lessonToUnlock)
                if(lessonToUnlock) {
                    // se busca la primera practica de esta lección para desbloquearla
                    getFirstPractice(lessonToUnlock._id, (practiceError, practice) => {
                        // se busca la primera seccion de esta practica para desbloquearla
                        getFirstSection(practice._id, (sectionError, section) => {
                            // se añade la sección
                            addUserSection(practice._id, userId, section._id,
                                (userSectionError, userSections) => {
                                    if(userSectionError) return callback(userSectionError);
                                    // se añade la practica
                                    addUserPractice(lessonToUnlock._id, userId, practice._id,
                                        (userPracticeError, userPractices) => {
                                            if(userPracticeError) return callback(userPracticeError)
                                            addUserLesson(userId, subLevelId, lessonToUnlock._id, callback)
                                        })
                                })

                        })
                    })
                    // si no se encuentra es por que ya pasa a la siguiente practica, se llamó al servicio equivocado
                } else {
                    return callback({error: 404, message:"No practices to unlock"})
                }
            })

}

import { default as SubLevel } from 'src/server/models/SubLevel'
import { default as Lesson } from 'src/server/models/Lesson'
import { default as Practice } from 'src/server/models/Practice'
import { default as Section } from 'src/server/models/Section'
import { default as UserLesson } from 'src/server/models/UserLesson'
import { default as UserPractice } from 'src/server/models/UserPractice'
import { default as UserSection } from 'src/server/models/UserSection'
import { Types } from 'mongoose'

/*
 * Esta función encuentra todas las lessons de un sublevel dado
 */
export function unlockAllSubLevel(subLevel, userId, callback) {
  let idSubLevel = new Types.ObjectId(subLevel)
  Lesson.find({ subLevelId: idSubLevel, isEnabled: true }, { _id: 1 }, (err, lessonsTemp) => {

    if (err) return callback(err)

    let lessons = []
    for (let lesson in lessonsTemp) {
      let lessonTemp = lessonsTemp[lesson]._id
      lessons.push(lessonTemp)
    }
    deleteUserLessons(idSubLevel, userId, lessons, callback);
  });
}

/*
 * Esta función elimina el userLesson de un usuario y un idSubLevel especifico
 */
export function deleteUserLessons(idSubLevel, userId, lessons, callback) {
  UserLesson.remove({ userId: userId, subLevelId: idSubLevel }, (err, response) => {

    if (err) return callback(err)

    addUserLessons(idSubLevel, userId, lessons, callback);
  });
}

/*
 * Esta función agrega en userLesson todas las lesson de un subnivel dado
 */
export function addUserLessons(idSubLevel, userId, lessons, callback) {
  let lessonUser = {
    subLevelId: idSubLevel,
    userId: userId,
    unlockedLessons: lessons
  }
  UserLesson.create(lessonUser, (err, response) => {
    if (err) return callback(err)

    unlockAllPractices(idSubLevel, userId, lessons, callback)
  });

}

/*
 * Esta función encuentra todas las practicas de todos las lesson de un subnivel dato
 */
export function unlockAllPractices(idSubLevel, userId, lessons, callback) {
  Practice.find({ lessonId: { $in: lessons }, isEnabled: true }, { _id: 1, lessonId: 1 }, (err, practices) => {

    if (err) return callback(err)

    let arrayLessionsPractices = {};
    let arrayPractices = [];

    for (let practice of practices) {
      if (!arrayLessionsPractices[practice.lessonId])
        arrayLessionsPractices[practice.lessonId] = [];

      arrayLessionsPractices[practice.lessonId].push(practice._id);
      arrayPractices.push(practice._id);
    }
    deleteUserPractices(idSubLevel, userId, lessons, arrayPractices, arrayLessionsPractices, callback);
  });
}

/*
 * Esta función elimina el userPractice de un usuario y un lesson especifico
 */
export function deleteUserPractices(idSubLevel, userId, lessons, arrayPractices, arrayLessionsPractices, callback) {
  UserPractice.remove({ userId: userId, lessonId: { $in: lessons } }, (err, response) => {

    if (err) return callback(err)

    addUserPractices(idSubLevel, userId, arrayPractices, arrayLessionsPractices, callback);
  });
}

/*
 * Esta función agrega todas las userPractice de todas las  lesson de un subnivel
 */
export function addUserPractices(idSubLevel, userId, arrayPractices, arrayLessionsPractices, callback) {

  let arrObjPractices = [];
  for (let lessionPractices in arrayLessionsPractices) {
    let practiceUser = {
      lessonId: lessionPractices,
      userId: userId,
      unlockedPractices: arrayLessionsPractices[lessionPractices]
    }
    arrObjPractices.push(practiceUser);
  }

  UserPractice.create(arrObjPractices, (err, response) => {
    if (err) return callback(err)

    unlockAllSections(idSubLevel, userId, arrayPractices, callback);
  });

}

/*
 * Esta función encuentra todas las sections de todas las practices de todos las lesson de un subnivel dato
 */
export function unlockAllSections(idSubLevel, userId, practices, callback) {
  Section.find({ practiceId: { $in: practices }, isEnabled: true }, { _id: 1, practiceId: 1 }, (err, sections) => {

    if (err) return callback(err)

    let arrayPracticesSections = {};

    for (let section of sections) {
      if (!arrayPracticesSections[section.practiceId]) {
        arrayPracticesSections[section.practiceId] = []
      }
      arrayPracticesSections[section.practiceId].push(section._id);
    }
    deleteUserSections(idSubLevel, userId, practices, arrayPracticesSections, callback);
  });
}

/*
 * Esta función elimina el userSection de un usuario y una practica especifica
 */
export function deleteUserSections(idSubLevel, userId, practices, arrayPracticesSections, callback) {
  UserSection.remove({ userId: userId, practiceId: { $in: practices } }, (err, response) => {

    if (err) return callback(err)

    addUserSections(idSubLevel, userId, arrayPracticesSections, callback);
  });
}

/*
 * Esta función agrega todos los userSection de todas las practicas de todas las lesson de un sublevel especifico
 */
export function addUserSections(idSubLevel, userId, arrayPracticesSections, callback) {

  let arrObjSections = [];
  for (let practiceSections in arrayPracticesSections) {
    let sectionUser = {
      practiceId: practiceSections,
      userId: userId,
      unlockedSections: arrayPracticesSections[practiceSections]
    }
    arrObjSections.push(sectionUser);
  }
  UserSection.create(arrObjSections, (err, response) => {
    if (err) return callback(err)
    unlockNextSubLevel(idSubLevel, userId, callback);
  });
}

/*
 * Esta función encuentra el siguiente sublevel para desbloquear
 */
export function unlockNextSubLevel(idSubLevel, userId, callback) {
  SubLevel.findOne({ _id: { $gt: idSubLevel }, isEnabled: true }, { _id: 1 }, (err, subLevelNext) => {
    if (err) return callback(err)

    if (subLevelNext) //Se pregunta si existe un siguiente sublevel
      unlockFirstLesson(subLevelNext['_id'], userId, callback);
    else
      response(callback);
  })
}

/*
 * Esta función encuentra la primer lesson y crea un registro en userLesson
 */
export function unlockFirstLesson(idSubLevel, userId, callback) {
  Lesson.findOne({ subLevelId: idSubLevel, isEnabled: true }, { _id: 1 }).sort({ position: 1 }).exec((err, lesson) => {
    if (err) return callback(err)

    UserLesson.findOneAndUpdate({ subLevelId: idSubLevel, userId: userId }, { $addToSet: { unlockedLessons: lesson["_id"] } }, { upsert: true }, (err, info) => {
      if (err) return callback(err)

      unlockFirstPractice(lesson["_id"], userId, callback);
    })
  });
}

/*
 * Esta función encuentra la primer Practica de una Lesson y crea un registro en userPractice
 */
export function unlockFirstPractice(lessonId, userId, callback) {
  Practice.findOne({ lessonId: lessonId, isEnabled: true }, { _id: 1 }).sort({ position: 1 }).exec((err, practice) => {
    if (err) return callback(err)

    UserPractice.findOneAndUpdate({ lessonId: lessonId, userId: userId }, { $addToSet: { unlockedPractices: practice["_id"] } }, { upsert: true }, (err, info) => {
      if (err) return callback(err)

      unlockFirstSection(practice["_id"], userId, callback);
    })
  });
}

/*
 * Esta función encuentra la primer Section de una practica y crea un registro en userSection
 */
export function unlockFirstSection(practiceId, userId, callback) {
  Section.findOne({ practiceId: practiceId, isEnabled: true }, { _id: 1 }).sort({ position: 1 }).exec((err, section) => {
    if (err) return callback(err)

    UserSection.findOneAndUpdate({ practiceId: practiceId, userId: userId }, { $addToSet: { unlockedSections: section["_id"] } }, { upsert: true }, (err, info) => {
      if (err) return callback(err)

      response(callback);
    })
  });
}

/*
 * Esta función retorna la respuesta satisfactoria
 */
export function response(callback) {
  return callback(null, { ok: "Sublevel Unlocked" })
}

import {  default as MoodleLessonEdit,  MoodleLessonEditKeys} from 'src/server/models/moodleLessonEdit'
import { getParsedInt } from 'src/server/common/utilities'
import { mongoose, Types } from 'mongoose'
import { filterQuery } from 'src/server/lib'
import _ from 'lodash'

/*
 * Esta función permite devolver todos los registros que coincidan con la query enviada
 */
export function getMoodleLessonEdit(body, callback) {

  let query = {'moodleLesonId': parseInt(body._id)};

  MoodleLessonEdit.findOne(query, (err, moodleLessons) => {
    if (err) return callback(err)
    return callback(null, moodleLessons)
  })

}

/*
 * Esta función actualiza un registro
 */
export function updateMoodleLessonEdit(id, newData, callback) {

  let query = {'moodleLesonId':id};
  MoodleLessonEdit.findOneAndUpdate(query, { $set: newData }, { safe: true, upsert: true, new: true }, (err, moodleLessonsEdit) => {
    if (err) return callback(err)
    callback(null, moodleLessonsEdit)
  })

}

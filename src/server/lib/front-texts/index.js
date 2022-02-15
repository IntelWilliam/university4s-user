import {  default as FrontTexts} from 'src/server/models/FrontTexts'

/*
 * Esta función permite devolver todos los registros que coincidan con la query enviada
 */
export function getFrontTexts(body, callback) {
  let query = {'name': body};
  FrontTexts.findOne(query, (err, moodleLessons) => {
    if (err) return callback(err)
    return callback(null, moodleLessons)
  })
}

/*
 * Esta función actualiza un registro
 */
export function updateFrontTexts(name, newData, callback) {
  let query = {'name':name};
  newData.texts = JSON.parse(newData.texts)
  FrontTexts.findOneAndUpdate(query, { $set: newData }, { safe: true, upsert: true, }, (err, moodleLessonsEdit) => {
    if (err) return callback(err)
    callback(null, moodleLessonsEdit)
  })

}

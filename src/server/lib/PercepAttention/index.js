import {
  default as PercepAttention,
  // PercepAttentionKeys
} from 'src/server/models/PercepAttention'
// import { getParsedInt } from 'src/server/common/utilities'
// import { filterQuery } from 'src/server/lib'
// import _ from 'lodash'


/*
 * Esta función crea un nuevo registro
 */
export function addPercepAttention(newPercepAttention, callback) {
  PercepAttention.create(newPercepAttention, (err, percepAttention) => {
    if (err) return callback(err)
    callback(null, percepAttention)
  })
}

// /*
//  * Esta función actualiza un registro
//  */
// export function updatePercepAttention(id, newData, callback) {
//   PercepAttention.findByIdAndUpdate(id, { $set: newData }, { safe: true, upsert: true, new: true }, (err, percepAttention) => {
//     if (err) return callback(err)
//     callback(null, percepAttention)
//   })
// }
//
// /*
//  * Esta función elimina un nuevo registro
//  */
// export function removePercepAttention(id, callback) {
//   PercepAttention.remove({ _id: id }, (err, info) => {
//     if (err) return callback(err)
//     callback(null, info)
//   })
// }

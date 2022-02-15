import {
    default as Exam,
    ExamKeys
} from 'src/server/models/Exam'
import { getParsedInt } from 'src/server/common/utilities'
import { mongoose, Types } from 'mongoose'
import { filterQuery } from 'src/server/lib'


/*
 * Esta función crea un nuevo registro
 */
export function addExam(newExam, callback) {
    newExam.answers = JSON.parse(newExam.answers)
    Exam.create(newExam, (err, exam) => {
        if (err) return callback(err)
        callback(null, exam)
    })
}

/*
 * Esta función actualiza un registro
 */
export function updateExam(id, newData, callback) {
    newData.answers = JSON.parse(newData.answers)
    Exam.findByIdAndUpdate(id, {
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

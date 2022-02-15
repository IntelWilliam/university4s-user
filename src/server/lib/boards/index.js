/**
 *   Controlador para administrar el módulo de usuarios en la aplicación.
 *
 *  @author: Daniel Loaiza <dfloaiza@gmail.com>
 *
 *   @date: 08/08/2016
 */

/**
 * Dependencies
 */
import Board from 'src/server/models/Board'

/*
 * Esta función crea un nuevo registro
 */
export function createBoard(studentId, teacherId, content, callback) {

        Board.create({ studentId: studentId, teacherId: teacherId, content: content}, (err, board) => {
            if (err) return callback({ status: 500, error: err })
            callback(null, {
                status: 200,
                data: {
                    board: board
                }
            })
        })
    
}
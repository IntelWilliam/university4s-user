import express from 'express'
import { createBoard } from 'src/server/lib/boards'

// se crea el nuevo router para almacenar rutas
const router = express.Router()
router.post('/', (req, res) => {

    if(req.body.studentId == null || req.body.teacherId == null || req.body.content ==  null) {
        return res.status(404).json({error: 'Wrong Data'});
    } else {
        createBoard(req.body.studentId, req.body.teacherId, req.body.content,(err, board) => {
            if (err) return res.status(500).json(err)
            res.json(board)
        })
    }
});

export default router
import express from 'express'
import { addExam, updateExam } from 'src/server/lib/exam'

// se crea el nuevo router para almacenar rutas
const router = express.Router()


/*
 * Este endpoint crea un nuevo registro
 */
router.post('/', (req, res) => {
  let params = req.body
  addExam(params, (err, level) => {
    if (err) return res.status(500).json(err)
    res.json(level)
  })
})

/*
 * Este endpoint actualiza un registro especifico
 */
router.put('/:id', (req, res) => {
  let params = req.body
  let id = req.params.id
  updateExam(id, params, (err, level) => {
    if (err)
      return res.status(500).json(err)
    res.json(level)
  })
})

// se exporta el nuevo router
export default router

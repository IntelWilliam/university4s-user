import express from 'express'
import { getLesson, addLesson, updateLesson, removeLesson } from 'src/server/lib/lesson'

// se crea el nuevo router para almacenar rutas
const router = express.Router()

/*
 * Este end point devuelve todos los registros de esta entidad que coincidan con la query enviada
 */
router.get('/', (req, res) => {
  let query = req.query
  getLesson(query, (err, response) => {
    if (err) return res.status(500).json({ error: err })
    res.json(response)
  })
})

/*
 * Este endpoint crea un nuevo registro
 */
router.post('/', (req, res) => {
  let params = req.body
  addLesson(params, (err, lesson) => {
    if (err) return res.status(500).json(err)
    res.json(lesson)
  })
})

/*
 * Este endpoint devuelve un registro especifico
 */
router.get('/:id', (req, res) => {
  let id = { _id: req.params.id, _matchExactly: '1' }
  getLesson(id, (err, response) => {
    if (err) return res.status(500).json({ error: err })
    res.json(response)
  })
})

/*
 * Este endpoint actualiza un registro especifico
 */
router.put('/:id', (req, res) => {
  let params = req.body
  let id = req.params.id
  updateLesson(id, params, (err, lesson) => {
    if (err) return res.status(500).json(err)
    res.json(lesson)
  })
})

/*
 * Este endpoint elimina un registro especifico
 */
router.delete('/:id', (req, res) => {
  let id = req.params.id
  removeLesson(id, (err, info) => {
    if (err) return res.status(500).json(err)
    res.json(info)
  })
})

// se exporta el nuevo router
export default router

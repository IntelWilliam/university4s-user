import express from 'express'
import { getNewsLetter, addNewsLetter, updateNewsLetter, removeNewsLetter } from 'src/server/lib/newsletter'

// se crea el nuevo router para almacenar rutas
const router = express.Router()

/*
 * Este end point devuelve todos los registros de esta entidad que coincidan con la query enviada
 */
router.get('/', (req, res) => {
  let query = req.query
  getNewsLetter(query, (err, response) => {
    if (err) return res.status(500).json({ error: err })
    res.json(response)
  })
})

/*
 * Este endpoint crea un nuevo registro
 */
router.post('/', (req, res) => {
  let params = req.body
  addNewsLetter(params, (err, newsletter) => {
    if (err) return res.status(500).json(err)
    res.json(newsletter)
  })
})

/*
 * Este endpoint devuelve un registro especifico
 */
router.get('/:id', (req, res) => {
  let id = { _id: req.params.id, _matchExactly: '1' }
  getNewsLetter(id, (err, response) => {
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
  updateNewsLetter(id, params, (err, newsletter) => {
    if (err) return res.status(500).json(err)
    res.json(newsletter)
  })
})

/*
 * Este endpoint elimina un registro especifico
 */
router.delete('/:id', (req, res) => {
  let id = req.params.id
  removeNewsLetter(id, (err, info) => {
    if (err) return res.status(500).json(err)
    res.json(info)
  })
})

// se exporta el nuevo router
export default router

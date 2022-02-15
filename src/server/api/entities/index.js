import express from 'express'
import { getEntity } from 'src/server/lib/entity'

// se crea el nuevo router para almacenar rutas
const router = express.Router()

/*
 * Este end point devuelve todos los registros de esta entidad que coincidan con la query enviada
 */
router.get('/', (req, res) => {
  let query = req.query
  getEntity(query, (err, response) => {
    if (err) return res.status(500).json({ error: err })
    res.json(response)
  })
})

// se exporta el nuevo router
export default router

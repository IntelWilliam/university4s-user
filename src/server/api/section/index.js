import express from 'express'
import { getSection } from 'src/server/lib/section'

// se crea el nuevo router para almacenar rutas
const router = express.Router()

/*
 * Este end point devuelve todos los registros de esta entidad que coincidan con la query enviada
 */
router.get('/', (req, res) => {
  let query = req.query
  getSection(query, (err, response) => {
    if (err) return res.status(500).json({ error: err })
    res.json(response)
  })
})


// se exporta el nuevo router
export default router

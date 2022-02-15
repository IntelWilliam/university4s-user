import express from 'express'
import _ from 'lodash'
import { getUserDev } from 'src/server/lib/userDev'

// se crea el nuevo router para almacenar rutas
const router = express.Router()

/*
 * Este end point devuelve todos los registros de esta entidad que coincidan con la query enviada
 */
router.get('/', (req, res) => {
  // if (req.userDev.role != 'admin') return res.status(401).send('Unauthorized')
    // se obtienen los parametros del request
  let query = req.query

  // se obtiene los usuarios de la base de datos
  getUserDev(query, (err, response) => {
    // se verifica si hay algun error
    if (err) return res.status(500).json({ error: err })
    res.json(response)
  })
})

// se exporta el nuevo router
export default router

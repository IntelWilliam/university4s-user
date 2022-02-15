import express from 'express'
import { getFrontTexts} from 'src/server/lib/front-texts'

// se crea el nuevo router para almacenar rutas
const router = express.Router()

/*
 * Este endpoint devuelve un registro especifico
 */
router.get('/:name', (req, res) => {
  getFrontTexts(req.params.name, (err, response) => {
    if (err) return res.status(500).json({ error: err })
    res.json(response)
  })
})

// se exporta el nuevo router
export default router

import express from 'express'
import { addFile } from 'src/server/lib/driveLib'

// se crea el nuevo router para almacenar rutas
const router = express.Router()

/*
 * Este endpoint crea un nuevo registro
 */
router.post('/', (req, res) => {
  let params = req.body
  addFile(params, (err, file) => {
    if (err) return res.status(500).json(err)
    res.json(file)
  })
})

// se exporta el nuevo router
export default router

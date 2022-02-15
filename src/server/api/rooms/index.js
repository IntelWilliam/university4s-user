import express from 'express'
import { getRooms } from 'src/server/lib/rooms'

// se crea el nuevo router para almacenar rutas
const router = express.Router()

/*
 * Este end point devuelve todos los registros de esta entidad que coincidan con la query enviada
 */
router.get('/', (req, res) => {
    getRooms((err, rooms) => {
        if (err) return res.status(500).json(err)
        res.json(rooms)
    })
});

// se exporta el nuevo router
export default router


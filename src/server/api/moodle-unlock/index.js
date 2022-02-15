import express from 'express'
import { unlockAllSubLevel } from 'src/server/lib/moodle-unlock'

// se crea el nuevo router para almacenar rutas
const router = express.Router()

/**
 * este endpoint desbloquea un subnivel, sus lecciones, practicas y secciones
 */
router.put('/:subLevelId', (req, res) => {
    const userId = req.user ? req.user._id : null || req.body.userId;

    if (!userId) {
        return res.status(500).json('err')
    }
    unlockAllSubLevel(req.params.subLevelId, userId, (err, response) => {
    if (err) return res.status(500).json({ error: err })
    res.json(response)
  })
})

// se exporta el nuevo router
export default router

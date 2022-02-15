import express from 'express'
import {getSubLevel} from 'src/server/lib/sublevel'
import {getSubLvlIdMongo} from 'src/server/lib/getSubLvlIdMongo'
import {unlockAllSubLevel} from 'src/server/lib/moodle-unlock'

// se crea el nuevo router para almacenar rutas
const router = express.Router()

/**
 * este endpoint desbloquea un subnivel.
 */
router.post('/', (req, res) => {
    // console.log("req.body", req.body);
    let query = {}
    let subLevelToUnlock = req.body.subLevelId

    if (subLevelToUnlock > 10){
      query.page = 2
      subLevelToUnlock -= 10
    }

    getSubLevel(query, (err, response) => {
        if (err)
            return res.status(500).json({error: err})

            // console.log('response', response);
            // console.log('length', response.data.length);
            // console.log("subLevel to unlock", response.data[subLevelToUnlock -1]);

            // se obtiene el Id en mongo para un subnivel a partir de un id de DEV
            getSubLvlIdMongo(req.body.userDevId, (err, user) => {
              if (err)
                  return res.status(500).json({error: err})

                  console.log("user to unlock", user);

                  unlockAllSubLevel(response.data[subLevelToUnlock -1]._id, user._id, (err, response) => {
                    if (err) return res.status(500).json({ error: err })
                    res.json(response)
                  })
            })
    })

})
// se exporta el nuevo router
export default router

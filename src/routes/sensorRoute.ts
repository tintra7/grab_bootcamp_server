import express from 'express'

import sensorController from '@/controllers/sensorController'

const router = express.Router()

router.get('/:sensorId', sensorController.getSensorById)

export default router

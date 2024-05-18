// import { Router } from 'express';
// import { sendFanOnOff, sendFanSpeedUp, sendFanSpeedDown, sendFanSwing, sendFanLight } from '@/controllers/fanController';

// const router = Router();

// router.post('fan/:id/on_off', sendFanOnOff);
// router.post('fan/:id/speed_up', sendFanSpeedUp);
// router.post('fan/:id/speed_down', sendFanSpeedDown);
// router.post('fan/:id/swing', sendFanSwing);
// router.post('fan/:id/light', sendFanLight);

// export default router;

import express from 'express'

import fanController from '@/controllers/fanController'
// import deviceController from '@/controllers/deviceController'

const router = express.Router()

router.get('/', fanController.getAllFan)

router.get('/:id', fanController.getSingleFan)

router.get('/:id/stats', fanController.getFanStats)

router.post('/:id/set', fanController.powerFan)

router.post('/:id/sendsignal', fanController.sendFanSignal)

router.post('/:id/sendspeedsignal', fanController.sendFanSpeedSignal)

router.post('/', fanController.linkNewFan)

export default router

// export const sendFanOnOff = async (req: Request, res: Response) => {
//   try {
//     await fanService.sendFanOnOff();
//     res.json({ success: true, message: "Fan toggled On/Off" });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

import { Request, Response } from 'express'

import LinkFanRequest from '@/models/requests/FanRequests/linkFanRequest'
import fanService from '@/services/fanService'

import { isLinkFanRequestValid, isSendFanSignalRequest, isSetFanRequestValid, isSendFanSpeedSignalRequest } from '@/utils/validateFanRequest'
import SetFanRequest from '@/models/requests/FanRequests/setFanRequest'
import SendFanSignalRequest from '@/models/requests/FanRequests/sendFanSignalRequest'
import SetDeviceRequest from '@/models/requests/DeviceRequests/setDeviceRequest'
import SendSignalRequest from '@/models/requests/DeviceRequests/sendSignalRequest'
import FanStatsResponse from '@/models/responses/statsFanResponse'
import SendFanSpeedSignalRequest from '@/models/requests/FanRequests/sendFanSpeedForFanRequest'

const getAllFan = async (_: Request, res: Response) => {
    try {
        const fanList = await fanService.getFanList()
        console.log(fanList)
        res.json(fanList)
    } catch (error) {
        if (error instanceof Error) res.status(500).send({error: error.message})
    }
}

const getSingleFan = async (req: Request, res: Response) => {
    const fanId: string = req.params.id 

    try {
        const fan = await fanService.getSingleFan(fanId)
        res.json(fan)
    } catch (error) {
        if (error instanceof Error) res.status(400).send({ message: error.message})
    }
}

const linkNewFan = async (req: Request, res: Response) => {
    try {
        const newFan = <LinkFanRequest>req.body
        if (!isLinkFanRequestValid(newFan)) throw Error('Missing field(s)')
        await fanService.createNewFan(newFan)
        res.json({ message: 'Successfully linked new fan' })
    } catch (error) {
        if (error instanceof Error) res.status(400).send({ message: error.message })
    }
}

const powerFan = async (req: Request, res: Response) => {
    try {
        const setFanRequest = <SetFanRequest>req.body
        setFanRequest.fanId = req.params.id
        if (!isSetFanRequestValid(setFanRequest)) throw Error('Missing field(s)')
        await fanService.setFan(setFanRequest)
        res.json({ message: 'Successfully set fan' })
    } catch (error) {
        if (error instanceof Error) res.status(400).send({ message: error.message })
    }
}

const sendFanSignal = async (req: Request, res: Response) => {
    try {
        const sendFanSignalRequest = <SendFanSignalRequest>req.body
        sendFanSignalRequest.fanId = req.params.id
        if (!isSendFanSignalRequest(sendFanSignalRequest)) throw Error('Missing field(s)')
        await fanService.sendFanSignal(sendFanSignalRequest)
        res.json({ message: 'Successfully send signal' })
    } catch (error) {
        if (error instanceof Error) res.status(400).send({message: error.message})
    }
}



const getFanStats = async (req: Request, res: Response) => {
    try {
        const stats: FanStatsResponse | undefined = await fanService.getFanStats(req.params.id)
        res.json(stats)
    } catch (error) {
        if (error instanceof Error) res.status(400).send({ message: error.message })
    }
}

// const testFanController = async (req: Request, res: Response) => {

// }


const sendFanSpeedSignal = async (req: Request, res: Response) => {
    try {
        const sendFanSpeedSignalRequest = <SendFanSpeedSignalRequest>req.body
        sendFanSpeedSignalRequest.fanId = req.params.id
        if (!isSendFanSpeedSignalRequest(sendFanSpeedSignalRequest)) throw Error('Missing field(s)')
        await fanService.sendFanSpeedSignal(sendFanSpeedSignalRequest)
        res.json({ message: 'Successfully send signal' })
    } catch (error) {
        if (error instanceof Error) res.status(400).send({message: error.message})
    }
}

export default { getAllFan, getSingleFan, linkNewFan, powerFan, sendFanSignal, getFanStats, sendFanSpeedSignal}

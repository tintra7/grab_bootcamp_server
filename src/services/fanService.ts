import axios, { AxiosError, AxiosResponse } from 'axios'
import { google } from 'googleapis'
import nodemailer, { TransportOptions } from 'nodemailer'

import { espFanApiUrl } from '@/constants/espFanApiUrl'
import { auth, mailoptions } from '@/constants/email'

import LinkFanRequest from '@/models/requests/FanRequests/linkFanRequest'
import FanModel, { IFan } from '@/models/entities/fanModel'
import SetFanRequest from '@/models/requests/FanRequests/setFanRequest'
import SendFanSignalRequest from '@/models/requests/FanRequests/sendFanSignalRequest'
import FanStatsResponse from "@/models/responses/statsFanResponse";
import SendFanSpeedSignalRequest from '@/models/requests/FanRequests/sendFanSpeedForFanRequest'

type FanList = IFan[]


const sendEmergencyMail = async (fanName: string) => {
  try {
    const oAuth2Client = new google.auth.OAuth2(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      process.env.REDIRECT_URI
    )

    oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN })

    const accessToken = await oAuth2Client.getAccessToken()

    const transport = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        ...auth,
        accessToken: accessToken
      }
    } as TransportOptions)

    const mailOptions = {
      ...mailoptions,
      text: `HIGH TEMPERATURE ON DEVICE ${fanName}`
    }

    await transport.sendMail(mailOptions)
  } catch (error) {
    console.log(error)
  }
}


const getFanList = async (): Promise<FanList> => {
  let fanList: FanList = []
  try {
    fanList = await FanModel.find()
  }
  catch (error) {
    throw new Error('Failed to get fan list')
  }

  return fanList
}

const getSingleFan = async (fanId: string): Promise<IFan | null> => {
  type Fan = IFan | null
  let fan: Fan = null

  try {
    fan = await FanModel.findById(fanId)
    if (fan != null) {
      return fan
    }
  }
  catch (error) {
    throw new Error(`Cannot find fan with the id ${fanId}`)
  }

  return fan
}

const createNewFan = async (newFan: LinkFanRequest) => {
  try {
    const newFanModel = new FanModel(newFan)
    await newFanModel.save()
    
  } catch (error) {
    throw new Error(`Cannot save new device`)
  }
}         

const sendFanSignal = async (sendFanSignalRequest: SendFanSignalRequest) => {
  try {
    type Fan = IFan | null 

    const fan: Fan = await FanModel.findById(sendFanSignalRequest.fanId)

    if (fan != null) {
      fan.status = sendFanSignalRequest.status
      fan.fanSpeed = sendFanSignalRequest.fanSpeed
      fan.swing = sendFanSignalRequest.swing
      fan.light = sendFanSignalRequest.light

      fan.save()
    }
    await axios.post(`${espFanApiUrl}/sendsignal`, sendFanSignalRequest)
  } catch (error) {
    if (error instanceof AxiosError) throw new Error('Cannot send signal !')
    if (error instanceof Error) throw new Error('Cannot find fan !')
  }
}

const sendFanSpeedSignal = async (sendFanSpeedSignalRequest: SendFanSpeedSignalRequest) => {
  try {
    type Fan = IFan | null 

    const fan: Fan = await FanModel.findById(sendFanSpeedSignalRequest.fanId)

    if (fan != null) {
      fan.fanSpeed = sendFanSpeedSignalRequest.fanSpeed
      fan.save()
    }
    await axios.post(`${espFanApiUrl}/sendspeedsignal`, sendFanSpeedSignalRequest)
  } catch (error) {
    if (error instanceof AxiosError) throw new Error('Cannot send signal !')
    if (error instanceof Error) throw new Error('Cannot find fan !')
  }
}

const setFan = async (setFanRequest: SetFanRequest) => {
  try {
    await axios.post(`${espFanApiUrl}/set`, setFanRequest)
  } catch (error) {
    throw new Error('Cannot set fan !')
  }
}

const getFanStats = async (fanId: string) => {
  try {
    type Fan = IFan | null

    const fan: Fan = await FanModel.findById(fanId)

    if (fan != null) {
      const stats: AxiosResponse<FanStatsResponse> = await axios.get(`${espFanApiUrl}/stats?fanId=${fanId}&userId=test`)

      fan.envTemp = stats.data.temp
      fan.humidity = stats.data.humidity

      // fan.save()

      if (fan.envTemp >= 32) await sendEmergencyMail(fan.name)

      return {
        humidity: stats.data.humidity,
        temp: stats.data.temp,
        fanId: fanId
      }
    }
  } catch (error) {
    if (error instanceof AxiosError) throw new Error('Cannot send signal !')
    if (error instanceof Error) throw new Error('Cannot find fan !')
  }
}

export default {
  getFanList,
  getSingleFan,
  createNewFan,
  setFan,
  sendFanSignal,
  getFanStats,
  sendFanSpeedSignal
}
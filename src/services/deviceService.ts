import axios, { AxiosError, AxiosResponse } from 'axios'
import { google } from 'googleapis'
import nodemailer, { TransportOptions } from 'nodemailer'

import { espApiUrl } from '@/constants/espApiUrl'
import { auth, mailoptions } from '@/constants/email'

import LinkDeviceRequest from '@/models/requests/linkDeviceRequest'
import SetDeviceRequest from '@/models/requests/setDeviceRequest'
import SendSignalRequest from '@/models/requests/sendSignalRequest'
import StatsResponse from '@/models/responses/statsResponse'
import { IDevice, Device as DeviceModel, Sensor, Room } from '@/models/entities'

type DeviceList = IDevice[]

const sendEmergencyMail = async (deviceName: string) => {
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
      text: `HIGH TEMPERATURE ON DEVICE ${deviceName}`
    }

    await transport.sendMail(mailOptions)
  } catch (error) {
    console.log(error)
  }
}

const getDeviceList = async (roomId: string): Promise<DeviceList> => {
  let deviceList: DeviceList = []

  try {
    deviceList = await DeviceModel.find(roomId ? { roomId } : {})
  } catch (error) {
    throw new Error('Failed to get device list')
  }

  return deviceList
}

const getSingleDevice = async (deviceId: string): Promise<IDevice | null> => {
  type Device = IDevice | null
  let device: Device = null
  try {
    device = await DeviceModel.findById(deviceId)
    if (device != null) {
      return device
    }
  } catch (error) {
    throw new Error(`Cannot find device with the id ${deviceId}`)
  }

  return device
}

const createNewDevice = async (newDevice: LinkDeviceRequest) => {
  try {
    const room = await Room.findById(newDevice.roomId)
    const sensorId = room?.sensorId
    const sensor = await Sensor.findById(sensorId)
    const newDeviceModel = new DeviceModel({ ...newDevice, espId: sensor?.espId })
    await newDeviceModel.save()
  } catch (error) {
    throw new Error(`Cannot save new device`)
  }
}

const sendSignal = async (sendSignalRequest: SendSignalRequest) => {
  try {
    type Device = IDevice | null

    const device: Device = await DeviceModel.findById(sendSignalRequest.deviceId)

    if (device != null) {
      device.currentProfile = sendSignalRequest.profile
      device.temp = sendSignalRequest.temp
      device.fan = sendSignalRequest.fan
      device.status = sendSignalRequest.status

      sendSignalRequest.brand = device.brand

      device.save()
    }

    await axios.post(`${espApiUrl}/sendsignal`, sendSignalRequest)
  } catch (error) {
    if (error instanceof AxiosError) throw new Error('Cannot send signal !')
    if (error instanceof Error) throw new Error('Cannot find device !')
  }
}

const setDevice = async (setDeviceRequest: SetDeviceRequest) => {
  try {
    await axios.post(`${espApiUrl}/set`, setDeviceRequest)
  } catch (error) {
    throw new Error('Cannot set device !')
  }
}

const getStats = async (deviceId: string) => {
  try {
    type Device = IDevice | null

    const device: Device = await DeviceModel.findById(deviceId)

    if (device != null) {
      const stats: AxiosResponse<StatsResponse> = await axios.get(`${espApiUrl}/stats?deviceId=${deviceId}&userId=test`)

      const room = await Room.findById(device.roomId)
      const sensor = await Sensor.findOne({ roomId: room?._id })
      if (sensor != null) {
        sensor.temp = stats.data.temp || 28
        sensor.humidity = stats.data.humidity || 50.8

        // sensor.save()

        if (sensor.temp >= 32) await sendEmergencyMail(device.name)

        return {
          humidity: stats.data.humidity,
          temp: stats.data.temp,
          deviceId: deviceId
        }
      }
    }
  } catch (error) {
    if (error instanceof AxiosError) throw new Error('Cannot send signal !')
    if (error instanceof Error) throw new Error('Cannot find device !')
  }
}

export default {
  getDeviceList,
  getSingleDevice,
  createNewDevice,
  setDevice,
  sendSignal,
  getStats,
  sendEmergencyMail
}

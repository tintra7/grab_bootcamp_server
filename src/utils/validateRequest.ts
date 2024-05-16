import { MODE } from '@/constants/enum'
import LinkDeviceRequest from '@/models/requests/DeviceRequests/linkDeviceRequest'
import SendSignalRequest from '@/models/requests/DeviceRequests/sendSignalRequest'
import SetDeviceRequest from '@/models/requests/DeviceRequests/setDeviceRequest'

export const isLinkRequestValid = (request: LinkDeviceRequest): boolean => {
  if (request.name == undefined) return false
  if (request.brand == undefined) return false
  if (request.userId == undefined) return false

  if (request.profile != undefined) {
    for (const mode of Object.values(MODE)) {
      if (request.profile[mode] != undefined) {
        if (request.profile[mode].fan == undefined) return false
        if (request.profile[mode].temp == undefined) return false
      } else return false
    }
  } else return false

  return true
}

export const isSetDeviceRequestValid = (request: SetDeviceRequest): boolean => {
  console.log(request)
  if (request.deviceId == undefined) return false
  if (request.userId == undefined) return false
  return true
}

export const isSendSignalRequest = (request: SendSignalRequest): boolean => {
  if (request.deviceId == undefined) return false
  if (request.temp == undefined) return false
  if (request.userId == undefined) return false
  if (request.fan == undefined) return false
  if (request.status == undefined) return false
  if (request.profile == undefined) return false
  return true
}

// export const isSendFanSignalRequest = (request: SendSignalRequest): boolean => {
//   if (request.userId == undefined) return false
//   if (request.deviceId == undefined) return false
//   if (request.status == undefined) return false
//   if (request.fan == undefined) return false
//   if (request.shake == undefined) return false
//   if (request.light == undefined) return false
//   return true
// }
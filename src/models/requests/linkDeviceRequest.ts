import { BRAND, MODE, FANSPEED } from '@/constants/enum'

interface LinkDeviceRequest {
  name: string
  brand: BRAND
  roomId: string
  profile: {
    [key in MODE]: {
      temp: number
      fan: FANSPEED
    }
  }
}

export default LinkDeviceRequest

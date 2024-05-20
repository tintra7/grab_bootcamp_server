import { ISensor, Sensor } from '@/models/entities'
import mongoose from 'mongoose'

const getSensorById = async (sensorId: mongoose.Types.ObjectId): Promise<ISensor | null> => {
  type Sensor = ISensor | null
  let sensor: Sensor
  try {
    sensor = await Sensor.findById(sensorId)
    if (sensor) {
      return sensor
    } else {
      throw new Error(`Sensor not found`)
    }
  } catch (error) {
    throw new Error(
      `Error when fetching sensor with the id ${sensorId}: ${error instanceof Error ? error.message : ''}`
    )
  }
}

export default { getSensorById }

import sensorService from '../services/sensorService'
import { Request, Response } from 'express'
import mongoose from 'mongoose'

const getSensorById = async (req: Request, res: Response) => {
  const { sensorId } = req.params
  if (!mongoose.Types.ObjectId.isValid(sensorId)) {
    return res.status(400).json({ message: 'Invalid sensorId' })
  }
  try {
    const sensor = await sensorService.getSensorById(new mongoose.Types.ObjectId(sensorId))
    res.status(200).json(sensor)
  } catch (error) {
    if (error instanceof Error) res.status(500).send({ message: error.message })
  }
}
export default { getSensorById }

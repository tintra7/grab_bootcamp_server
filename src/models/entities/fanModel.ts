import mongoose, {Document, Schema} from "mongoose"
import { FANLIGHT, FANSWING, STATUS, FANSPEEDFORFAN } from '@/constants/enum'


// Fan interface to incorporate all features
export interface IFan extends Document {
    _id: string;
    userId: string;
    name: string;
    status: STATUS;
    fanSpeed: FANSPEEDFORFAN;
    swing: FANSWING;
    light: FANLIGHT;
    envTemp: number;
    humidity: number;
}
  
const fanSchema = new Schema<IFan>({
    userId: String,
    name: {
      type: String,
      required: function () {
        return this.name.trim()
      }
    },
    status: {
      type: String,
      default: STATUS.OFF
    },
    fanSpeed: {
      type: String,
      default: FANSPEEDFORFAN.NONE
    },
    swing: {
        type: String,
        default: FANSWING.OFF
    },
    light: {
        type: String,
        default: FANLIGHT.OFF
    },
    envTemp: {
      type: Number,
      default: -1
    },
    humidity: {
      type: Number,
      default: -1
    }
  })
  
  const FanModel = mongoose.model<IFan>('fans', fanSchema)
  
  export default FanModel

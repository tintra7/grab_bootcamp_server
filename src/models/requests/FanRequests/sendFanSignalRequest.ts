import { FANLIGHT, FANSWING, STATUS, FANSPEEDFORFAN } from '@/constants/enum'


interface SendFanSignalRequest {
    _id: string;
    userId: string;
    fanId: string;
    name: string;
    status: STATUS;
    fanSpeed: FANSPEEDFORFAN;
    swing: FANSWING;
    light: FANLIGHT;
}

export default SendFanSignalRequest

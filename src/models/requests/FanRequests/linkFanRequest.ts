import { FANLIGHT, FANSWING, STATUS, FANSPEEDFORFAN } from '@/constants/enum'

interface LinkFanRequest {
    _id: string;
    userId: string;
    name: string;
    // status: STATUS;
    // fanSpeed: FANSPEEDFORFAN;
    // swing: FANSWING;
    // light: FANLIGHT;
}

export default LinkFanRequest
import LinkFanRequest from "@/models/requests/FanRequests/linkFanRequest";
import SendFanSignalRequest from "@/models/requests/FanRequests/sendFanSignalRequest";
import SetFanRequest from "@/models/requests/FanRequests/setFanRequest";

export const isLinkFanRequestValid = (request: LinkFanRequest): boolean => {
    if (request.name == undefined) return false
    if (request.userId == undefined) return false
    // if (request.fanSpeed == undefined) return false
    // if (request.light == undefined) return false
    // if (request.swing == undefined) return false
    return true
}

export const isSetFanRequestValid = (request: SetFanRequest): boolean => {
    console.log(request)
    if (request.fanId == undefined) return false
    if (request.userId == undefined) return false

    return true
}

export const isSendFanSignalRequest = (request: SendFanSignalRequest): boolean => {
    if (request.fanId == undefined) return false
    if (request.userId == undefined) return false;
    if (request.status == undefined) return false;
    if (request.fanSpeed == undefined) return false;
    if (request.swing == undefined) return false;
    if (request.light == undefined) return false;
    return true
}


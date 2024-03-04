import axios from "axios"
import { ApiConfig } from "../constants/RecConfig"
import { ServerEndpoints } from "../constants/RecEndpoints"
import { ServerConfig } from "../constants/RecServerconf"
import { NotificationData } from "../models/RecepModels"

export function RegisterMessageToken(data:NotificationData){
    try {
        console.log("register message ",data)
        return axios({
            method:'post',
            headers:ApiConfig,
            url:ServerConfig.urlString+ServerEndpoints.POST_NOTIFICATION_TOKEN,
            data:data
        })
    } catch (error) {
        console.log("error ",error)
    }
}
import axios from "axios";
import { ApiConfig } from "../constants/RecConfig";
import { ServerConfig } from "../constants/RecServerconf";
import { ServerEndpoints } from "../constants/RecEndpoints";

export function GetNotificationByUserCode(data:any){
    try {
        return axios({
            method:'post',
            headers:ApiConfig,
            url:ServerConfig.urlString+ServerEndpoints.POST_NOTIFICATION_DATA,
            data:data
        })
    } catch (error) {
        console.log("error ",error)
    }
}

export function GetGatePassByUserCode(data:any){
    try {
        return axios({
            method:'post',
            headers:ApiConfig,
            url:ServerConfig.urlString+ServerEndpoints.POST_GATEPASS_DATA,
            data:data
        })
    } catch (error) {
        console.log("error ",error)
    }
}

export function LogoutByUserCode(data:any){
    try {
        return axios({
            method:'post',
            headers:ApiConfig,
            url:ServerConfig.urlString+ServerEndpoints
        })
    } catch (error) {
        
    }
}

export function GetUserSettings(){
    try {
        return axios({
            method:'get',
            headers:ApiConfig,
            url:ServerConfig.urlString+ServerEndpoints.GET_USER_SETTINGS
        })
    } catch (error) {
        console.log("error "+error)
    }
}
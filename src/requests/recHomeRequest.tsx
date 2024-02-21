import axios from "axios";
import { ApiConfig } from "../constants/RecConfig";
import { ServerConfig } from "../constants/RecServerconf";
import { ServerEndpoints } from "../constants/RecEndpoints";

export function GetUsersByLocation(data:any){
    try {
        return axios({
            method:'post',
            headers:ApiConfig,
            url:ServerConfig.urlString+ServerEndpoints.POST_USER_LOCATION,
            data:data
        })
    } catch (error) {
        console.log("error ",error)
    }
}

export function PostVisitorData(data:any){
    try {
        return axios({
            method:'post',
            headers:ApiConfig,
            url:ServerConfig.urlString+ServerEndpoints.POST_VISITOR_DATA,
            data:data
        })
    } catch (error) {
        console.log("error ",error)
    }
}


export function GeViewHistoryData(data:any){
    try {
        return axios({
            method:'post',
            headers:ApiConfig,
            url:ServerConfig.urlString+ServerEndpoints.GET_VISITOR_HISTORY,
            data:data
        })
    } catch (error) {
        console.log("error ",error)
    }
}
import axios from "axios";
import { ApiConfig } from "../constants/RecConfig";
import { ServerConfig } from "../constants/RecServerconf";
import { ServerEndpoints } from "../constants/RecEndpoints";

export async function GetUsersByLocation(data:any){
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

export async  function PostVisitorData(data:any){
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

export async function GeViewHistoryData(data:any){
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

export async function GetAllRevisitorsData(data:any){
    try {
        return axios({
            method:'post',
            headers:ApiConfig,
            url:ServerConfig.urlString+ServerEndpoints.GET_ALL_REVISITORS_DATA,
            data:data
        })
    } catch (error) {
        console.log("error ",error)
    }
}

export async function GetPhoneNumberDetails(data:any){
    try {
        return axios({
            method:'post',
            headers:ApiConfig,
            url:ServerConfig.urlString+ServerEndpoints.GET_DETAILS_BY_PHONENUMBER,
            data:data
        })
    } catch (error) {
        console.log("error ",error)
    }
}

export async function UpdateVisitStatus(data:any){
    try {
        return axios({
            method:'post',
            headers:ApiConfig,
            url:ServerConfig.urlString+ServerEndpoints.UPDATE_VISITOR_STATUS,
            data:data
        })
    } catch (error) {
        console.log("error ",error)
    }
}
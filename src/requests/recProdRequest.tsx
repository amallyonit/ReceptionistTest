import axios from "axios";
import { ApiConfig } from "../constants/RecConfig";
import { ServerConfig } from "../constants/RecServerconf";
import { ServerEndpoints } from "../constants/RecEndpoints";

export async function GenerateGateEntry(data:any){
    try {
        return axios({
            method:'post',
            headers:ApiConfig,
            url:ServerConfig.urlString+ServerEndpoints.POST_PRODUCT_DATA,
            data:JSON.stringify(data)
        })
    } catch (error) {
        console.log("error ",error)
    }
}

export async function GetVehicleDetailByNumber(data:any){
    try {
        return axios({
            method:'post',
            headers:ApiConfig,
            url:ServerConfig.urlString+ServerEndpoints.GET_VEHICLE_DETAILS_BY_NO,
            data:JSON.stringify(data)
        })
    } catch (error) {
        console.log("error ",error)
    }
}

export async function GetVehicleNumbers(data:any){
    try {
        return axios({
            method:'post',
            headers:ApiConfig,
            url:ServerConfig.urlString+ServerEndpoints.GET_ALL_VEHICLE_NUMBERS,
            data:JSON.stringify(data)
        })
    } catch (error) {
        console.log("error ",error)
    }
}

export async function GetTransportNames(){
    try {
        return axios({
            method:'get',
            headers:ApiConfig,
            url:ServerConfig.urlString+ServerEndpoints.GET_TRANSPORT_NAMES
        })
    } catch (error) {
        console.log("error ",error)
    }
}

export async function UpdateOutTime(data:any){
    try {
        return axios({
            method:'post',
            headers:ApiConfig,
            url:ServerConfig.urlString+ServerEndpoints.UPDATE_PRODUCT_OUTTIME,
            data:JSON.stringify(data)
        })
    } catch (error) {
        console.log("error ",error)
    }
}

export async function UpdateEntryStatus(data:any){
    try {
        return axios({
            method:'post',
            headers:ApiConfig,
            url:ServerConfig.urlString+ServerEndpoints.UPDATE_PRODUCT_STATUS,
            data:JSON.stringify(data)
        })
    } catch (error) {
        console.log("error ",error)
    }
}

export async function GetDeliveryStatus(data:any){
    try {
        return axios({
            method:'post',
            headers:ApiConfig,
            url:ServerConfig.urlString+ServerEndpoints.GET_PRODUCT_DP_STATUS,
            data:JSON.stringify(data)
        })
    } catch (error) {
        console.log("error ",error)
    }
}

export async function GETReports(data:any){
    try {
        return axios({
            method:'post',
            headers:ApiConfig,
            url:ServerConfig.urlString+ServerEndpoints.GET_REPORTS_DATA_BY_FILTER,
            data:JSON.stringify(data)
        })
    } catch (error) {
        console.log("error ",error)
    }
}



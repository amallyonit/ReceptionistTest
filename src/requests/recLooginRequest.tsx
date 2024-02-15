import axios from "axios";
import { ServerConfig } from "../constants/RecServerconf";
import { ApiConfig } from "../constants/RecConfig";
import { ServerEndpoints } from "../constants/RecEndpoints";
import { RetrieveValue } from "../wrapper/storedata.wrapper";

export function PostUserLogin(data:any){
    try {
        return axios({
            method:'post',
            url:ServerConfig.urlString+ServerEndpoints.POST_USER_LOGIN,
            headers:ApiConfig,
            data:data
        })
    } catch (error) {
        console.log("error ",error)
    }
}


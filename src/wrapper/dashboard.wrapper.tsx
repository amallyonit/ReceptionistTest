import axios from "axios";
import { ApiConfig } from "../constants/RecConfig";
import { ServerConfig } from "../constants/RecServerconf";
import { ServerEndpoints } from "../constants/RecEndpoints";

export function GetUsers(data:any) {
    return axios({
        method:'post',
        url:ServerConfig.urlString+ServerEndpoints.POST_USERS,
        headers:ApiConfig,
        data:JSON.stringify(data)
    })
}
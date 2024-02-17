import axios from "axios";

export function GetUsersByLocation(data:any){

    return axios({
        method:'get',
        params:data,
    })
}
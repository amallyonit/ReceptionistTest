import AsyncStorage, { AsyncStorageStatic } from "@react-native-async-storage/async-storage"


export const StoreValue = (key:string,value:any)=>{
    AsyncStorage.setItem(key,JSON.stringify(value))
}

export const RetrieveValue = (key:any) =>{
   return AsyncStorage.getItem(key)
}
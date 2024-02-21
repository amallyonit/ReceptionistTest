import AsyncStorage from "@react-native-async-storage/async-storage"

/**
 * 
 * @param key session store key (any)
 * @param value session store value (any)
 */
export const StoreValue = (key:string,value:any)=>{
    AsyncStorage.setItem(key,JSON.stringify(value))
}

/**
 * 
 * @param key session store key
 * @returns get all the values as per the key
 */
export async function RetrieveValue(key:any){
   return AsyncStorage.getItem(key)
}



/**
 * 
 * @param key session store key
 */
export const ClearStoreValue = (key:any[])=>{
    if(key.length<1){
        AsyncStorage.removeItem(key[0])
    }else{
        AsyncStorage.multiRemove(key)
    }
}
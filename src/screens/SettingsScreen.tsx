import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react"
import { Button, View } from "react-native"
import { MiscStoreKeys } from "../constants/RecStorageKeys";

const SettingScreen = ({navigation}:any) =>{
    return(
      <View>
        <Button title="logout" onPress={()=>
          {
            navigation.replace('Login');
            AsyncStorage.removeItem(MiscStoreKeys.EZ_LOGIN)
          }}></Button>
      </View> 
    )
}

export default SettingScreen
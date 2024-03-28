import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react"
import { Button, View } from "react-native"
import { MiscStoreKeys } from "../constants/RecStorageKeys";
import { ListItem } from "react-native-elements";
import { UserLDData } from "../models/RecepModels";

const SettingScreen = ({ navigation }: any) => {
  const [viewUser, setViewUser] = useState<UserLDData>()
  useEffect(() => {
    getUserData()
  }, [])

  const getUserData = async () => {
    const data: any = await AsyncStorage.getItem(MiscStoreKeys.EZ_LOGIN)
    const vals = JSON.parse(data)
    console.log("data ", vals.Data[0][0])
    setViewUser(vals.Data[0][0])
  }
  return (
    <View>
      <ListItem bottomDivider>
      {/* <Avatar rounded title="A" size={50} containerStyle={{ backgroundColor: Color.lightGreyRecColor }} /> */}
        <ListItem.Content>
          <ListItem.Title>{viewUser?.UserName}</ListItem.Title>
          <ListItem.Subtitle>{viewUser?.UserCode}</ListItem.Subtitle>
        </ListItem.Content>
      </ListItem>
      <ListItem bottomDivider>
        <ListItem.Content>
          <ListItem.Subtitle style={{ paddingTop: 5 }}>
            <Button title="Logout" onPress={() => {
              navigation.replace('Login');
              AsyncStorage.removeItem(MiscStoreKeys.EZ_LOGIN)
            }}></Button>
          </ListItem.Subtitle>
        </ListItem.Content>
      </ListItem>
    </View>
  )
}

export default SettingScreen
import React, { useEffect, useState } from "react"
import { ActivityIndicator, Alert, Dimensions, Image, StyleSheet, Text, View } from "react-native"
import Color from "../theme/Color"
import Fonts from "../theme/Fonts"
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MiscStoreKeys } from "../constants/RecStorageKeys";
import { GetUserSettings } from "../requests/recAdminRequest";
import DeviceInfo from "react-native-device-info";
import Snackbar from "react-native-snackbar";

const logoImage = require('../../assets/nlogo2.png')
const logoamr = require('../../assets/recimages/AmrLogo.png')
const SplashEzEntryScreen = ({ navigation }: any) => {
  const [settingValue, setSettingValue] = useState<
    { SettingsName: string, SettingsText: string, SettingsValue: number }>({
      SettingsName: "",
      SettingsText: "",
      SettingsValue: 0
    })
  useEffect(() => {
    setTimeout(async () => {
      await AsyncStorage.getItem(MiscStoreKeys.EZ_LOGIN).then((response) => {
        const value = JSON.parse(response!)
        console.log(value)
        if (value != null) {
          navigation.replace(value.Data[0][0].UserType == "L" ? 'Home' : 'Admin')
          console.log(value);
        } else {
          navigation.replace('Login')
        }
      }
      );
    }, 3000);
  }, []);

  useEffect(() => {
    fetchSettings()
  }, [])


  const fetchSettings = async () => {
    await GetUserSettings()?.then((res) => {
      if (res?.data?.Status) {
        console.log("settings reponse ", res?.data?.Data[0])
        setSettingValue(res?.data?.Data[0])
        let verion = DeviceInfo.getVersion()
        console.log(verion)
      } else {
        Snackbar.show({
          text: 'Failed to get the settings',
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: Color.whiteRecColor,
          textColor: Color.redRecColor,
        });
      }
    }).catch(error => {
      console.log("error " + error)
    })
  }

  return (
    <View style={styles.centeredView}>
      <View>
        <Image style={{
          height: 100,
          width: 180,
          objectFit: 'contain',
        }} source={logoamr}></Image>
      </View>
      <View>
        <Image style={{
          height: 80,
          width: 180,
          objectFit: 'contain'
        }} source={logoImage}></Image></View>
      <View style={styles.versionContainer}>
        <Text style={styles.versionText}>v {settingValue?.SettingsText !== undefined ? settingValue.SettingsText : 'Loading...'}</Text>
        <Text style={styles.versionText}>Powered by LyonIT</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 22,
    backgroundColor: Color.whiteRecColor,
    paddingVertical: 100,
    fontFamily: ''
  },
  entryText: {
    color: Color.blueRecColor,
    fontFamily: Fonts.recFontFamily.commonRecFont,
    fontSize: 20,
  },
  versionContainer: {
    marginBottom: 10
  },
  versionText: {
    textAlign: 'center',
    fontSize: 17,
    color: Color.newBlueColor,
    fontWeight: 'bold'
  }
})

export default SplashEzEntryScreen
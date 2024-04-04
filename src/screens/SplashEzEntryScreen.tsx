import React, { useEffect, useState } from "react"
import { ActivityIndicator, Image, StyleSheet, View } from "react-native"
import Color from "../theme/Color"
import Fonts from "../theme/Fonts"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { MiscStoreKeys } from "../constants/RecStorageKeys"


const logoImage = require('../../assets/print_prev_ez.png')
const SplashEzEntryScreen = ({navigation}:any)=>{
  useEffect(() => {
    setTimeout(async () => {
      await AsyncStorage.getItem(MiscStoreKeys.EZ_LOGIN).then((response) =>
      {
        const value = JSON.parse(response!)
        console.log(value)
        if(value!=null){
          navigation.replace(value.Data[0][0].UserType=="L"?'Home':'Admin')    
          console.log(value);
        }else{
          navigation.replace('Login')
        }
      }
      );
    }, 3000);
  }, []);
    return(
        <View style={styles.centeredView}>
            <Image source={logoImage}></Image>
        </View>
    )
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    entryText:{
        color:Color.blueRecColor,
        fontFamily:Fonts.recFontFamily.titleRecFont,
        fontSize:20
    }
})

export default SplashEzEntryScreen
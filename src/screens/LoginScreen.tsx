"use strict"
import { Image, Text, View, TextInput, StyleSheet, Dimensions, Pressable } from "react-native"
import Color from "../theme/Color"
import Fonts from "../theme/Fonts"
import { useState } from "react";
import React from "react";
import { PostUserLogin } from "../requests/recLooginRequest";
import { StoreValue } from "../wrapper/storedata.wrapper";
import { MiscStoreKeys } from "../constants/RecStorageKeys";
import { Button, Icon } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
const receLogo =  require('../../assets/recimages/Frame.png')
const receBottomLogo = require('../../assets/recimages/Group.png')

const LoginScreen = ({navigation}:any) =>{
    const [userId,setUserId]=  useState("");
    const [password,setPassword]=  useState("");
    const fetchLogin =async ()=>{
      let payload = {
        UserID:userId,
        Password:password
      }
      try {
        PostUserLogin(payload)?.then(async (response:any)=>{
          console.log("resposne ",response)
          if(response?.data.Status){
            StoreValue(MiscStoreKeys.EZ_LOGIN,response.data.Data[0][0])
            let userLocations = response.data.Data[1]
              navigation.navigate('Home',{userLocations})
              StoreValue(MiscStoreKeys.EZ_LOCATION,JSON.stringify(userLocations))
              StoreValue(MiscStoreKeys.EZ_TOKEN,JSON.stringify(response.data.Token))
          }else{
          }
        }).catch((error)=>{
          console.log("error ",error)
        }) 
      } catch (error) {
        
      }
    }
    return(
        <View style={styles.container}>
        <Image source={receLogo} style={styles.image} />
        <Text style={styles.title}>EzEntry</Text>
        <View style={styles.inputView}>
            <TextInput style={styles.input} placeholderTextColor={Color.blackRecColor} placeholder='User ID' value={userId} onChangeText={setUserId} autoCorrect={false} autoCapitalize='none' />
            <TextInput style={styles.input} placeholderTextColor={Color.blackRecColor} placeholder='Password' secureTextEntry value={password} onChangeText={setPassword} autoCorrect={false}
        autoCapitalize='none'/>
        </View>

        <View style={styles.buttonView}>
         <Pressable style={styles.cusButton} onPress={fetchLogin}>
              <Text style={styles.cusText}>Login</Text>
          </Pressable>
        </View>
        
        <Image source={receBottomLogo} style={styles.bottomLogo} />
        </View>
    )
}

const styles = StyleSheet.create({
    container : {
      alignItems : "center",
      paddingTop:Dimensions.get('window').height * 0.2,
    },
    image : {
      height : 160,
      width : 300,
      resizeMode:'contain'
    },
    cusButton: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 10,
      paddingHorizontal: 30,
      borderRadius: 4,
      elevation: 3,
      backgroundColor: "#99c2ff",
    },
    cusText: {
      fontSize: Dimensions.get('window').fontScale * 17,
      fontWeight: 'bold',
      letterSpacing: 0.25,
      color: Color.blackRecColor,
    },
    bottomLogo : {
      marginTop:100,
      height : 60,
      width : 60,
      resizeMode:'contain'
    },
    title : {
      fontSize : 32,
      fontFamily:Fonts.recFontFamily.titleRecFont,
      textAlign: "center",
      color : '#99c2ff'
    },
    inputView : {
      gap : 5,
      width : "100%",
      paddingHorizontal : 40,
      marginBottom:5
    },
    input : {
      height : 50,
      paddingHorizontal : 20,
      borderColor : "black",
      color:'#464646',
      borderBottomWidth:1,
      borderRadius: 50
    },
    rememberView : {
      width : "100%",
      paddingHorizontal : 50,
      justifyContent: "space-between",
      alignItems : "center",
      flexDirection : "row",
      marginBottom : 8
    },
    switch :{
      flexDirection : "row",
      gap : 1,
      justifyContent : "center",
      alignItems : "center"
      
    },
    button : {
      backgroundColor : "#2D8517",
      height : 38,
      borderColor : "gray",
      borderWidth  : 1,
      borderRadius : 1,
      alignItems : "center",
      justifyContent : "center"
    },
    buttonText : {
      color : Color.whiteRecColor,
      fontSize: 18,
      fontWeight : "bold"
    }, 
    buttonView :{
      marginTop:30,
      width :"100%",
      paddingHorizontal : 60
    },
    optionsText : {
      textAlign : "center",
      paddingVertical : 10,
      color : Color.blackRecColor,
      fontSize : 13,
      marginBottom : 6
    },
    icons : {
      width : 40,
      height: 40,
    },
    footerText : {
      textAlign: "center",
      color : "gray",
    },
    signup : {
      color : "red",
      fontSize : 13
    },
    dropdown: {
      height: 50,
      borderBottomColor: Color.blackRecColor,
      borderBottomWidth: 1,
      marginHorizontal : 20,
      color:Color.blackRecColor
    },
    icon: {
      marginRight: 5,
    },
    placeholderStyle: {
      fontSize: 16,
      color:Color.blackRecColor
    },
    selectedTextStyle: {
      fontSize: 16,
      color:Color.blackRecColor
    },
    iconStyle: {
      width: 20,
      height: 20,
    },
    inputSearchStyle: {
      height: 40,
      fontSize: 16,
      color:Color.blackRecColor
    },
  })

export default LoginScreen
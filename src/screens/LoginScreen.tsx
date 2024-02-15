"use strict"
import { Image, Text, View, TextInput, StyleSheet, Button, Dimensions } from "react-native"
import Color from "../theme/Color"
import Fonts from "../theme/Fonts"
import { useState } from "react";
import React from "react";
import { PostUserLogin } from "../requests/recLooginRequest";
import axios from "axios";
import { ApiConfig } from "../constants/RecConfig";
import { ServerConfig } from "../constants/RecServerconf";
import { ServerEndpoints } from "../constants/RecEndpoints";
import { StoreValue } from "../wrapper/storedata.wrapper";
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
      let result = await PostUserLogin(payload)
      if(result?.data.Status){
        StoreValue("EZ_LOGIN_DET",result.data.Data[0])
        let userLocations = result.data.Data[1]
        navigation.navigate('Location',{userLocations})
      }else{
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
            <Button title="Login" color={Color.greenRecColor}  onPress={fetchLogin}>
            </Button>
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
      color : Color.violetRecColor
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
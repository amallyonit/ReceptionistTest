import { SafeAreaView, Image, Text, View, TextInput, Pressable, Alert, StyleSheet, Button } from "react-native"
import Color from "../theme/Color"
import Fonts from "../theme/Fonts"
import { useState } from "react";
import React from "react";
const receLogo =  require('../../assets/recimages/Frame.png')
const receBottomLogo = require('../../assets/recimages/Group.png')

const LoginScreen = ({navigation}:any) =>{
    const [click,setClick] = useState(false);
    const [username,setUsername]=  useState("");
    const [password,setPassword]=  useState("");
    const [location,setLocation]= useState("")

    return(
        <View style={styles.container}>
      
        <Image source={receLogo} style={styles.image} />
        <Text style={styles.title}>Receptionist</Text>
        <View style={styles.inputView}>
            <TextInput style={styles.input} placeholder='User ID' value={username} onChangeText={setUsername} autoCorrect={false}
        autoCapitalize='none' />
            <TextInput style={styles.input} placeholder='Password' secureTextEntry value={password} onChangeText={setPassword} autoCorrect={false}
        autoCapitalize='none'/>
                    <TextInput style={styles.input} placeholder='Location' value={location} onChangeText={setLocation} autoCorrect={false}
        autoCapitalize='none'/>
        </View>

        <View style={styles.buttonView}>
            <Button title="Login" color={Color.greenRecColor}  onPress={() => navigation.navigate("Home")}>
            </Button>
        </View>
        
        <Image source={receBottomLogo} style={styles.bottomLogo} />
        </View>
    )
}

const styles = StyleSheet.create({
    container : {
      alignItems : "center",
      paddingTop: 70,
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
      color : "gray",
      fontSize : 13,
      marginBottom : 6
    },
    mediaIcons : {
      flexDirection : "row",
      gap : 15,
      alignItems: "center",
      justifyContent : "center",
      marginBottom : 23
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
    }
  })

export default LoginScreen
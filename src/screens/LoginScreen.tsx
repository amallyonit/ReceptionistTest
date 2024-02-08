import { SafeAreaView, Image, Text, View, TextInput, Pressable, Alert, StyleSheet, Button, Dimensions } from "react-native"
import Color from "../theme/Color"
import Fonts from "../theme/Fonts"
import { useState } from "react";
import React from "react";
import { Dropdown } from "react-native-element-dropdown";
const receLogo =  require('../../assets/recimages/Frame.png')
const receBottomLogo = require('../../assets/recimages/Group.png')

const LoginScreen = ({navigation}:any) =>{
    const [click,setClick] = useState(false);
    const [username,setUsername]=  useState("");
    const [password,setPassword]=  useState("");
    const [location,setLocation]= useState("")
    const [value, setValue] = useState("");
    const data = [
      { label: 'Item 1', value: '1' },
      { label: 'Item 2', value: '2' },
      { label: 'Item 3', value: '3' },
      { label: 'Item 4', value: '4' },
      { label: 'Item 5', value: '5' },
      { label: 'Item 6', value: '6' },
      { label: 'Item 7', value: '7' },
      { label: 'Item 8', value: '8' },
    ];
  

    return(
        <View style={styles.container}>
      
        <Image source={receLogo} style={styles.image} />
        <Text style={styles.title}>Receptionist</Text>
        <View style={styles.inputView}>
            <TextInput style={styles.input} placeholderTextColor={Color.blackRecColor} placeholder='User ID' value={username} onChangeText={setUsername} autoCorrect={false}
        autoCapitalize='none' />
            <TextInput style={styles.input} placeholderTextColor={Color.blackRecColor} placeholder='Password' secureTextEntry value={password} onChangeText={setPassword} autoCorrect={false}
        autoCapitalize='none'/>
              <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={data}
        itemTextStyle={{color:Color.blackRecColor}}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder="Location"
        searchPlaceholder="Search..."
        value={value}
        onChange={item => {
          setValue(item.value);
        }}
      />
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
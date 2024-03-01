import React, { useEffect, useState } from "react"
import { Image, StyleSheet, View } from "react-native"
import Color from "../theme/Color"
import Fonts from "../theme/Fonts"
const logoImage = require('../../assets/EzEntry-removebg-preview.png')
const SplashEzEntryScreen = ({navigation}:any)=>{
    console.log("nav ",navigation)
    useEffect(()=>{
        console.log("time out")
            setTimeout(()=>{
                console.log("1 sec timeoout")
                navigation.navigate('Login')
            },1000)
            navigation.navigate('Login')
    },[])
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
import React, { useEffect, useState } from "react"
import { StyleSheet, Text, View } from "react-native"
import Color from "../theme/Color"
import Fonts from "../theme/Fonts"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"

const SplashEzEntryScreen = ({navigation}:any)=>{
    const [splash,setSplash] = useState(false)
    useEffect(()=>{
        setTimeout(()=>{
            setSplash(true)
        },1000)
        if(splash){
        navigation.navigate('Login')
        }
    })
    return(
        <View style={styles.centeredView}>
            <Text style={styles.entryText}><Icon name="pen" size={20} color={Color.blueRecColor}></Icon>EzEntry</Text>
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
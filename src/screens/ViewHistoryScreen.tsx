import React from "react"
import { StyleSheet, Text, View } from "react-native"
import Color from "../theme/Color"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import Fonts from "../theme/Fonts"

const ViewHistoryScreen = ({navigation}:any) =>{

    return (
        <View>
        <View style={styles.container}>
        <View style={{width:'100%',backgroundColor:Color.greenRecColor,height:60,alignItems:'center',flexDirection:'row'}}>
        <Text style={{color:Color.whiteRecColor,fontSize:16,flex:1.6,marginLeft:15}}>
            <Icon onPress={() =>
               navigation.navigate("Home")
               } name="arrow-left" size={28} color={Color.whiteRecColor}></Icon>
        </Text>
            <Text style={{marginLeft:10,color:Color.whiteRecColor,fontSize:18,fontFamily:Fonts.recFontFamily.titleRecFont,flex:2}}>View History</Text>
        </View>
        </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
    },
})

export default ViewHistoryScreen
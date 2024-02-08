import React from "react"
import { StyleSheet, Text, View } from "react-native"
import Color from "../theme/Color"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import Fonts from "../theme/Fonts"
import CommonStrings from "../theme/CommonStrings"
import { InfoFormProps } from "../models/RecepModels"

const FormDeliveryScreen = ({route,navigation}:any) => {
    const data:InfoFormProps=route.params['propData']
    return (
        <View>
        <View style={styles.container}>
        <View style={{width:'100%',backgroundColor:Color.greenRecColor,height:60,alignItems:'center',flexDirection:'row'}}>
        <Text style={{color:Color.whiteRecColor,fontSize:16,flex:1.6,marginLeft:15}}>
            <Icon onPress={() =>
               navigation.navigate("Home")
               } name="arrow-left" size={28} color={Color.whiteRecColor}></Icon>
        </Text>
            <Text style={{marginLeft:10,color:Color.whiteRecColor,fontSize:18,fontFamily:Fonts.recFontFamily.titleRecFont,flex:2}}>{data.appBarTitle}</Text>
        </View>
        </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: Color.greenRecColor,
        height: 60,
        alignItems: 'center',
        flexDirection: 'row'
    },
    rowContainer: {
        paddingHorizontal: 20
    },
    rowBox: {
        width: "100%",
        height: "85%",
        alignItems: "center",
        flexDirection: 'row',
        flexWrap: 'wrap',   
        paddingHorizontal:20,
        marginTop:15 
      },
      box: {
        width: "50%",
        height: "50%",
        padding: 5
      },
      delButton:{
        width:120,
        height:30,
        borderWidth:1,
        borderColor:Color.greenRecColor
      },
      delText:{
        textAlign:'center'
      },
     backButton: {
        color: Color.whiteRecColor,
        fontSize: 16,
        flex: 1,
        marginLeft: 10
    },
    titleText: {
        marginLeft: 10,
        color: Color.whiteRecColor,
        fontSize: 18,
        fontFamily: Fonts.recFontFamily.titleRecFont,
        flex: 2
    }
})
export default FormDeliveryScreen 
import React from "react"
import { Image, Linking, Pressable, StyleSheet, Text, TextInput, View } from "react-native"
import Color from "../theme/Color"
import Fonts from "../theme/Fonts"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import RecepAutocomplete from "../components/RecpAutoComplete";
import { InfoFormProps } from "../models/RecepModels";

const camLogo = require("../../assets/recscreen/CAMERA.png")

const FormScreen = ({route,navigation}:any) => {
    console.log("type ",navigation,route.params)
    const data:InfoFormProps = route.params["propData"]
    console.log("data ",data)
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
            <View style={styles.inputView}>
                <TextInput style={styles.input} placeholder='Mobile No' autoCapitalize='none' />
                <TextInput style={styles.input} placeholder='Name' autoCapitalize='none' />
                <TextInput style={styles.input} placeholder='From' autoCapitalize='none' />
                <TextInput style={styles.input} placeholder='Purpose' autoCapitalize='none' />
                <TextInput style={styles.input} placeholder='Purpose' autoCapitalize='none' />
                <TextInput style={styles.input} placeholder="Company name" autoCapitalize='none'></TextInput>
                <TextInput style={styles.input} placeholder='Meeting with' autoCapitalize='none' />
                <TextInput keyboardType="numeric" style={styles.input} placeholder='No of Visitors' autoCapitalize='none' />
                <RecepAutocomplete></RecepAutocomplete>
            </View>
            <View style={styles.boxRow}>
                <View style={styles.uploadBox}>
                    <Image source={camLogo} style={styles.imageSize}></Image>
                </View>
                <View style={styles.uploadBox}>
                    <View style={styles.outlineButton}>
                        <Text style={styles.buttonText}>Send Request <Icon name="send" size={15} color={Color.blackRecColor}></Icon> </Text>
                    </View>
                    <View style={styles.statusView}>
                        <Text style={styles.statusText}>Status <Icon name="check-circle" size={15} color={Color.blackRecColor}></Icon></Text>
                    </View>
                </View>
            </View>
            <View style={styles.remarkInputView}>
            <View>
                <Text style={{marginLeft:20,textAlign:'center',color:'blue',width:100,borderBottomWidth:1,borderBottomColor:'blue',marginBottom:10}} onPress={() => Linking.openURL('https://google.com')}>Take Photo</Text>
            </View>
                <TextInput placeholder="Remarks" style={styles.remarkInput}></TextInput>
            </View>
        </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
    },
    statusView:{
        marginLeft:'auto',
        marginRight:40,
        marginTop:40,
        height:35,
        textAlign:'center'
    },
    statusText:{
        color:Color.blackRecColor,
    },
    imageSize:{
        marginTop:10,
        width:150,
        height:150
    },
    buttonText : {
        color : Color.blackRecColor,
        fontSize: 14, 
        paddingTop:6,
        textAlign:'center',
      }, 
    outlineButton:{
        marginLeft:'auto',
        marginTop:10,
        height:35,
        width:130,
        borderWidth:1,
        borderColor:Color.greenRecColor,
        textAlign:'center'
    },
    boxRow:{
        flex:1,
        flexDirection:'row',
        flexWrap:'wrap',
        alignItems:'flex-start',
        width : "100%",
        paddingHorizontal : 30,
    },
    uploadBox:{
        width:'50%',
    },
    inputView : {
        marginTop:30,
        gap : 3,
        width : "100%",
        paddingHorizontal : 10,
        marginBottom:5
      },
      input : {
        height : 40,
        paddingHorizontal : 20,
        borderColor : "black",
        color:'#464646',
        borderBottomWidth:1,
        borderRadius: 50
      },
    remarkInputView:{
        marginTop:160,
        width:'100%',
        padding: 20,
    },
    remarkInput:{
        textAlign:'justify',
        height:137,
        justifyContent:'flex-start',
        backgroundColor:Color.lightGreyRecColor

    }
})

export default FormScreen
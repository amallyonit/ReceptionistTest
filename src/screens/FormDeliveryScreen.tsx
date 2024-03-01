"use strict"
import React, { useState } from "react"
import { Dimensions, Image, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from "react-native"
import Color from "../theme/Color"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import Fonts from "../theme/Fonts"
import { DelpickData, InfoFormProps } from "../models/RecepModels"
import { ListItem } from "react-native-elements"
import LinearGradient from "react-native-linear-gradient"
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
const camLogo = require("../../assets/recscreen/CAMERA.png")

const FormDeliveryScreen = ({route,navigation}:any) => {
    const data:InfoFormProps=route.params['propData']
    let dataList = DelpickData
    const [date, setDate] = useState(new Date(1598051730000));
    const onChange = (event:any, selectedDate:any) => {
      const currentDate = selectedDate;
      setDate(currentDate);
    };
  
    const showMode = (currentMode:any) => {
      DateTimePickerAndroid.open({
        value: date,
        onChange,
        mode: currentMode,
        is24Hour: true,
      });
    };
    const showDatepicker = () => {
        showMode('date');
      };
  


    return (
        <SafeAreaView>
                    <View style={styles.container}>        
        <View style={styles.boxRow}>
                <Pressable style={styles.uploadBox}>
                    <Pressable style={styles.cusButton}>
                        <Text style={{color:Color.blackRecColor,padding:10,textAlign:'center',fontSize:18}}>
                            Delivery
                        </Text>
                    </Pressable>
                </Pressable>
                <Pressable style={styles.uploadBox}>

                </Pressable>
                <Pressable style={styles.uploadBox}>
                    <Pressable style={styles.cusButton}>
                        <Text style={{color:Color.blackRecColor,padding:10,textAlign:'center',fontSize:18}}>Pickup</Text>
                    </Pressable>
                </Pressable>
            </View>
            <View style={styles.inputView}>
                <TextInput placeholderTextColor={Color.blackRecColor} style={styles.input} placeholder='Vehicle No.' autoCapitalize='none' />
                <TextInput placeholderTextColor={Color.blackRecColor} style={styles.input} placeholder='Driver Mobile No.S' autoCapitalize='none' />
                <TextInput placeholderTextColor={Color.blackRecColor} style={styles.input} placeholder='Driver Name' autoCapitalize='none' />
                <TextInput placeholderTextColor={Color.blackRecColor} style={styles.input} placeholder='Transporter Name' autoCapitalize='none' />
            </View>
            <View style={styles.boxRow1}>
                <View style={{backgroundColor:Color.lightGreyRecColor,flex:1,marginHorizontal:22,flexDirection:"row",flexWrap:"wrap"}}>
                <TextInput placeholderTextColor={Color.blackRecColor} style={[styles.input,{width:'70%'}]} placeholder='Bill Number' autoCapitalize='none' />
                <TextInput placeholderTextColor={Color.blackRecColor} value={date.toLocaleString()} onPressIn={showDatepicker} style={[styles.input,{width:'30%'}]} placeholder='Date' autoCapitalize='none' />
                <TextInput placeholderTextColor={Color.blackRecColor} style={[styles.input,{width:'100%'}]} placeholder='Party Name' autoCapitalize='none' />
                <Pressable style={[styles.uploadBox2,{marginLeft:'auto',marginTop:10,marginRight:12}]}>
                    
                    <Pressable style={styles.cusButton1}>
                        <Text style={{color:Color.blackRecColor,padding:8,textAlign:'center',fontSize:18}}>
                            Add <Icon name="plus-circle-outline" size={20}></Icon>
                        </Text>
                    </Pressable>
                </Pressable>
                <View style={{ width: '100%'}}>
                    {
                        dataList.map((item, index) => (
                            <ListItem
                                linearGradientProps={{
                                    colors: [Color.lightGreyRecColor, Color.lightGreyRecColor],
                                }}
                                ViewComponent={LinearGradient} key={index} bottomDivider>
                                <ListItem.Content>
                                    <ListItem.Title>Bill Number: {item.billnumber}</ListItem.Title>
                                    <ListItem.Subtitle>Part Name:{item.partyname}</ListItem.Subtitle>
                                </ListItem.Content>
                            </ListItem>
                        ))
                    }
                </View>
                </View>
            </View>
            <View style={styles.boxRow2}>
            <View style={styles.uploadBox}>
                        <Image source={camLogo} style={styles.imageSize}></Image>
                    </View>
                    <View style={styles.uploadBox}></View>
                    <View style={styles.uploadBox}>
                        <View style={styles.outlineButton}>
                            <Text style={styles.buttonText}>Send Request <Icon name="send" size={15} color={Color.blackRecColor}></Icon> </Text>
                        </View>
                        <View style={styles.statusView}>
                            <Text style={styles.statusText}>Status <Icon name="check-circle" size={18} color={Color.blackRecColor}></Icon></Text>
                        </View>
                    </View>
            </View>
        </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 60,
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
    rowContainer: {
        paddingHorizontal: 20
    },boxRow: {
        marginTop:50,
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: "100%",
        paddingHorizontal:20
    },
    boxRow2: {
        marginTop:Dimensions.get('window').height * 0.06,
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: "100%",
        paddingHorizontal:20
    },
    boxRow1: {
        marginTop:30,
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: "100%",
    },
    outlineButton:{
        marginLeft:'auto',
        marginTop:10,
        height:35,
        width:125,
        borderRadius:4,
        backgroundColor: Color.blueRecColor,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        elevation: 9,
        textAlign:'center'
    },
    uploadBox: {
        width: '33.3%',
    },
    uploadBox2:{
        width:'20%'
    },
    cusButton: {
        borderRadius:4,
        backgroundColor: Color.blueRecColor,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        elevation: 9,
        height:45,
      },
      cusButton1: {
        borderRadius:4,
        backgroundColor: Color.blueRecColor,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        elevation: 9,
        height:45,
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
    },
    inputView : {
        marginTop:30,
        gap : 10,
        width : "100%",
        paddingHorizontal : 10,
        marginBottom:5
      },
      input : {
        height : 40,
        paddingHorizontal : 20,
        borderColor :Color.blackRecColor,
        color:'#464646',
        borderBottomWidth:1,
        borderRadius: 50
      },
})
export default FormDeliveryScreen 
import React, { JSX, ReactElement, useEffect } from "react";
import { useState } from "react";
import { Alert, Dimensions, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import Color from "../theme/Color";
import { Icon, Image } from "react-native-elements";
import Fonts from "../theme/Fonts";

const camLogo = require("../../assets/recscreen/CAMERA.png")

const NotificationPop = ():JSX.Element =>{
    const [isModalVisible,setIsModalVisible] = useState(true)
    const details:any=''
    useEffect(()=>{
    },[])
    return(
        <Modal
        animationType="fade"
        transparent={false}
        statusBarTranslucent={true}
        visible={isModalVisible}
        onRequestClose={() => {
            Alert.alert('User Cancelled!');
        }}>
        <View style={styles.centeredView}>
            <View style={styles.modalView}>
            <Icon style={styles.iconStyle} color={Color.whiteRecColor} size={40} name="notifications-none" />
                <Text style={styles.modalTitleStyle}>You've got a Delivery at the main gate</Text>
                <View style={styles.hairline}></View>
                <View style={styles.modalContentStyle}>
                    <View style={{width:'30%'}}>
                    {details != "" ? <Image
                                source={{ uri:`data:image/png;base64,${details.VisitorImage}` }}
                                style={{height:70,width:70,borderRadius:100}}></Image> : 
                                <Image source={camLogo} style={{height:70,width:70,borderRadius:100}} />}
                    </View>
                    <View style={{width:'70%',flexDirection:'row',justifyContent:'flex-start',alignItems:'center'}}>
                        <Text style={{fontSize:18,color:Color.blackRecColor}}>{details.VisitorName}</Text>
                    </View>
                </View>
                <View style={styles.hairline}></View>
                <View style={{flexDirection:'row',
                paddingHorizontal:10,marginTop:10,
                borderRadius:10,backgroundColor:Color.whiteRecColor}}>
                    <View style={{width:Dimensions.get('window').width > 1024? '23%':'23%'}}>
                        <Pressable android_ripple={{color:Color.redRecColor,borderless:true}} onPress={()=>{setIsModalVisible(false)}}>
                        <Icon style={{borderRadius:100,borderColor:Color.redRecColor,
                        shadowColor: Color.redRecColor,
                        shadowOffset: {
                            width: 0,
                            height: 12,
                        },
                        shadowOpacity: 0.1,
                        shadowRadius: 50,
                        elevation: 0.1                        
                        }} color={Color.redRecColor} size={60} name="cancel"></Icon>
                        </Pressable>  
                    </View>
                    <View style={{width:'54%'}}></View>
                    <View style={{width:Dimensions.get('window').width > 1024? '23%':'23%'}}>
                    <Pressable android_ripple={{color:Color.greenRecColor,borderless:true}} onPress={(item)=>{setIsModalVisible(false)}}>
                    <Icon style={{borderRadius:100,borderColor:Color.greenRecColor,
                    shadowColor: Color.greenRecColor,
                    shadowOffset: {
                        width: 0,
                        height: 12,
                    },
                    shadowOpacity: 0.1,
                    shadowRadius: 20,
                    elevation: 0.1
                    }} color={Color.greenRecColor} size={60} name="check-circle"></Icon>
                    </Pressable>
                    </View>
                </View>
            </View>
        </View>
    </Modal>
    )
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    iconStyle:{
        borderWidth:2,
        borderRadius:100,
        borderColor:Color.blueRecColor,
        backgroundColor:Color.blueRecColor,
        position:'relative',
        marginTop:5
    },
    modalTitleStyle:{
        color:Color.blackRecColor,
        fontFamily:Fonts.recFontFamily.titleRecFont,
        fontSize:Dimensions.get('window').fontScale * 21,
        textAlign:'center',
        margin:10
    },
    modalContentStyle:{
        flexDirection:'row',flexWrap:'wrap',
        borderRadius:10,padding:10,
        justifyContent:'flex-start',marginTop:5,
        backgroundColor:Color.whiteRecColor
    },
    modalView: {
        margin: 10,
        width:'90%',
        backgroundColor: Color.whiteRecColor,
        borderRadius: 15,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 10,
        paddingHorizontal:20,
        paddingVertical:5,
        elevation: 2,
    },
    buttonClose: {
        backgroundColor: Color.blueRecColor,
    },
    textStyle: {
        color: Color.whiteRecColor,
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize:20
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
        color:Color.blueRecColor,
        fontSize:Dimensions.get('window').fontScale * 20
    },
    hairline: {
        marginTop:5,
        marginBottom:5,
        backgroundColor: Color.lightGreyRecColor,
        height: 2,
        width: '100%'
      },
      
      loginButtonBelowText1: {
        fontFamily: 'AvenirNext-Bold',
        fontSize: 14,
        paddingHorizontal: 5,
        alignSelf: 'center',
        color: '#A2A2A2'
      },
})

export default NotificationPop
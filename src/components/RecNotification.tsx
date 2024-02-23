import React, { ReactElement, useEffect } from "react";
import { useState } from "react";
import { Alert, Dimensions, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import Color from "../theme/Color";
import { Icon, Image } from "react-native-elements";
import Fonts from "../theme/Fonts";

const camLogo = require("../../assets/recscreen/CAMERA.png")

export const NotificationPop = ({confirm}:{confirm:boolean}):ReactElement =>{
    const [isModalVisible,setIsModalVisible] = useState(false)
    useEffect(()=>{
        if(confirm){
            setIsModalVisible(true)
        }else{
            setIsModalVisible(false)
        }
    },[])
    return(
        <Modal
        animationType="fade"
        transparent={false}
        statusBarTranslucent={true}
        visible={isModalVisible}
        onRequestClose={() => {
            Alert.alert('Network Error !');
            setIsModalVisible(!isModalVisible);
        }}>
        <View style={styles.centeredView}>
            <View style={styles.modalView}>
            <Icon style={{borderWidth:2,borderRadius:100,borderColor:Color.blueRecColor,backgroundColor:Color.blueRecColor,position:'relative',marginTop:10,zIndex:2}} color={Color.whiteRecColor} size={40} name="notifications-none"></Icon>
                <Text style={{fontFamily:Fonts.recFontFamily.titleRecFont,fontSize:Dimensions.get('window').fontScale * 16,margin:10}}>You've got a Delivery at the main gate</Text>
                <View style={{flexDirection:'row',flexWrap:'wrap',justifyContent:'flex-start',marginTop:5}}>
                    <View style={{width:'30%'}}>
                    <Image source={camLogo} style={{height:70,width:70,borderRadius:100}} />
                    </View>
                    <View style={{width:'70%',flexDirection:'row',justifyContent:'flex-start',alignItems:'center'}}>
                        <Text style={{fontSize:18}}>Sivadarsh s</Text>
                        {/* <Icon style={{marginLeft:'auto'}} name="phone" color={Color.blueRecColor}></Icon> */}
                    </View>
                </View>
                <View style={{flexDirection:'row',paddingHorizontal:10,marginTop:10}}>
                    <View style={{width:'30%'}}>
                        <Pressable android_ripple={{color:Color.redRecColor,borderless:true}}>
                        <Icon style={{borderRadius:100,borderColor:Color.redRecColor}} color={Color.redRecColor} size={60} name="cancel"></Icon>
                        </Pressable>  
                    </View>
                    <View style={{width:'40%'}}></View>
                    <View style={{width:'30%'}}>
                    <Pressable android_ripple={{color:Color.greenRecColor,borderless:true}}>
                    <Icon style={{borderRadius:100,borderColor:Color.greenRecColor}} color={Color.greenRecColor} size={60} name="check-circle"></Icon>
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
    modalView: {
        margin: 10,
        // borderTopColor:Color.blueRecColor,
        // borderTopWidth:10,
        width:'45%',
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
        margin:10,
        backgroundColor: Color.lightRecBlue,
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
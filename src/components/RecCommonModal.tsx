import React, { ReactElement, useEffect } from "react";
import { useState } from "react";
import { Alert, Dimensions, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import Color from "../theme/Color";

export const CommonModal = ({confirm}:{confirm:boolean}):ReactElement =>{
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
        transparent={true}
        statusBarTranslucent={true}
        visible={isModalVisible}
        onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setIsModalVisible(!isModalVisible);
        }}>
        <View style={styles.centeredView}>
            <View style={styles.modalView}>
                <Text style={styles.modalText}>Successfully Added</Text>
                <Pressable
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => setIsModalVisible(!isModalVisible)}>
                    <Text style={styles.textStyle}>Ok</Text>
                </Pressable>
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
        width:'60%',
        backgroundColor: Color.lightRecBlue,
        borderRadius: 20,
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
})
import React, { useState } from "react"
import { Dimensions, FlatList, Image, ScrollView, StyleSheet, Text, TextInput, View } from "react-native"
import Color from "../theme/Color"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import Fonts from "../theme/Fonts"
import { ViewHistoryList } from "../models/RecepModels"
import { ListItem } from "react-native-elements"
import LinearGradient from 'react-native-linear-gradient';
const camLogo = require("../../assets/recscreen/CAMERA.png")
const minHe = Dimensions.get('window')

const ViewHistoryScreen = ({ navigation }: any) => {
    let phonenumber:any
    let data = ViewHistoryList
    const filterHistory = (event:any)=>{
        console.log("value",event.nativeEvent.text)
            data = ViewHistoryList.filter((item)=>item.phonenumber==event.nativeEvent.text)
            console.log("list ",data)
    }
    console.log("type ", minHe.height)
    return (
        <View>
            <View style={styles.container}>
                <View style={styles.navContainer}>
                    <Text style={styles.navContText}>
                        <Icon onPress={() =>
                            navigation.navigate("Home")
                        } name="arrow-left" size={28} color={Color.whiteRecColor}></Icon>
                    </Text>
                    <Text style={{ marginLeft: 10, color: Color.whiteRecColor, fontSize: 18, fontFamily: Fonts.recFontFamily.titleRecFont, flex: 2 }}>View History</Text>
                </View>

                <View style={styles.boxRow}>
                    <View style={styles.uploadBox}>
                        <View style={styles.inputView}>
                            <TextInput value={phonenumber} placeholderTextColor={Color.blackRecColor} onChange={(event)=>filterHistory(event)} style={styles.input} keyboardType="numeric" placeholder='Mobile No.' autoCapitalize='none' />
                            <TextInput style={styles.input} placeholderTextColor={Color.blackRecColor} keyboardType="default" placeholder='Name' autoCapitalize='none' />
                        </View>
                    </View>
                    <View style={styles.uploadBox1}>
                        <Image source={camLogo} style={styles.imageSize}></Image>
                    </View>
                </View>
                <View style={{ width: '95%',marginLeft:10, paddingTop:Dimensions.get('window').height * 0.14}}>
                <ScrollView style={{maxHeight:Dimensions.get('window').height * 0.76,width:'100%',overflow:'scroll'}}>
                    {
                        data.map((item, index) => (
                            <ListItem
                                linearGradientProps={{
                                    colors: [Color.lightGreyRecColor, Color.lightGreyRecColor],
                                }}
                                ViewComponent={LinearGradient} key={index} bottomDivider>
                                <ListItem.Content>
                                    <ListItem.Title>{item.description}</ListItem.Title>
                                    <ListItem.Subtitle>{item.purpose}</ListItem.Subtitle>
                                </ListItem.Content>
                            </ListItem>
                        ))
                    }
                </ScrollView>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
    },
    navContainer:{ width: '100%', backgroundColor: Color.greenRecColor, height: 60, alignItems: 'center', flexDirection: 'row' },
    navContText:{ color: Color.whiteRecColor, fontSize: 16, flex: 1.6, marginLeft: 15 },
    boxRow: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: "100%",
        paddingHorizontal: Dimensions.get('window').width * 0.03,
    },
    uploadBox: {
        width: '80%',
        paddingTop:Dimensions.get('window').height * 0.01
    },
    imageSize: {
        marginTop: Dimensions.get('window').height * 0.02,
        width: Dimensions.get('window').width * 0.2,
        height: Dimensions.get('window').height * 0.1,
    },
    uploadBox1: {
        width: '20%',
    },
    inputView: {
        marginTop: 10,
        gap: 3,
        width: "100%",
        paddingHorizontal: 10,
        marginBottom: 5
    },
    input: {
        height: 40,
        paddingHorizontal: 20,
        borderColor: Color.blackRecColor,
        color: Color.blackRecColor,
        borderBottomWidth: 1,
        borderRadius: 50
    },
})

export default ViewHistoryScreen
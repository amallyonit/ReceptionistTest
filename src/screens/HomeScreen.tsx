"use strict"
import React from "react"
import { Dimensions, Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import Fonts from "../theme/Fonts"
import Color from "../theme/Color"
import LinearGradient from "react-native-linear-gradient"
import { InfoFormProps, RecpImgArray } from "../models/RecepModels"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"

const receLogo = require('../../assets/recimages/Frame.png')
const receMeetLog = require('../../assets/recscreen/MEETING.png')
const receVisitLog = require('../../assets/recscreen/VISIT.png')
const receServeLog = require('../../assets/recscreen/SERVICE.png')
const receContrLog = require('../../assets/recscreen/CONTRACTOR.png')
const receInterLog = require('../../assets/recscreen/INTERVIEW.png')
const receDelLog = require('../../assets/recscreen/DELIVERY.png')
const receBottomLogo = require('../../assets/recimages/Group.png') 

const HomeScreen = ({ route,navigation }: any) => {
    let propData:InfoFormProps = {
        type:'',
        locations:[],
        appBarTitle:'',
        category:0
    }
    const checkFormScreen=(type:any)=>{
        
        switch (type) {
            case 'MEETING':
                propData = {
                    appBarTitle:'Meeting',
                    type:type,
                    locations:route.params['userLocations'],
                    category:1
                }
                navigation.navigate('Form',{propData})
                break;
            case 'VISIT':
                propData = {
                    appBarTitle:'Visit',
                    type:type,
                    locations:route.params['userLocations'],
                    category:2
                }
                navigation.navigate('Form',{propData})
                break;
            case 'SERVICE':
                propData = {
                    appBarTitle:'Service',
                    type:type,
                    locations:route.params['userLocations'],
                    category:3
                }
                navigation.navigate('Form',{propData})
                break;
            case 'CONTRACTOR':
                propData = {
                    appBarTitle:'Contractor',
                    type:type,
                    locations:route.params['userLocations'],
                    category:4
                }
                navigation.navigate('Form',{propData})
                break;
            case 'INTERVIEW':
                propData = {
                    appBarTitle:'Interview',
                    type:type,
                    locations:route.params['userLocations'],
                    category:5
                }
                navigation.navigate('Form',{propData})
                break;
            case 'DELIVERYPICK':
                    propData = {
                        appBarTitle:'Delivery / Pickup',
                        type:type,
                        locations:route.params['userLocations'],
                        category:6
                    }
                    navigation.navigate('PickDel',{propData})
                    break;
            default:
                break;
        }
    }

    return (
        <View style={styles.container}>
            <Image source={receLogo} style={styles.image} />
            <Text style={styles.title}>EzEntry</Text>
            <View style={styles.cardGroupContainer}>
                <LinearGradient colors={[Color.whiteRecColor, Color.whiteRecColor,Color.lightRecBlue]} style={styles.cardGroup}>
                    <TouchableOpacity onPress={()=>checkFormScreen('MEETING')} style={{ alignItems: 'center' }}>
                        <Image source={receMeetLog} style={styles.imageSet} />
                        <Text style={styles.buttonText}>
                            {RecpImgArray[0].name}
                        </Text>
                    </TouchableOpacity>
                </LinearGradient>
                <LinearGradient colors={[Color.whiteRecColor, Color.whiteRecColor, Color.lightRecBlue]} style={styles.cardGroup}>
                    <TouchableOpacity onPress={()=>checkFormScreen('VISIT')} style={{ alignItems: 'center' }}>
                        <Image source={receVisitLog} style={styles.imageSet} />
                        <Text style={styles.buttonText}>
                            {RecpImgArray[1].name}
                        </Text>
                    </TouchableOpacity>
                </LinearGradient>
                <LinearGradient colors={[Color.whiteRecColor, Color.whiteRecColor, Color.lightRecBlue]} style={styles.cardGroup}>
                    <TouchableOpacity onPress={()=>checkFormScreen('SERVICE')} style={{ alignItems: 'center' }}>
                        <Image source={receServeLog} style={styles.imageSet} />
                        <Text style={styles.buttonText}>
                            {RecpImgArray[2].name}
                        </Text>
                    </TouchableOpacity>
                </LinearGradient>
            </View>
            <View style={styles.cardGroupContainer}>
                <LinearGradient colors={[Color.whiteRecColor, Color.whiteRecColor, Color.lightRecBlue]} style={styles.cardGroup}>
                    <TouchableOpacity onPress={()=>checkFormScreen('CONTRACTOR')} style={{ alignItems: 'center' }}>
                        <Image source={receContrLog} style={styles.imageSet} />
                        <Text style={styles.buttonText}>
                            {RecpImgArray[3].name}
                        </Text>
                    </TouchableOpacity>
                </LinearGradient>
                <LinearGradient colors={[Color.whiteRecColor, Color.whiteRecColor, Color.lightRecBlue]} style={styles.cardGroup}>
                    <TouchableOpacity onPress={()=>checkFormScreen('INTERVIEW')} style={{ alignItems: 'center' }}>
                        <Image source={receInterLog} style={styles.imageSet} />
                        <Text style={styles.buttonText}>
                            {RecpImgArray[4].name}
                        </Text>
                    </TouchableOpacity>
                </LinearGradient>
                <LinearGradient colors={[Color.whiteRecColor, Color.whiteRecColor, Color.lightRecBlue]} style={styles.cardGroup}>
                    <TouchableOpacity onPress={()=>checkFormScreen('DELIVERYPICK')} style={{ alignItems: 'center' }}>
                        <Image source={receDelLog} style={styles.imageSet} />
                        <Text style={styles.buttonText}>
                            {RecpImgArray[5].name}
                        </Text>
                    </TouchableOpacity>
                </LinearGradient>
            </View>
            <View style={styles.boxRow}>
                <Pressable style={styles.uploadBox}>
                    <Pressable style={styles.cusButton}>
                        <Text style={styles.cusText}>Pre Approved <Icon name="check-circle-outline" size={Dimensions.get('window').fontScale * 16}></Icon></Text>
                    </Pressable>
                </Pressable>
                <Pressable style={styles.uploadBox}>
                    <Pressable style={styles.cusButton}>
                        <Text style={styles.cusText}>Check Out <Icon name="location-exit" size={Dimensions.get('window').fontScale * 16}></Icon>
                        </Text>
                    </Pressable>
                </Pressable>
            </View>
            <View style={styles.boxRow}>
                <Pressable style={styles.viewSec}>
                <Text onPress={()=>{navigation.navigate('History')}} style={styles.ViewText}>View History <Icon name="history" size={28} color={Color.blueRecColor}></Icon></Text>
                </Pressable>
            </View>
            <Image source={receBottomLogo} style={styles.bottomLogo} />
        </View>
    )
}

const cardGap = 26;
const cardWidth = (Dimensions.get('window').width - cardGap * 3) / 3;

const styles = StyleSheet.create({
    container: {
        paddingTop:Dimensions.get('window').height * 0.06,
        alignItems: "center",
        paddingHorizontal: 28
    },
    image: {
        height: 160,
        width: 300,
        resizeMode: 'contain'
    },
    imageSet: {
        width: Dimensions.get('window').width * 0.2,
        height: (Dimensions.get('window').height * 1) / 10,
        resizeMode:'contain'
    },
    viewSec:{
        flex:1,
        flexDirection:'row',
        justifyContent:'flex-end'
    },
    ViewText:{
        textAlign:'right',
        marginRight:5,
        borderBottomWidth:1,
        width:120,
        color:Color.blueRecColor,
        borderBottomColor:Color.blueRecColor,
    },
    cusButton: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: Color.blueRecColor,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        elevation: 9,
      },
      cusText: {
        fontSize: Dimensions.get('window').fontScale * 15,
        lineHeight: 21,
        fontWeight: '600',
        letterSpacing: 0.20,
        color: Color.blackRecColor,
      },
    bottomLogo: {
        marginTop:Dimensions.get('window').height * 0.02,
        height: 60,
        width: 60,
        resizeMode: 'contain'
    },
    title: {
        fontSize: 32,
        fontFamily: Fonts.recFontFamily.titleRecFont,
        textAlign: "center",
        fontWeight:'normal',
        color: Color.blueRecColor
    },
    button: {
        backgroundColor: 'green',
        width: '40%',
        height: 40
    },
    cardGroupContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        gap: 5
    },
    boxRow:{
        marginTop:Dimensions.get('window').height * 0.024,
        flexDirection:'row',
        width : "100%",
        gap:10
    },
    uploadBox:{
        width:'50%',
    },
    buttonRow:{
        justifyContent:'center'
    },
    buttonText: {
        color: Color.blackRecColor,
        fontSize: 14,
        fontWeight: "bold",
        textAlign:'center',
    },
    cardGroup: {
        marginTop: cardGap,
        marginLeft: 6,
        width: cardWidth,
        height: Dimensions.get('window').height * 0.2,
        backgroundColor: Color.whiteRecColor,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        elevation: 9,
    },
    homeButton: {
        marginVertical: '4%',
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderRadius: 4,
        backgroundColor: Color.greenRecColor,
        alignSelf: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: 6,
        minWidth: '30%',
        textAlign: 'center',
    }
})

export default HomeScreen
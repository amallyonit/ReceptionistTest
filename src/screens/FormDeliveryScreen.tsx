"use strict"
import React, { useEffect, useState } from "react"
import { Dimensions, Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native"
import Color from "../theme/Color"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import Fonts from "../theme/Fonts"
import { DelpickData, InfoFormProps, ItemDescription, UserLDData } from "../models/RecepModels"
import { CheckBox, ListItem } from "react-native-elements"
import LinearGradient from "react-native-linear-gradient"
import RNDateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import AsyncStorage from "@react-native-async-storage/async-storage"
import { MiscStoreKeys } from "../constants/RecStorageKeys"
const camLogo = require("../../assets/recscreen/CAMERA.png")

const FormDeliveryScreen = ({ route, navigation }: any) => {
    const data: InfoFormProps = route.params['propData']
    let dataList = DelpickData
    const [itemList, setItemList] = useState<ItemDescription[]>([])
    const [itemName, setitemName] = useState("")
    const [itemQty, setitemQty] = useState("")
    const [date, setDate] = useState(new Date());
    const [intime, setInTime] = useState(new Date())
    const [outtime, setOutTime] = useState(new Date())
    const [vehino, setVehino] = useState("")
    const [drivmob, setDrivMob] = useState("")
    const [drivname, setDriveName] = useState("")
    const [viewUser, setViewUser] = useState<UserLDData>()
    const [inout, setInOut] = useState(0)

    useEffect(() => {
        getUserData()
    }, [])
    const onChange = (event: any, selectedDate: any) => {
        const currentDate = selectedDate;
        setDate(currentDate);
    };

    const AddItem = () => {
        let data: ItemDescription = {
            itemDescription: itemName,
            itemQty: Number(itemQty)
        }
        setItemList([...itemList, data])
    }
    const showMode = (currentMode: any) => {
        DateTimePickerAndroid.open({
            value: date,
            onChange,
            mode: currentMode,
            is24Hour: true,
        });
    };
    const showDatepicker = () => {
        showMode('time');
    };

    const getUserData = async () => {
        setViewUser({ UserCode: '', UserDeviceToken: '', UserMobileNo: '', UserName: '', UserPassword: '', UserType: '', LocationPremise: '' })
        const data: any = await AsyncStorage.getItem(MiscStoreKeys.EZ_LOGIN)
        const vals = JSON.parse(data)
        console.log("data ", vals.Data[0][0])
        setViewUser(vals.Data[0][0])
    }

    return (
        <SafeAreaView>
            <ScrollView contentContainerStyle={{ width: '100%', alignItems: 'center', paddingBottom: 10 }}>
                <View style={{ marginTop: Dimensions.get('window').width > 756 ? 10 : 3.6, width: Dimensions.get('window').width > 756 ? '96%' : '85%', height: 20, alignItems: 'center', position: 'absolute', borderRadius: 5, backgroundColor: Color.blueRecColor, borderColor: Color.blueRecColor, borderWidth: 1 }}>
                    <Text style={{ color: Color.whiteRecColor, fontSize: 16, fontWeight: '500', textAlign: 'center' }}>{viewUser?.UserCode} - {viewUser?.LocationPremise}</Text>
                </View>
                <View style={styles.boxRow}>
                    <CheckBox
                        title={'Inward'}
                        checked={inout === 0}
                        onPress={() => setInOut(0)}
                        checkedIcon="dot-circle-o"
                        uncheckedIcon="circle-o"
                    />
                    <CheckBox
                        title={'Outward'}
                        checked={inout === 1}
                        onPress={() => setInOut(1)}
                        checkedIcon="dot-circle-o"
                        uncheckedIcon="circle-o"
                    />
                </View>
                <View style={styles.inputView}>
                    <TextInput placeholderTextColor={Color.blackRecColor} style={styles.input} placeholder='Vehicle No.' autoCapitalize='none' />
                    <View style={{ flexDirection: 'row' }}>
                        <TextInput placeholderTextColor={Color.blackRecColor} value={date.toLocaleTimeString()} onPressIn={showDatepicker} style={[styles.input, { width: '50%' }]} placeholder="InTime" />
                        <TextInput placeholderTextColor={Color.blackRecColor} value={date.toLocaleTimeString()} onPressIn={showDatepicker} style={[styles.input, { width: '50%' }]} placeholder="OutTime" />
                    </View>
                    <TextInput placeholderTextColor={Color.blackRecColor} style={styles.input} placeholder='Driver Mobile No.S' autoCapitalize='none' />
                    <TextInput placeholderTextColor={Color.blackRecColor} style={styles.input} placeholder='Driver Name' autoCapitalize='none' />
                    <TextInput placeholderTextColor={Color.blackRecColor} style={styles.input} placeholder='Transporter Name' autoCapitalize='none' />
                </View>
                <View style={styles.boxRow1}>
                    <View style={{ backgroundColor: Color.lightGreyRecColor, flex: 1, marginHorizontal: 22, flexDirection: "row", flexWrap: "wrap" }}>
                    <View style={{width:'85%'}}></View>
                        <View style={{width:'15%'}}>
                        <Pressable style={[styles.cusButton1,{marginRight:5,marginTop:5}]}>
                        <Text style={{ color: Color.blackRecColor, padding: 4, textAlign: 'center', fontSize: 18 }}>
                           <Icon name="plus-circle-outline" size={20}></Icon>
                        </Text>
                    </Pressable>
                        </View>
                        <TextInput placeholderTextColor={Color.blackRecColor} style={[styles.input, { width: '60%' }]} placeholder='Bill Number' autoCapitalize='none' />
                        <TextInput placeholderTextColor={Color.blackRecColor}
                            value={date.toLocaleTimeString()} onPressIn={showDatepicker}
                            style={[styles.input, { width: '40%' }]} placeholder='Date' autoCapitalize='none' />
                        <TextInput placeholderTextColor={Color.blackRecColor} style={[styles.input, { width: '100%' }]} placeholder='Party Name' autoCapitalize='none' />
                        <TextInput
                            value={itemName} onChangeText={(name) => setitemName(name)}
                            placeholderTextColor={Color.blackRecColor} style={[styles.input, { width: '70%' }]} placeholder="item description" />
                        <TextInput
                            value={itemQty}
                            onChangeText={(name) => setitemQty(name)}
                            placeholderTextColor={Color.blackRecColor} style={[styles.input, { width: '30%' }]} keyboardType="numeric" placeholder="item qty..." />
                        <Pressable style={[styles.uploadBox2, { marginLeft: 'auto', marginTop: 10, marginRight: 12 ,marginBottom:10}]}>
                            <Pressable style={styles.cusButton1} onPress={AddItem}>
                                <Text style={{ color: Color.blackRecColor, padding: 4, textAlign: 'center', fontSize: 18 }}>
                                    Add <Icon name="plus-circle-outline" size={20}></Icon>
                                </Text>
                            </Pressable>
                        </Pressable>
                        <View style={{ width: '100%' }}>
                            {
                                itemList.map((item, index) => (
                                    <ListItem
                                        linearGradientProps={{
                                            colors: [Color.lightGreyRecColor, Color.lightGreyRecColor],
                                        }}
                                        ViewComponent={LinearGradient} key={index} bottomDivider>
                                        <ListItem.Content>
                                            <ListItem.Title>Bill Number: {item.itemDescription}</ListItem.Title>
                                            <ListItem.Subtitle>Part Name:{item.itemQty}</ListItem.Subtitle>
                                            <ListItem.Subtitle>ItemDescription:{item.itemDescription}</ListItem.Subtitle>
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
                            <Text style={styles.statusText}>Status <Icon name="check-circle" size={25} color={Color.blackRecColor}></Icon></Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%'
    },
    statusView: {
        marginLeft: 'auto',
        marginRight: 40,
        marginTop: 40,
        height: 35,
        textAlign: 'center'
    },
    statusText: {
        color: Color.blackRecColor,
        fontSize: 19
    },
    imageSize: {
        marginTop: 10,
        width: 150,
        height: 150
    },
    buttonText: {
        color: Color.blackRecColor,
        fontSize: 14,
        paddingTop: 6,
        textAlign: 'center',
    },
    rowContainer: {
        paddingHorizontal: 20
    }, boxRow: {
        marginTop: 50,
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: "100%",
        paddingHorizontal: 20
    },
    boxRow2: {
        marginTop: Dimensions.get('window').height * 0.06,
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: "100%",
        paddingHorizontal: 20
    },
    boxRow1: {
        marginTop: 30,
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: "100%",
    },
    outlineButton: {
        marginLeft: 'auto',
        marginTop: 10,
        height: 35,
        width: 125,
        borderRadius: 4,
        backgroundColor: Color.blueRecColor,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        elevation: 9,
        textAlign: 'center'
    },
    uploadBox: {
        width: '33.3%',
    },
    uploadBox2: {
        width: '20%'
    },
    cusButton: {
        borderRadius: 4,
        backgroundColor: Color.blueRecColor,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        elevation: 9,
        height: 45,
    },
    cusButton1: {
        borderRadius: 4,
        backgroundColor: Color.blueRecColor,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        elevation: 9,
        height: Dimensions.get('window').width > 756 ? 45 : 30,
    },
    delButton: {
        width: 120,
        height: 30,
        borderWidth: 1,
        borderColor: Color.greenRecColor
    },
    delText: {
        textAlign: 'center'
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
    inputView: {
        marginTop: 30,
        gap: 10,
        width: "100%",
        paddingHorizontal: 10,
        marginBottom: 5
    },
    input: {
        height: 40,
        paddingHorizontal: 20,
        borderColor: Color.blackRecColor,
        color: '#464646',
        borderBottomWidth: 1,
        borderRadius: 50
    },
})
export default FormDeliveryScreen 
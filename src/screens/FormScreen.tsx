"use strict"
import React, { useEffect, useState } from "react"
import { Image, StyleSheet, Text, TextInput, View } from "react-native"
import Color from "../theme/Color"
import Fonts from "../theme/Fonts"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { InfoFormProps, UserLoginLocation } from "../models/RecepModels";
import { Dropdown } from "react-native-element-dropdown";
import { launchCamera, CameraOptions } from 'react-native-image-picker';
import { RetrieveValue } from "../wrapper/storedata.wrapper"
import { MiscStoreKeys } from "../constants/RecStorageKeys"
import AsyncStorage from "@react-native-async-storage/async-storage"


const camLogo = require("../../assets/recscreen/CAMERA.png")


const FormScreen = ({ route, navigation }: any) => {
    const data:InfoFormProps = route.params["propData"]
    console.log(data)
    const [value,setValue] = useState(data.locations[0].LocationName)
    const [selectedImage, setSelectedImage] = useState(null);
    const getUsersByLocationName = () =>{

    }
    const handleCameraLaunch = () => {
        const option:CameraOptions = {
            mediaType: 'photo',
            includeBase64: false,
            maxHeight: 2000,
            maxWidth: 2000,
        }

        launchCamera(option, (response: any) => {
            if (response.didCancel) {
                console.log('User cancelled camera');
            } else if (response.error) {
                console.log('Camera Error: ', response.error);
            } else {
                let imageUri = response.uri || response.assets?.[0]?.uri;
                setSelectedImage(imageUri);
                console.log(imageUri);
            }
        });
    }


    return (
        <View>
            <View style={styles.container}>
                <View style={{ width: '100%', backgroundColor: Color.blueRecColor, height: 60, alignItems: 'center', flexDirection: 'row' }}>
                    <Text style={{ color: Color.whiteRecColor, fontSize: 16, flex: 1.6, marginLeft: 15 }}>
                        <Icon onPress={() =>
                            navigation.navigate("Home",{data})
                        } name="arrow-left" size={28} color={Color.whiteRecColor}></Icon>
                    </Text>
                    <Text style={{ marginLeft: 10, color: Color.whiteRecColor, fontSize: 18, fontFamily: Fonts.recFontFamily.titleRecFont, flex: 2 }}>{data.appBarTitle}</Text>
                </View>
                <View style={styles.inputView}>
                    <TextInput style={styles.input} keyboardType="numeric" maxLength={10} placeholderTextColor={Color.blackRecColor} placeholder='Mobile No of Vistor' autoCapitalize='none' />
                    <TextInput style={styles.input} placeholderTextColor={Color.blackRecColor} placeholder='Name of Vistor' autoCapitalize='none' />
                    <TextInput style={styles.input} placeholderTextColor={Color.blackRecColor} placeholder='From / Company name / place' autoCapitalize='none' />
                    <TextInput style={styles.input} placeholderTextColor={Color.blackRecColor} placeholder='Purpose of Vistor' autoCapitalize='none' />
                    <Dropdown
                        style={styles.dropdown}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        iconStyle={styles.iconStyle}
                        data={data.locations}
                        itemTextStyle={{ color: Color.blackRecColor }}
                        search
                        maxHeight={300}
                        labelField="LocationName"
                        valueField="LocationName"
                        placeholder="Company name"
                        searchPlaceholder="Search...locations"
                        value={value}
                        onChange={(item) => {
                            setValue(item.LocationName)
                            console.log("value ",value)
                        }}
                    />
                    <TextInput keyboardType="numeric" placeholderTextColor={Color.blackRecColor} style={styles.input} placeholder='No of Visitors' autoCapitalize='none' />
                </View>
                <View style={styles.boxRow}>
                    <View style={styles.uploadBox}>
                        {selectedImage!=null?<Image
                         source={{ uri: selectedImage }}
                         style={styles.imageSize}></Image>:<Image
                         source={camLogo}
                         style={styles.imageSize}></Image>}
                    </View>
                    <View style={styles.uploadBox}>
                        <View style={styles.outlineButton}>
                            <Text style={styles.buttonText}>Send Request <Icon name="send" size={15} color={Color.blackRecColor}></Icon> </Text>
                        </View>
                        <View style={styles.statusView}>
                            <Text style={styles.statusText}>Status <Icon name="check-circle" size={18} color={Color.blackRecColor}></Icon></Text>
                        </View>
                    </View>
                </View>
                <View style={styles.remarkInputView}>
                <Text
                    onPress={handleCameraLaunch}
                    style={{marginRight:'auto',marginLeft:10,textAlign: 'center', color: 'blue', borderBottomWidth: 1, borderBottomColor: 'blue'}}>Take Photo</Text>
                </View>
                <View style={styles.remarkInputView1}>
                    <TextInput placeholderTextColor={Color.blackRecColor} placeholder="Remarks" style={styles.remarkInput}></TextInput>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
    },
    statusView: {
        marginLeft: 'auto',
        marginRight: 28,
        marginTop: 40,
        height: 35,
        textAlign: 'center'
    },
    statusText: {
        color: Color.blackRecColor,
        fontSize: 25,
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
    outlineButton: {
        marginLeft: 'auto',
        marginTop: 10,
        height: 35,
        width: 130,
        borderWidth: 1,
        borderColor: Color.greenRecColor,
        textAlign: 'center'
    },
    boxRow: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        width: "100%",
        paddingHorizontal: 30,
    },
    uploadBox: {
        width: '50%',
    },
    inputView: {
        marginTop: 30,
        gap: 3,
        width: "100%",
        paddingHorizontal: 10,
        marginBottom: 5,
    },
    input: {
        height: 40,
        paddingHorizontal: 20,
        borderColor: Color.blackRecColor,
        color: Color.blackRecColor,
        borderBottomWidth: 1,
        borderRadius: 50,
    },
    remarkInputView: {
        marginTop: 160,
        width: '100%',
        padding: 20,
    },
    remarkInputView1: {
        width: '100%',
        padding: 20,
    },
    remarkInput: {
        textAlign: 'justify',
        height: 137,
        justifyContent: 'flex-start',
        backgroundColor: Color.lightGreyRecColor
    },
    dropdown: {
        height: 50,
        borderBottomColor: Color.blackRecColor,
        borderBottomWidth: 1,
        marginHorizontal: 20,
    },
    icon: {
        marginRight: 5,
    },
    placeholderStyle: {
        fontSize: 16,
        color: Color.blackRecColor
    },
    selectedTextStyle: {
        fontSize: 16,
        color: Color.blackRecColor
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
})

export default FormScreen
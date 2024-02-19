"use strict"
import React, { useState } from "react"
import { ActivityIndicator, Alert, Dimensions, Image, Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native"
import Color from "../theme/Color"
import Fonts from "../theme/Fonts"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { InfoFormProps, UserLoginData } from "../models/RecepModels";
import { Dropdown } from "react-native-element-dropdown";
import { launchCamera, CameraOptions } from 'react-native-image-picker';
import { GetUsersByLocation, PostVisitorData } from "../requests/recHomeRequest"



const camLogo = require("../../assets/recscreen/CAMERA.png")


const FormScreen = ({ route, navigation }: any) => {
    const data: InfoFormProps = route.params["propData"]
    const [userslst, setUserlist] = useState([])
    const [isModalVisible, setIsModalVisible] = useState(false);
    let userLocation: UserLoginData[] = []
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageBase, setBase64] = useState("")
    const [mobile, setMobile] = useState("")
    const [visiorname, setVisitorname] = useState("")
    const [place, setPlace] = useState("")
    const [purpose, SetPurpose] = useState("")
    const [visitors, setVisitors] = useState("")
    const [remarks, setRemarks] = useState("")
    const [meet, setMeetWith] = useState("")

    let typeFormData = {
        locationCode: data.locations[0].LocationName,
        imageDatas: ''
    }
    const getUsersByLocationName = (code: any) => {
        let payload = {
            UserLocationCode: code
        }
        try {
            console.log("payload ", payload)
            GetUsersByLocation(JSON.stringify(payload))?.then((response) => {
                console.log("response ", response.data)
                userLocation = response.data.Data
                console.log("users ", userLocation)
                setUserlist(response.data.Data)
            }).catch((error: any) => {
                console.log("error ", error)
            })
        } catch (error) {
            console.log("error ", error)
        }
    }


    const handleCameraLaunch = () => {
        const option: CameraOptions = {
            mediaType: 'photo',
            includeBase64: true,
            maxHeight: 2000,
            maxWidth: 2000,
        }

        launchCamera(option, (response: any) => {
            if (response.didCancel) {
                console.log('User cancelled camera', response);
            } else if (response.error) {
                console.log('Camera Error: ', response.error);
            } else {
                let imageUri = response.uri || response.assets?.[0]?.uri;
                typeFormData.imageDatas = response.assets?.[0]?.base64
                setSelectedImage(imageUri);
                setBase64(typeFormData.imageDatas)
                console.log("form base", typeFormData.imageDatas);
            }
        });
    }


    const onSendRequest = () => {
        console.log("image data ", typeFormData.imageDatas)
        let payload = {
            VisitorName: visiorname,
            VisitorMobileNo: mobile,
            VisitorImage: imageBase,
            VisitorCode: '',
            VisitTranMasterCode: '',
            VisitTranCategory: data.category,
            VisitTranVisitorFrom: place,
            VisitTranPurpose: purpose,
            VisitTranMeetingWith: meet,
            VisitTranCheckinTime: '',
            VisitTranCheckoutTime: '',
            VisitTranVisitType: '',
            VisitTranVisitStatus: '',
            VisitTranRemarks: remarks
        }
        PostVisitorData(payload)?.then((response: any) => {
            console.log("response ", response)
            if (response.data.Status) {
                setIsModalVisible(true)
            } else {
                setIsModalVisible(false)
            }
        }).catch((error) => {
            console.log("error ", error)
        })
    }

    return (
        <View>
            <View style={styles.container}>
                <View style={{ width: '100%',marginBottom:Dimensions.get('window').height * 0.0 ,backgroundColor: Color.blueRecColor, height: 60, alignItems: 'center', flexDirection: 'row' }}>
                    <Text style={{ color: Color.whiteRecColor, fontSize: 16, flex: 1.6, marginLeft: 15 }}>
                        <Icon onPress={() =>
                            navigation.navigate("Home", { data })
                        } name="arrow-left" size={28} color={Color.whiteRecColor}></Icon>
                    </Text>
                    <Text style={{ marginLeft: 10, color: Color.whiteRecColor, fontSize: 18, fontFamily: Fonts.recFontFamily.titleRecFont, flex: 2 }}>{data.appBarTitle}</Text>
                </View>
                <View style={styles.inputView}>
                    <TextInput
                        value={mobile}
                        onChangeText={number => setMobile(number)}
                        style={styles.input} keyboardType="numeric" maxLength={10}
                        placeholderTextColor={Color.blackRecColor} placeholder='Mobile No of Vistor'
                        autoCapitalize='none' />
                    <TextInput
                        value={visiorname}
                        onChangeText={name => setVisitorname(name)}
                        style={styles.input} placeholderTextColor={Color.blackRecColor}
                        placeholder='Name of Vistor' autoCapitalize='none' />
                    <TextInput
                        value={place}
                        onChangeText={plcs => setPlace(plcs)}
                        style={styles.input} placeholderTextColor={Color.blackRecColor}
                        placeholder='From / Company name / place' autoCapitalize='none' />
                    <TextInput
                        value={purpose}
                        onChangeText={purp => SetPurpose(purp)}
                        style={styles.input} placeholderTextColor={Color.blackRecColor}
                        placeholder='Purpose of Vistor' autoCapitalize='none' />
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
                        valueField="LocationCode"
                        placeholder="Company name"
                        searchPlaceholder="Search...locations"
                        value={typeFormData.locationCode}
                        onChange={(item) => {
                            typeFormData.locationCode = item.LocationCode
                            getUsersByLocationName(typeFormData.locationCode)
                            console.log("value ", typeFormData.locationCode)
                        }}
                    />
                    <Dropdown
                        style={styles.dropdown}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        iconStyle={styles.iconStyle}
                        data={userslst}
                        itemTextStyle={{ color: Color.blackRecColor }}
                        search
                        maxHeight={300}
                        labelField="UserName"
                        valueField="UserCode"
                        placeholder="Meeting with"
                        searchPlaceholder="Search...locations"
                        value={meet}
                        onChange={(item: any) => {
                            setMeetWith(item.UserCode)
                            console.log("item ", item, meet)
                        }}
                    />
                    <TextInput
                        value={visitors}
                        onChangeText={vistno => setVisitors(vistno)}
                        keyboardType="numeric" placeholderTextColor={Color.blackRecColor}
                        style={styles.input} placeholder='No of Visitors' autoCapitalize='none' />
                </View>
                <View style={styles.boxRow}>
                    <View style={styles.uploadBox}>
                        {selectedImage != null ? <Image
                            source={{ uri: selectedImage }}
                            style={styles.imageSize}></Image> : <Image
                                source={camLogo}
                                style={styles.imageSize}></Image>}
                    </View>
                    <View style={styles.uploadBox}>
                        <View style={styles.outlineButton}>
                            <Text style={styles.buttonText} onPress={onSendRequest}>Send Request <Icon name="send" size={15} color={Color.blackRecColor}></Icon> </Text>
                        </View>
                        <View style={styles.statusView}>
                            <Text style={styles.statusText}>Status <Icon name="check-circle" size={18} color={Color.blackRecColor}></Icon></Text>
                        </View>
                    </View>
                </View>
                <View style={styles.remarkInputView}>
                    <Text
                        onPress={handleCameraLaunch}
                        style={{ marginRight: 'auto', marginLeft: 10, textAlign: 'center', color: 'blue', borderBottomWidth: 1, borderBottomColor: 'blue' }}>Take Photo</Text>
                </View>
                <View style={styles.remarkInputView1}>
                    <TextInput
                        value={remarks}
                        onChangeText={rems => setRemarks(rems)}
                        placeholderTextColor={Color.blackRecColor} placeholder="Remarks"
                        style={styles.remarkInput}></TextInput>
                </View>
            </View>
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
            <ActivityIndicator style={{backfaceVisibility:'hidden'}} size={"large"} color={Color.blueRecColor}></ActivityIndicator>
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
        textAlign: 'center',
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

export default FormScreen
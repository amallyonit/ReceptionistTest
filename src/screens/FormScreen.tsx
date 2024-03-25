"use strict"
import React, { useEffect, useState } from "react"
import { ActivityIndicator, Alert, Dimensions, FlatList, Image, Modal, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import Color from "../theme/Color"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { InfoFormProps, UserLoginLocation, UserPayload } from "../models/RecepModels";
import { Dropdown } from "react-native-element-dropdown";
import { launchCamera, CameraOptions } from 'react-native-image-picker';
import { GetAllRevisitorsData, GetPhoneNumberDetails, GetUsersByLocation, PostVisitorData } from "../requests/recHomeRequest"
import { MiscStoreKeys } from "../constants/RecStorageKeys"
import AsyncStorage from "@react-native-async-storage/async-storage"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"

const camLogo = require("../../assets/recscreen/CAMERA.png")


const FormScreen = ({ route, navigation }: any) => {
    let typeFormData = {
        locationCode: '',
        imageDatas: ''
    }
    const [fErorr, setfErorr] = useState(false)
    const [userslst, setUserlist] = useState([])
    const [phonenos, setPhonenos] = useState([])
    const [visitStatus,setVisitStatus] = useState('B_STATUS')
    const [uDevToken,setUDevToken] = useState<{MeetingUserCode:'',MeetingDevToken:''}>({MeetingUserCode:'',MeetingDevToken:''})
    const [location, setLocations] = useState<UserLoginLocation[]>([])
    const [usertoken, setUserToken] = useState<UserPayload>({ token: '', userid: '' })
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isLoaderTrue, setIsLoaderTrue] = useState(false)
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageBase, setBase64] = useState("")
    const [mobile, setMobile] = useState("")
    const [visiorname, setVisitorname] = useState("")
    const [place, setPlace] = useState("")
    const [purpose, setPurpose] = useState("")
    const [visitors, setVisitors] = useState("1")
    const [remarks, setRemarks] = useState("")
    const [meet, setMeetWith] = useState("")
    useEffect(() => {
        navigation.setOptions({ headerTitle: data.appBarTitle})
        getVisiorNumbers()
        setMobile('')
        try {
            AsyncStorage.getItem(MiscStoreKeys.EZ_LOGIN).then((response: any) => {
                let items = JSON.parse(response)
                if (items.Status) {
                    setLocations(items.Data[1])
                    typeFormData.locationCode = items.Data[0][0].UserCode
                    let tokenPay: UserPayload = {
                        userid: items.Data[0][0].UserCode,
                        token: items.Token
                    }
                    setUserToken(tokenPay)
                } else {
                    setLocations([])
                }
            }).catch((error: any) => {
                console.log("error response ", error)
            })
        } catch (error) {
            console.log("error ", error)
        }
    }, [])
    const data: InfoFormProps = route.params["propData"]
    const getUsersByLocationName = async (code: any) => {
        let payload = {
            UserLocationCode: code
        }
        try {
           await GetUsersByLocation(JSON.stringify(payload))?.then((response:any) => {
                console.log("response ", response.data)
                setUserlist(response.data.Data)
            }).catch((error: any) => {
                console.log("error ", error)
            })
        } catch (error) {
            console.log("error ", error)
        }
    }


    const getVisiorNumbers = async () => {
        let payload = {
            UserCode: "",
        }

        try {
           await GetAllRevisitorsData(JSON.stringify(payload))?.then((response:any) => {
                console.log(response)
                if (response.data.Status) {
                    setPhonenos(response.data.Data)
                    setFilteredSuggestions(response.data.Data)
                }
            }).catch((error: any) => {
                console.log("error ", error)
            })
        } catch (error) {
            console.log("error ", error)
        }
    }

    const getDetailsByPhoneno=async (value:any)=>{
        let payload = {
            VisitorMobileNo:mobile!=''?mobile:value
        }
        console.log("mobile no ",payload)
        try {
           await GetPhoneNumberDetails(payload)?.then((response:any)=>{
                if(response.data.Status){
                    setBase64(response.data.Data[0].VisitorImage)
                    setPlace(response.data.Data[0].VisitTranVisitorFrom)
                    setVisitorname(response.data.Data[0].VisitorName)
                }
            }).catch((error)=>{
                console.log("error ",error)
                setIsLoaderTrue(false)
            })
        } catch (error) {
            console.log("error ",error)
        }
    }

    const handleCameraLaunch = () => {
        const option: CameraOptions = {
            mediaType: 'photo',
            includeBase64: true,
            maxHeight: 500,
            maxWidth: 500,
            quality: 0.5
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

    const resetVisitForm = () => {
        setUserlist([])
        setIsLoaderTrue(false)
        setSelectedImage(null)
        setBase64("")
        setMobile("")
        setVisitorname("")
        setPlace("")
        setPurpose("")
        setVisitors("1")
        setRemarks("")
        setMeetWith("")
        typeFormData.locationCode=""
        setUDevToken({MeetingUserCode:'',MeetingDevToken:''})
    }

    const onSendRequest = async () => {
        if(query!="" && meet!="" && place!=""){
            setIsLoaderTrue(true)
            let payload = {
                VisitorName: visiorname,
                VisitorMobileNo: query,
                VisitorImage: imageBase,
                VisitorCode: '',
                VisitTranMasterCode: '',
                VisitTranCategory: data.category,
                VisitTranVisitorFrom: place,
                VisitTranNoOfVisitors:visitors,
                VisitTranPurpose: purpose,
                VisitTranMeetingWith: meet,
                VisitTranCheckinTime: '',
                VisitTranCheckoutTime: '',
                VisitTranVisitType: data.type,
                VisitTranVisitStatus: '',
                VisitTranRemarks: remarks,
                MeetingUserCode:uDevToken.MeetingUserCode,
                MeetingDevToken:uDevToken.MeetingDevToken
            }
            try {
                await PostVisitorData(payload)?.then((response: any) => {
                    console.log("response visitor", response)
                    if (response.data.Status) {
                        setIsModalVisible(true)
                        setIsLoaderTrue(false)
                        if(response.data.VStatus=='R_STATUS'){
                            setVisitStatus('R_STATUS')
                        }else if(response.data.VStatus=='S_STATUS'){
                            setVisitStatus('S_STATUS')
                            resetVisitForm()
                        }
                    } else {
                        setIsModalVisible(false)
                        setIsLoaderTrue(false)
                        resetVisitForm()
                    }
                }).catch((error) => {
                    console.log("error ", error)
                })
            } catch (error) {
                
            }
        }else{
            setfErorr(true)
        }
    }
    const [query, setQuery] = useState('');
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  
    const handleInputChange = (text:any) => {
      setQuery(text);
      filterSuggestions(text);
    };
  
    const filterSuggestions = (text:any) => {
      const filtered = phonenos.filter((item:any) =>
        item.VisitorMobileNo.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredSuggestions(filtered);
    };
  
    const handleSelectSuggestion = (item:any) => {
      setQuery(item.VisitorMobileNo);
      setFilteredSuggestions([]);
      getDetailsByPhoneno(item.VisitorMobileNo)
    };
    return (
        <SafeAreaView>
            <View>
                <View style={styles.container}>
                    <View style={{marginTop:Dimensions.get('window').width > 756 ? 10:10,width:'100%',overflow:'scroll'}}>
                    <View style={{width:'100%'}}>
                    <TextInput
                        style={{ height: 40,color:Color.blackRecColor, borderBottomColor:query==""? Color.redRecColor:Color.blackRecColor, borderBottomWidth: 1, marginHorizontal:20 }}
                        value={query}
                        onChangeText={handleInputChange}
                        placeholder="Type Phone number..."
                        placeholderTextColor={Color.blackRecColor}
                    />
                    {query==""&&(<Text style={{color:Color.redRecColor,paddingHorizontal:30}}>Please Enter the Mobile no!</Text>)}
                    <FlatList
                        data={filteredSuggestions}
                        renderItem={({ item }:any) => (
                        <Pressable  onPress={() => handleSelectSuggestion(item)}>
                            <Text style={{ padding: 15,width:'100%',color:Color.blackRecColor,borderBottomColor:Color.lightGreyRecColor,borderBottomWidth:1 }}>{item.VisitorMobileNo}</Text>
                        </Pressable>
                        )}
                        keyExtractor={(item, index) => index.toString()}
                        style={{maxHeight:200,marginTop:40,marginHorizontal:20,position:'absolute',zIndex:1,backgroundColor:'#fff',
                        width:Dimensions.get('window').width > 756?754:352}}
                    />
                    </View>
                    <View style={styles.inputView1}>
                        <TextInput
                            value={visiorname}
                            onChangeText={name => setVisitorname(name)}
                            style={styles.input} placeholderTextColor={Color.blackRecColor}
                            placeholder='Name of Vistor' autoCapitalize='none' />
                            {visiorname==""&&(<Text style={{color:Color.redRecColor,paddingHorizontal:30}}>Please Enter the Visitorname!</Text>)}                 
                        <TextInput
                            value={place}
                            onChangeText={plcs => setPlace(plcs)}
                            style={styles.input} placeholderTextColor={Color.blackRecColor}
                            placeholder='From / Company name / place' autoCapitalize='none' />
                            {place==""&&(<Text style={{color:Color.redRecColor,paddingHorizontal:30}}>Please Enter the From place!</Text>)}            
                        <TextInput
                            value={purpose}
                            onChangeText={purp => setPurpose(purp)}
                            style={styles.input} placeholderTextColor={Color.blackRecColor}
                            placeholder='Purpose of Visit' autoCapitalize='none' />
                            {purpose==""&&(<Text style={{color:Color.redRecColor,paddingHorizontal:30}}>Please Enter the Purpose of visitor!</Text>)}                 
                        <Dropdown
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                            iconStyle={styles.iconStyle}
                            data={location}
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
                                setUDevToken({MeetingUserCode:item.UserCode,MeetingDevToken:item.UserDeviceToken})
                            }}
                        />
                        {meet==""&&(<Text style={{color:Color.redRecColor,paddingHorizontal:30}}>Please Select Meeting person!</Text>)}                 
                        <TextInput
                            value={visitors}
                            onChangeText={(vistno:any) => setVisitors(vistno)}
                            keyboardType="numeric" placeholderTextColor={Color.blackRecColor}
                            style={styles.input} placeholder='No of Visitors' autoCapitalize='none' />
                    </View>
                    <View style={styles.boxRow}>
                        <View style={styles.uploadBox}>
                            {imageBase != "" ? <Image
                                source={{ uri:`data:image/png;base64,${imageBase}` }}
                                style={styles.imageSize}></Image> : <Image
                                    source={camLogo}
                                    style={styles.imageSize}></Image>}
                        </View>
                        <View style={styles.uploadBox}>
                            <Pressable android_ripple={{ color: Color.lightRecBlue }} onPress={onSendRequest} style={styles.outlineButton}>
                                <Text style={styles.buttonText} >Send Request <Icon name="send" size={15} color={Color.blackRecColor}></Icon> </Text>
                            </Pressable>
                            <View style={styles.statusView}>
                                {(visitStatus =='R_STATUS')?(
                                    <Text style={styles.statusRText}>Status <Icon name="check-circle" size={18} color={Color.redRecColor}></Icon></Text>
                                ):(visitStatus =='S_STATUS')?(
                                    <Text style={styles.statusSText}>Status <Icon name="check-circle" size={18} color={Color.greenRecColor}></Icon></Text>
                                ):(
                                    <Text style={styles.statusText}>Status <Icon name="check-circle" size={18} color={Color.blackRecColor}></Icon></Text>
                                )}
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
                            multiline={true}
                            numberOfLines={10}
                            onChangeText={rems => setRemarks(rems)}
                            placeholderTextColor={Color.blackRecColor} placeholder="Remarks"
                            style={styles.remarkInput}></TextInput>
                    </View>
                    </View>
                </View>
                <Modal
                    animationType="fade"
                    transparent={false}
                    statusBarTranslucent={true}
                    visible={isModalVisible}
                    onRequestClose={() => {
                        Alert.alert('Modal has been closed.');
                        setIsModalVisible(!isModalVisible);
                    }}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}>
                            {(visitStatus =='S_STATUS')?(
                                <Text style={{color:Color.greenRecColor}}>Your Request Accepted</Text>
                            ):(
                                <Text style={{color:Color.redRecColor}}>Your Request Denied</Text>
                            )}
                            </Text>
                            <Pressable
                                style={styles.button}
                                onPress={() => setIsModalVisible(!isModalVisible)}>
                                {(visitStatus =='S_STATUS')?(
                                <MaterialCommunityIcons name="check-circle-outline" style={styles.buttoonIconSe} size={Dimensions.get('window').width > 756?100:50} color={Color.greenRecColor}></MaterialCommunityIcons>
                                ):(
                                <MaterialCommunityIcons name="close-circle-outline" style={styles.buttoonIconSe1}  color={Color.redRecColor} size={Dimensions.get('window').width > 756?100:50} />
                                )}
                            </Pressable>
                        </View>
                    </View>
                </Modal>
                <Modal
                    animationType="fade"
                    transparent={false}
                    statusBarTranslucent={true}
                    visible={isLoaderTrue}
                    onRequestClose={() => {
                    setIsLoaderTrue(!isLoaderTrue);
                    }}>
                    <View style={styles.centeredView}>
                        <ActivityIndicator style={{ backfaceVisibility: 'hidden' }} size={60} color={Color.blueRecColor}></ActivityIndicator>
                    </View>
                </Modal>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
    },
    autocompleteContainer: {
        backgroundColor: '#ffffff',
        borderWidth: 0,
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
    statusRText: {
        color: Color.redRecColor,
        fontSize: 25,
    },
    statusSText: {
        color: Color.greenRecColor,
        fontSize: 25,
    },
    imageSize: {
        marginTop: 10,
        width: Dimensions.get('window').width > 756? 200:150,
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
        borderRadius: 2,
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
        marginTop:30,
        gap: 3,
        width: "100%",
        paddingHorizontal: 10,
        marginBottom: 5,
    },
    inputView1: {
        marginTop:0,
        gap: 3,
        width: "100%",
        paddingHorizontal: 10,
        marginBottom: 5,
    },
    input: {
        height: Dimensions.get('window').width > 756 ? 50:40,
        paddingHorizontal: 20,
        borderColor: Color.blackRecColor,
        color: Color.blackRecColor,
        borderBottomWidth: 1,
        borderRadius: 50,
    },
    remarkInputView: {
        marginTop: Dimensions.get('window').width > 756 ? 160:150,
        width: '100%',
        padding: 20,
    },
    remarkInputView1: {
        width: '100%',
        padding: 20,
    },
    remarkInput: {
        backgroundColor: Color.lightGreyRecColor,
        color: Color.blackRecColor,
        textAlignVertical: 'top',
        height: Dimensions.get('window').width > 756 ?300:137,
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
        color:Color.blackRecColor
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 10,
        width: '60%',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
    },
    buttoonIconSe:{
        borderRadius:100,borderColor:Color.greenRecColor,
        shadowColor: Color.greenRecColor,
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 0.1
    },
    buttoonIconSe1:{
        borderRadius:100,borderColor:Color.redRecColor,
        shadowColor: Color.redRecColor,
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 0.1
    },
    button: {
        borderRadius: 5,
        paddingHorizontal: 20,
        paddingVertical: 5,
    },
    buttonClose: {
        backgroundColor: Color.whiteRecColor,
    },
    textStyle: {
        color: Color.whiteRecColor,
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 20
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
        color: Color.blueRecColor,
        fontSize: Dimensions.get('window').fontScale * 20
    },
})

export default FormScreen
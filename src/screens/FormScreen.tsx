"use strict"
import  React,{ useEffect, useState } from "react"
import { ActivityIndicator, Alert, Dimensions, FlatList, Image, Modal, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import Color from "../theme/Color"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { InfoFormProps, UserLDData, UserLoginLocation, UserPayload, ViewNotification } from "../models/RecepModels";
import { Dropdown } from "react-native-element-dropdown";
import { launchCamera, CameraOptions } from 'react-native-image-picker';
import { GetAllRevisitorsData, GetPhoneNumberDetails, GetUsersByLocation, PostVisitorData } from "../requests/recHomeRequest"
import { MiscStoreKeys } from "../constants/RecStorageKeys"
import AsyncStorage from "@react-native-async-storage/async-storage"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { LinearProgress, ListItem, Overlay } from "react-native-elements"
import { KeyboardAvoidingView } from "react-native"

const camLogo = require("../../assets/recscreen/CAMERA.png")


const FormScreen = ({ route, navigation }: any) => {
    let typeFormData = {
        locationCode: '',
        imageDatas: ''
    }
    const [usrLcton, setUsrLcton] = useState("")
    const [userslst, setUserlist] = useState([])
    const [phonenos, setPhonenos] = useState([])
    const [vistCode, setVisitCode] = useState("")
    const [visitStatus, setVisitStatus] = useState('B_STATUS')
    const [uDevToken, setUDevToken] = useState<{ MeetingUserCode: '', MeetingDevToken: '' }>({ MeetingUserCode: '', MeetingDevToken: '' })
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
    const [viewUser, setViewUser] = useState<UserLDData>()
    const [totalView, setTotalView] = useState<ViewNotification[]>([])
    const [isitStatus,setisitStatus] = useState(false)
    const [userLocFl,setUserLocFl]  =  useState("")
    useEffect(() => {
        navigation.setOptions({ headerTitle: data.appBarTitle })
        setMobile('')
        getUserData()
        getUserDatasDet()
    }, [])
    const data: InfoFormProps = route.params["propData"]

    const getUserDatasDet = async () => {
        setViewUser({UserCode:'',UserDeviceToken:'',UserMobileNo:'',UserName:'',UserPassword:'',UserType:'',LocationPremise:''})
        const data: any = await AsyncStorage.getItem(MiscStoreKeys.EZ_LOGIN)
        const vals = JSON.parse(data)
        console.log("data ", vals.Data[0][0])
        setViewUser(vals.Data[0][0])
      }

    const getUserData = async () => {
        setUsrLcton('')
        const data: any = await AsyncStorage.getItem(MiscStoreKeys.EZ_LOGIN)
        const vals = JSON.parse(data)
        console.log("data ",data)
        setLocations(vals.Data[1])
        setUsrLcton(location[0]?.LocationCode)
        getUsersByLocationName(usrLcton==undefined || usrLcton==''?'BPJ001':usrLcton)
        console.log(" dat ",location,usrLcton)
      }
    const getUsersByLocationName = async (code: any) => {
        let payload = {
            UserLocationCode: code
        }
        try {
            await GetUsersByLocation(JSON.stringify(payload))?.then((response: any) => {
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
            await GetAllRevisitorsData(JSON.stringify(payload))?.then((response: any) => {
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

    const getDetailsByPhoneno = async (value: any) => {
        let payload = {
            VisitorMobileNo: mobile != '' ? mobile : value,
            CurData:""
        }
        console.log("mobile no ", payload)
        try {
            await GetPhoneNumberDetails(payload)?.then((response: any) => {
                console.log("data resp ",response.data)
                if (response.data.Status) {
                    const notData = JSON.parse(response.data.Data)
                    setBase64(notData[0][0].VisitorImage)
                    setPlace(notData[0][0].VisitTranVisitorFrom)
                    setVisitorname(notData[0][0].VisitorName)
                    setVisitCode(notData[0][0].VisitorCode)
                }
            }).catch((error) => {
                console.log("error ", error)
                setIsLoaderTrue(false)
            })
        } catch (error) {
            console.log("error ", error)
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
        setVisitCode("")
        setBase64("")
        setMobile("")
        setVisitorname("")
        setPlace("")
        setPurpose("")
        setVisitors("1")
        setRemarks("")
        setMeetWith("")
        setUsrLcton("")
        setQuery("")
        typeFormData.locationCode = ""
        setUDevToken({ MeetingUserCode: '', MeetingDevToken: '' })
    }

    const onSendRequest = async () => {
        const vistTrnid = await AsyncStorage.getItem('CON_STATUS')
        console.log("cist sts ",vistTrnid)
        const VisitCheckStatus = JSON.parse(vistTrnid!)
        console.log("visit id",VisitCheckStatus.EMP_STAT)
        if (query != "" && meet != "" && place != "" && purpose != "") {
            setIsLoaderTrue(true)
            let payload = {
                VisitorName: visiorname,
                VisitorMobileNo: query,
                VisitorImage: imageBase,
                VisitorCode: vistCode,
                VisitTranMasterCode: '',
                VisitTranCategory: data.category,
                VisitTranVisitorFrom: place,
                VisitTranNoOfVisitors: visitors,
                VisitTranPurpose: purpose,
                VisitTranMeetingWith: meet,
                VisitTranCheckinTime: '',
                VisitTranCheckoutTime: '',
                VisitTranVisitType: data.type,
                VisitTranVisitStatus: '',
                VisitTranRemarks: remarks,
                MeetingUserCode: uDevToken.MeetingUserCode,
                MeetingDevToken: uDevToken.MeetingDevToken,
                VisitCheckStatus:VisitCheckStatus.EMP_STAT,
                VisiPersonLocation:userLocFl
            } 
            try {
                await PostVisitorData(payload)?.then((response: any) => {
                    if (response.data.Status) {
                        setIsModalVisible(true)
                        setTimeout(() => {
                            setIsLoaderTrue(false)
                        }, 1000);
                        if (response.data.VStatus == 'R_STATUS') {
                            AsyncStorage.setItem('CON_STATUS',JSON.stringify({EMP_STAT:response.data.FaileRe}))
                            setVisitStatus('R_STATUS')
                        } else if (response.data.VStatus == 'S_STATUS') {
                            setVisitStatus('S_STATUS')
                            // navigation.navigate('Home')
                            resetVisitForm()
                        }
                    } else {
                        setIsModalVisible(false)
                        setIsLoaderTrue(false)
                        resetVisitForm()
                    }
                }).catch((error) => {
                    console.log("error ", error)
                    setIsLoaderTrue(false)
                })
            } catch (error) {

            }
        } else {
            
        }
    }
    const [query, setQuery] = useState('');
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);

    const handleInputChange = (text: any) => {
        AsyncStorage.setItem('CON_STATUS',JSON.stringify({EMP_STAT:'EMPTY'}))
        setQuery(text);
        filterSuggestions(text);
        if (filteredSuggestions.length == 0) {
            setVisitorname(""),
                setPlace("")
            setBase64("")
        }
    };

    const filterSuggestions = (text: any) => {
        const filtered = phonenos.filter((item: any) =>
            item.VisitorMobileNo.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredSuggestions(filtered);
    };

    const handleSelectSuggestion = (item: any) => {
        setQuery(item.VisitorMobileNo);
        setFilteredSuggestions([]);
        getDetailsByPhoneno(item.VisitorMobileNo)
    };

    const getTodayNotifications = async () => {
        let currentData =  new Date().toISOString().split('T',1)[0].split('-')
        let formatDate =  currentData[2]+'/'+currentData[1]+'/'+currentData[0]
        let payload = {
            VisitorMobileNo: "",
            CurData:formatDate
        }
        console.log("payload ", payload)
        try {
            await GetPhoneNumberDetails(payload)?.then(async (response: any) => {
                if (response.data.Status) {
                    console.log("response data", response.data.Data.length)
                    const notData = JSON.parse(response.data.Data)
                    console.log("not data ",notData[0][0])
                    if(notData!=undefined){
                        setTotalView(notData[0])
                    }
                }
            }).catch((error: any) => {
                console.log("error found ", error)

            })
        } catch (error) {
            console.log("error found", error)
        }
    }
    return (
        <SafeAreaView>
            <View>
                <View style={styles.container}>
                <View style={{marginTop:Dimensions.get('window').width >756? 10: 3.6,width:Dimensions.get('window').width >756? '92%':'85%',height:20,alignItems:'center',position:'absolute',borderRadius:5,backgroundColor:Color.blueRecColor,borderColor:Color.blueRecColor,borderWidth:1}}>
                        <Text style={{color:Color.whiteRecColor,fontSize:16,fontWeight:'500',textAlign:'center'}}>{viewUser?.UserName} - {viewUser?.LocationPremise}</Text> 
                </View>
                    <View style={{ marginTop: Dimensions.get('window').width > 756 ? 40 : 28, width: '100%', overflow: 'scroll' }}>
                        <View style={{ width: '100%' }}>
                            <TextInput
                                style={[styles.input, { borderBottomColor:query==''?Color.redRecColor:Color.darkRecGray, marginHorizontal: Dimensions.get('window').width > 756 ? 30 : 30 }]}
                                value={query}
                                keyboardType="numeric"
                                maxLength={10}
                                onPressIn={() => { getVisiorNumbers();AsyncStorage.setItem('CON_STATUS',JSON.stringify({EMP_STAT:'EMPTY'})) }}
                                onChangeText={handleInputChange}
                                placeholder="Type Phone number..."
                                placeholderTextColor={Color.blackRecColor}
                            />
                            <FlatList
                                data={filteredSuggestions}
                                renderItem={({ item }: any) => (
                                    <Pressable onPress={() => handleSelectSuggestion(item)}>
                                        <Text style={{ padding: 15, width: '100%', color: Color.blackRecColor, borderBottomColor: Color.lightGreyRecColor, borderBottomWidth: 1 }}>{item.VisitorMobileNo}</Text>
                                    </Pressable>
                                )}
                                keyExtractor={(item, index) => index.toString()}
                                style={{
                                    maxHeight: 200, marginTop: 40, marginHorizontal: 20, position: 'absolute', zIndex: 1, backgroundColor: '#fff',
                                    width: Dimensions.get('window').width > 756 ? 754 : 350
                                }}
                            />
                        </View>
                        <View style={styles.inputView1}>
                            <TextInput
                                value={visiorname}
                                onChangeText={name => setVisitorname(name)}
                                style={[styles.input,{borderBottomColor:visiorname==''?Color.redRecColor:Color.darkRecGray}]} placeholderTextColor={Color.blackRecColor}
                                placeholder="Name of Vistor" autoCapitalize='none' />
                            <TextInput
                                value={place}
                                onChangeText={plcs => setPlace(plcs)}
                                style={[styles.input,{borderBottomColor:place==''?Color.redRecColor:Color.darkRecGray}]} placeholderTextColor={Color.blackRecColor}
                                placeholder='From / Company name / place' autoCapitalize='none' />
                            <TextInput
                                value={purpose}
                                onChangeText={purp => setPurpose(purp)}
                                style={[styles.input,{borderBottomColor:purpose==''?Color.redRecColor:Color.darkRecGray}]} placeholderTextColor={Color.blackRecColor}
                                placeholder='Purpose of Visit' autoCapitalize='none' />
                            <Dropdown
                                style={[styles.dropdown,{borderBottomColor:usrLcton==''?Color.redRecColor:Color.darkRecGray}]}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                inputSearchStyle={styles.inputSearchStyle}
                                iconStyle={styles.iconStyle}
                                data={location}
                                itemTextStyle={{ color: Color.blackRecColor }}
                                search
                                maxHeight={300}
                                labelField="CompanyName"
                                valueField="LocationCode"
                                placeholder="Company name"
                                searchPlaceholder="Search...locations"
                                value={usrLcton==undefined || usrLcton==''?'BPJ001':usrLcton}
                                onChange={(item) => {
                                    setUsrLcton(item.LocationCode)
                                    console.log("user item ",item)
                                    setUserLocFl(item.LocationName)
                                    getUsersByLocationName(usrLcton==undefined || usrLcton==''?'BPJ001':usrLcton)
                                }}
                            />
                            <Dropdown
                                style={[styles.dropdown,{borderBottomColor:meet==''?Color.redRecColor:Color.darkRecGray}]}
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
                                    setUDevToken({ MeetingUserCode: item.UserCode, MeetingDevToken: item.UserDeviceToken })
                                }}
                            />
                            <TextInput
                                value={visitors}
                                onChangeText={(vistno: any) => setVisitors(vistno)}
                                keyboardType="numeric" placeholderTextColor={Color.blackRecColor}
                                style={[styles.input]} placeholder='No of Visitors' autoCapitalize='none' />
                        </View>
                        <View style={styles.boxRow}>
                            <View style={styles.uploadBox}>
                                {imageBase != "" ? <Image
                                    source={{ uri: `data:image/png;base64,${imageBase}` }}
                                    style={styles.imageSize}></Image> : <Image
                                        source={camLogo}
                                        style={styles.imageSize}></Image>}
                            </View>
                            <View style={styles.uploadBox}>
                                <Pressable android_ripple={{ color: Color.lightRecBlue }} onPress={onSendRequest} style={styles.outlineButton}>
                                    <Text style={styles.buttonText} >Send Request <Icon name="send" size={15} color={Color.blackRecColor}></Icon> </Text>
                                </Pressable>
                                <View style={styles.statusView}>
                                    {(visitStatus == 'R_STATUS') ? (
                                        <Pressable onPress={()=>{setisitStatus(true);getTodayNotifications()}} style={{borderWidth:1,borderColor:Color.redRecColor,borderRadius:25,paddingTop:2,paddingBottom:2,paddingLeft:3,paddingRight:3}}>
                                            <Text style={styles.statusRText}>Status <Icon name="check-circle" style={{elevation:10}} size={20} color={Color.redRecColor}></Icon>
                                        </Text>
                                        </Pressable>
                                    ) : (visitStatus == 'S_STATUS') ? (
                                        <Pressable onPress={()=>{setisitStatus(true);getTodayNotifications()}} style={{borderWidth:1,borderColor:Color.greenRecColor,borderRadius:25,paddingTop:2,paddingBottom:2,paddingLeft:3,paddingRight:3}}>
                                        <Text style={styles.statusSText}>Status <Icon name="check-circle" style={{elevation:10}} size={18} color={Color.greenRecColor}></Icon>
                                        </Text>
                                        </Pressable>
                                    ) : (
                                        <Text style={styles.statusText}>Status <Icon name="check-circle" size={18} color={Color.blackRecColor}></Icon></Text>
                                    )}
                                    <Icon name="lock-reset" size={30} onPress={()=>resetVisitForm()} style={{textAlign:'right',marginTop:6,marginHorizontal: Dimensions.get('window').width > 756 ? 30 : 30 }} color={Color.blackRecColor}></Icon>
                                </View>
                            </View>
                        </View>
                        <View style={styles.remarkInputView}>
                            <Text
                                onPress={handleCameraLaunch}
                                style={{ marginRight: 'auto', marginLeft: 10, textAlign: 'center', color: 'blue', borderBottomWidth: 1, borderBottomColor: 'blue' }}>Take Photo</Text>
                        </View>
                        <View style={styles.remarkInputView1}>
                            <KeyboardAvoidingView keyboardVerticalOffset={-1200} behavior="padding">
                            <TextInput
                                value={remarks}
                                multiline={true}
                                numberOfLines={10}
                                onChangeText={rems => setRemarks(rems)}
                                placeholderTextColor={Color.blackRecColor} placeholder="Remarks"
                                style={styles.remarkInput}></TextInput>
                            </KeyboardAvoidingView>
                        </View>
                    </View>
                </View>
                <Overlay isVisible={isLoaderTrue} statusBarTranslucent={true}  overlayStyle={{backgroundColor:'white',borderRadius:20}}>
                    <ActivityIndicator style={{ backfaceVisibility: 'hidden' }} size={60} color={Color.blueRecColor}></ActivityIndicator>   
                </Overlay>
                <Overlay isVisible={isitStatus} overlayStyle={{width:'80%',borderRadius:20,backgroundColor:Color.lightRecBlue,maxHeight:400}}>
                <Icon name="close" onPress={()=>{setisitStatus(false)}} color={Color.darkRecGray} style={{textAlign:'right'}} size={40}></Icon>
                <ScrollView>
                    {totalView.length==0?                    <ActivityIndicator style={{ backfaceVisibility: 'hidden' }} size={60} color={Color.blueRecColor}></ActivityIndicator>   :
                                <View style={{width:Dimensions.get('window').width >756? '96%':'92%',marginHorizontal:10}}>
                                {totalView.map((l, i) => (
                                  <ListItem containerStyle={{backgroundColor:Color.whiteRecColor,borderRadius:20,padding:10,margin:1 }} key={i} bottomDivider onPress={() => {
                                  }}>
                                    <ListItem.Content>
                                      <ListItem.Title>{l.VisitorName}</ListItem.Title>
                                      <ListItem.Subtitle style={{ color: Color.blackRecColor, }}>Place: {l.VisitTranVisitorFrom}</ListItem.Subtitle>
                                      <ListItem.Subtitle style={{ color: Color.blackRecColor }}>Mobile No: {l.VisitorMobileNo}</ListItem.Subtitle>
                                      <ListItem.Subtitle style={{ color: Color.blackRecColor }}>Purpose: {l.VisitTranPurpose}</ListItem.Subtitle>
                                      <ListItem.Subtitle style={{ color: Color.blackRecColor }}>Date: {l.VisitTranCheckinTime.split('T')[1].split('.',1) + " " + (parseInt(l.VisitTranCheckinTime.split('T')[1].split(':')[0].toString()) > 12 ? 'PM':'AM')} - {new Date(l.VisitTranCheckinTime).toDateString()}</ListItem.Subtitle>
                                      <ListItem.Subtitle style={{ color: Color.blackRecColor }}>Reason: {l.VisitTranReason}</ListItem.Subtitle>
                                      <ListItem.Subtitle style={{ color: Color.blackRecColor }}>Remarks: {l.VisitTranRemarks}</ListItem.Subtitle>
                                      <ListItem.Subtitle style={{ color: Color.blackRecColor, marginLeft: 'auto', top: Dimensions.get('window').width > 756 ? -50 : -30 }}>
                                        {l.VisitTranVisitStatus == 'R' || l.VisitTranVisitStatus == '' ? (
                                          <Icon color={Color.redRecColor} size={Dimensions.get('window').width > 756 ? 60 : 30} name="cancel"></Icon>
                                        ) : (
                                          <Icon color={Color.greenRecColor} size={Dimensions.get('window').width > 756 ? 60 : 30} name="check-circle"></Icon>
                                        )}
                                      </ListItem.Subtitle>
                                    </ListItem.Content>
                                  </ListItem>
                                ))}
                                </View>}
            </ScrollView>
            </Overlay>
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
        width: Dimensions.get('window').width > 756 ? 200 : 150,
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
        marginTop: 30,
        gap: 3,
        width: "100%",
        paddingHorizontal: 10,
        marginBottom: 5,
    },
    inputView1: {
        marginTop: 0,
        gap: 3,
        width: "100%",
        paddingHorizontal: 10,
        marginBottom: 5,
    },
    input: {
        height: Dimensions.get('window').width > 756 ? 50 : 40,
        paddingHorizontal: 10,
        borderBottomWidth: 1.5,
        borderBottomColor: Color.darkRecGray,
        borderTopRightRadius: 11,
        borderTopLeftRadius: 11,
        color: Color.blackRecColor,
        backgroundColor: Color.lightNewGrey,
        marginHorizontal: 20,
        marginBottom: Dimensions.get('window').width > 756 ? 10 : 8
    },
    remarkInputView: {
        marginTop: Dimensions.get('window').width > 756 ? 160 : 150,
        width: '100%',
        padding: 20,
    },
    remarkInputView1: {
        width: '100%',
        padding: 20,
    },
    remarkInput: {
        backgroundColor: Color.lightNewGrey,
        borderBottomColor: Color.darkRecGray,
        borderBottomWidth: 1.5,
        borderTopRightRadius: 11,
        borderTopLeftRadius: 11,
        color: Color.blackRecColor,
        textAlignVertical: 'top',
        height: Dimensions.get('window').width > 756 ? 300 : 137,
    },
    dropdown: {
        height: Dimensions.get('window').width > 756 ? 50 : 40,
        borderBottomColor: Color.darkRecGray,
        borderBottomWidth: 1.5,
        marginHorizontal: 20,
        backgroundColor: Color.lightNewGrey,
        borderTopRightRadius: 11,
        borderTopLeftRadius: 11,
        marginBottom: Dimensions.get('window').width > 756 ? 5 : 8
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
        color: Color.blackRecColor
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    centeredViews: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
    },
    modalView: {
        margin: 10,
        width: '60%',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
    },
    buttoonIconSe: {
        borderRadius: 100, borderColor: Color.greenRecColor,
        shadowColor: Color.greenRecColor,
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 0.1
    },
    buttoonIconSe1: {
        borderRadius: 100, borderColor: Color.redRecColor,
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
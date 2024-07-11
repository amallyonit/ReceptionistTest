"use strict"
import React, { useEffect, useState } from "react"
import { ActivityIndicator, Button, Dimensions, FlatList, Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native"
import Color from "../theme/Color"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import Fonts from "../theme/Fonts"
import { DelpickData, InfoFormProps, ItemDescription, UserLDData, UserLoginLocation } from "../models/RecepModels"
import { CheckBox, ListItem, Overlay } from "react-native-elements"
import LinearGradient from "react-native-linear-gradient"
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { launchCamera, CameraOptions } from 'react-native-image-picker';
import AsyncStorage from "@react-native-async-storage/async-storage"
import { MiscStoreKeys } from "../constants/RecStorageKeys"
import { Dropdown } from "react-native-element-dropdown"
import { GetUsersByLocation } from "../requests/recHomeRequest"
import { GenerateGateEntry, GetTransportNames, GetVehicleDetailByNumber, GetVehicleNumbers, UpdateEntryStatus, UpdateOutTime } from "../requests/recProdRequest"
const camLogo = require("../../assets/recscreen/CAMERA.png")

const FormDeliveryScreen = ({ route, navigation }: any) => {
    let typeFormData = {
        locationCode: '',
        imageDatas: ''
    }
    const data: InfoFormProps = route.params['propData']
    let dataList = DelpickData
    const [selectedImage, setSelectedImage] = useState(null);
    const [usrLcton, setUsrLcton] = useState("")
    const [imageBase, setBase64] = useState("")
    const [itemList, setItemList] = useState<ItemDescription[]>([])
    const [itemName, setitemName] = useState("")
    const [itemQty, setitemQty] = useState("")
    const [billNo,setBillNo] = useState("")
    const [partyName,setPartyName] = useState("")
    const [location, setLocations] = useState<UserLoginLocation[]>([])
    const [userslst, setUserlist] = useState([])
    const [date, setDate] = useState(new Date());
    const [perrsoname,setPersoname] = useState()
    const [perrsontok,setPersonTok] = useState()
    const [drivmob, setDrivMob] = useState("")
    const [drivname, setDriveName] = useState("")
    const [transPortName,setTranPortName] = useState("")
    const [viewUser, setViewUser] = useState<UserLDData>()
    const [inout, setInOut] = useState('D')
    const [isLoaderTrue,setisLoaderTrue] = useState(false)
    const [vehiclLis, setVehicleList] = useState([])
    const [tranNames,setTranNames] = useState([])
    const [status,setStatus] = useState(false)
    const [outStatus,setOutStatus]=useState(false)
    useEffect(() => {
        getUserData()
        getUsers()
        getVehicleNumber()
        getTranNames()
    }, [])
    const onChange = (event: any, selectedDate: any) => {
        const currentDate = selectedDate;
        setDate(currentDate);
    };
    
    const getTranNames =  async () =>{
       try {
            await GetTransportNames().then((response)=>{
                console.log("response tran names ",response?.data.Data)
                setTranNames(response?.data.Data)
            }).catch((error)=>{
                console.log("error ",error)
            })
       } catch (error) {
            console.log("error ",error)
       }
    }

    const getVehicleNumber = async ()=>{
        let data = {
            token:'sample test'
        }
        try {
            await GetVehicleNumbers(data).then((response)=>{
                console.log("response",response?.data.Data)
                setVehicleList(response?.data.Data)
                setQuery("")
            }).catch((error)=>{
                console.log("error ",error)
            })
        } catch (error) {
            console.log("error ",error)
        }
    }
    
    const getUsers = async () => {
        setUsrLcton('')
        const data: any = await AsyncStorage.getItem(MiscStoreKeys.EZ_LOGIN)
        const vals = JSON.parse(data)
        setLocations(vals.Data[1])
        setUsrLcton(location[0]?.LocationCode)
        getUsersByLocationName(usrLcton)
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

    const AddItem = () => {
        let data: ItemDescription = {
            ProdMovDetItems: itemName,
            ProdMovDetItemQty: Number(itemQty),
            ProdMovDetBillNumber:billNo,
            ProdMovDetPartyName:partyName
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
        setViewUser(vals.Data[0][0])
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

    const resetData = () =>{
        setDrivMob('')
        setTranPortName('')
        setDriveName('')
        setInOut('D')
    }

    const getVechicleno = async (vehno:any) => {
        resetData()
        AsyncStorage.setItem('ProvMoveCode',JSON.stringify("PM_EMPTY"))
        try {
            let data = {
                ProdMovVehicleNo:query==""?vehno:query
            }
            await GetVehicleDetailByNumber(data).then((response)=>{
                console.log("code ",response?.data.Data[0].ProdMovImage)
                AsyncStorage.setItem('ProvMoveCode',JSON.stringify(response?.data.Data[0].ProdMovCode))
                setDrivMob(response?.data.Data[0].ProdMovMobileNo)
                setTranPortName(response?.data.Data[0].ProdMovTransporter)
                setDriveName(response?.data.Data[0].ProdMovDriverName)
                setInOut(response?.data.Data[0].ProdMovType)
                setBase64(response?.data.Data[0].ProdMovImage)
            })
        } catch (error) {
            console.log("error ",error)
        }
    }
    const [query, setQuery] = useState("");
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);

    const handleInputChange = (text: any) => {
        setQuery(text);
        filterSuggestions(text);
        if (filteredSuggestions.length == 0) {
            setBase64("")
        }
    };

    const checkOutApproval =async ()=>{
        const CodeProv = await AsyncStorage.getItem('ProvMoveCode')
        let CodeParse = JSON.parse(CodeProv!)
        let payload = {
            ProdMovCode:CodeParse,
            ProdMovOutTime:new Date().toISOString(),
        }
        if(CodeParse!='PM_EMPTY'){
            setOutStatus(true)
            try {
                await UpdateOutTime(payload).then((response)=>{
                    console.log("response data.Data ",response?.data)
                    if(response?.data.Status){
                        resetData()
                        setInterval(()=>{
                            setOutStatus(false)
                        },3000)
                        getVehicleNumber()
                    }
                }).catch((error)=>{
                    console.log("error ",error)
                })
            } catch (error) {
                console.log("error ",error)
            }
        }
    }

    const selfApproveStatus = async () =>{
        const CodeProv = await AsyncStorage.getItem('ProvMoveCode')
        let CodeParse = JSON.parse(CodeProv!)
        let payload = {
            ProdMovCode:CodeParse,
            EntryStatus:'A'
        }
        if(CodeParse=='PM_EMPTY'){

        }else{
            setisLoaderTrue(true)
            try {
                await UpdateEntryStatus(payload).then((response)=>{
                    console.log("response data ",response?.data.Data);
                    AsyncStorage.setItem('ProvMoveCode',JSON.stringify("PM_EMPTY"))
                    setisLoaderTrue(false)
                }).catch((error)=>{
                    console.log("error ",error)
                    setisLoaderTrue(false)
                })
            } catch (error) {
                console.log("error ",error)
                setisLoaderTrue(false)
            }
        }
    }

    const filterSuggestions = (text: any) => {
        const filtered = vehiclLis.filter((item: any) =>
            item.ProdMovVehicleNo.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredSuggestions(filtered);
    };

    const handleSelectSuggestion = (item: any) => {
        setQuery(item.ProdMovVehicleNo);
        setFilteredSuggestions([]);
    };

    const sentRequest = async () =>{
        if(drivmob!="" && drivname!="" && query!="" && (perrsoname!="" || perrsoname!=undefined) && perrsontok!=""){
            setisLoaderTrue(true)
            let data = {
                ProductItem:{
                ProdMovInTime:date,
                ProdMovVehicleNo:query,
                ProdMovMobileNo:drivmob,
                ProdMovDriverName:drivname,
                ProdMovTransporter:transPortName,
                ProdMovType:inout,
                ProdMovImage:imageBase,
                ProdMovOutTime:null,
                ProdMovAuthorizedPerson:perrsoname,
                ProdMovCode:"",
                ProMovToken:perrsontok,
                },
                TotalItem:itemList
            }
            await GenerateGateEntry(data).then((response)=>{
                console.log("response ",response?.data)
                    setisLoaderTrue(false)
                if(response?.data.Status){
                    setStatus(true)
                    AsyncStorage.setItem('ProvMoveCode',JSON.stringify(response.data.Data))
                }
            }).catch((error)=>{
                console.log("error ",error)
            })
        }else{
            setisLoaderTrue(false)
        }
    }
    return (
        <SafeAreaView>
            <View style={{ width: '100%', alignItems: 'center' }}>
                <View style={{ marginTop: Dimensions.get('window').width > 756 ? 10 : 3.6, width: Dimensions.get('window').width > 756 ? '96%' : '85%', height: 20, alignItems: 'center', position: 'relative', borderRadius: 5, backgroundColor: Color.blueRecColor, borderColor: Color.blueRecColor, borderWidth: 1 }}>
                    <Text style={{ color: Color.whiteRecColor, fontSize: 16, fontWeight: '500', textAlign: 'center' }}>{viewUser?.UserName} - {viewUser?.LocationPremise}</Text>
                </View>
                <View style={{ width: '100%',marginBottom:0 }}>
                    <TextInput
                        style={[styles.input, { borderBottomColor: query=="" ? Color.redRecColor : Color.darkRecGray, marginHorizontal: Dimensions.get('window').width > 756 ? 30 : 10 }]}
                        value={query}
                        onChangeText={handleInputChange}
                        placeholder="Vehicle number..."
                        placeholderTextColor={Color.blackRecColor}
                    />
                    <View style={{width:100,marginLeft:'auto',marginHorizontal:25,marginTop:5}}>
                    <Button onPress={()=>getVechicleno(query)} color={Color.blueRecColor} title="Search">
                    </Button>
                    </View>
                    <FlatList
                        data={filteredSuggestions}
                        renderItem={({ item }: any) => (
                            <Pressable onPress={() => handleSelectSuggestion(item)}>
                                <Text style={{ padding: 15, width: '100%', color: Color.blackRecColor, borderBottomColor: Color.lightGreyRecColor, borderBottomWidth: 1 }}>{item.ProdMovVehicleNo}</Text>
                            </Pressable>
                        )}
                        keyExtractor={(item, index) => index.toString()}
                        style={{
                            maxHeight: 200, marginTop: 40, marginHorizontal: 20, position: 'absolute', zIndex: 1, backgroundColor: '#fff',
                            width: Dimensions.get('window').width > 756 ? 754 : 350
                        }}
                    />
                </View>
            </View>
            <Overlay isVisible={isLoaderTrue} statusBarTranslucent={true}  overlayStyle={{backgroundColor:'white',borderRadius:20}}>
                    <ActivityIndicator style={{ backfaceVisibility: 'hidden' }} size={60} color={Color.blueRecColor}></ActivityIndicator>   
            </Overlay>
            <Overlay isVisible={outStatus} statusBarTranslucent={true}  overlayStyle={{backgroundColor:'white',borderRadius:20}}>
                    <Text style={{color:Color.greenRecColor}}>Successfully Checked Out <Icon name="check-circle" size={25} color={Color.greenRecColor}></Icon></Text>
            </Overlay>
            <ScrollView contentContainerStyle={{ width: '100%', alignItems: 'center', paddingBottom: 10 }}>
                <View style={styles.inputView}>
                    <View style={{ flexDirection: 'row' }}>
                        <TextInput placeholderTextColor={Color.blackRecColor} value={date.toISOString().split('T')[0]+' '+date.toLocaleTimeString()} onPressIn={showDatepicker} style={[styles.input, { width: '100%' }]} placeholder="InTime" />
                    </View>
                    <TextInput placeholderTextColor={Color.blackRecColor} value={drivmob} 
                    onChangeText={(event)=>setDrivMob(event)} style={[styles.input,{borderBottomColor:drivmob==""?Color.redRecColor:Color.blackRecColor}]} 
                    keyboardType="numeric" maxLength={10} placeholder='Driver Mobile No' />
                    <TextInput placeholderTextColor={Color.blackRecColor} 
                    value={drivname} onChangeText={(event)=>setDriveName(event)} 
                    style={[styles.input,{borderBottomColor:drivname==""?Color.redRecColor:Color.blackRecColor}]} 
                    placeholder='Driver Name' autoCapitalize='none' />
                    <Dropdown
                        style={[styles.dropdown, { borderBottomColor: Color.darkRecGray }]}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        iconStyle={styles.iconStyle}
                        data={tranNames}
                        itemTextStyle={{ color: Color.blackRecColor }}
                        search
                        maxHeight={300}
                        labelField="TransportName"
                        valueField="TransporterGstCode"
                        placeholder="Transports"
                        searchPlaceholder="Transport Names"
                        onChange={(item:any) => {
                            console.log("user item ", item)
                            setTranPortName(item.TransportName)
                        }}  
                    />
                    <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                        <CheckBox
                            title={'Delivery'}
                            checked={inout === 'D'}
                            onPress={() => setInOut('D')}
                            checkedIcon="dot-circle-o"
                            uncheckedIcon="circle-o"
                            containerStyle={{ backgroundColor: 'transparent' }}
                        />
                        <CheckBox
                            title={'Pickup'}
                            checked={inout === 'P'}
                            onPress={() => setInOut('P')}
                            checkedIcon="dot-circle-o"
                            uncheckedIcon="circle-o"
                            containerStyle={{ backgroundColor: 'transparent' }}
                        />
                    </View>
                    <Dropdown
                        style={[styles.dropdown, { borderBottomColor: usrLcton == '' ? Color.redRecColor : Color.darkRecGray }]}
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
                        onChange={(item) => {
                            setUsrLcton(item.LocationCode)
                            console.log("user item ", item)
                            getUsersByLocationName(usrLcton)
                        }}  
                    />
                    <Dropdown
                        style={[styles.dropdown, { borderBottomColor: Color.darkRecGray }]}
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
                        searchPlaceholder="Search...locations" onChange={(item:any)=>{
                            console.log("data item ",item)
                            setPersoname(item.UserName)
                            setPersonTok(item.UserDeviceToken)
                        }} />
                </View>
                <View style={styles.boxRow1}>
                    <View style={{ backgroundColor: Color.lightGreyRecColor, flex: 1, marginHorizontal: 22, flexDirection: "row", flexWrap: "wrap" }}>
                        <TextInput placeholderTextColor={Color.blackRecColor}
                        value={billNo} onChangeText={(name) => setBillNo(name)}
                         style={[styles.input, { width: '60%' }]} placeholder='Bill Number' autoCapitalize='none' />
                        <TextInput placeholderTextColor={Color.blackRecColor}
                            value={date.toLocaleTimeString()} onPressIn={showDatepicker}
                            style={[styles.input, { width: '40%' }]} placeholder='Date' autoCapitalize='none' />
                        <TextInput placeholderTextColor={Color.blackRecColor} 
                        value={partyName} onChangeText={(name) => setPartyName(name)}
                        style={[styles.input, { width: '100%' }]} placeholder='Party Name' autoCapitalize='none' />
                        <TextInput
                            value={itemName} onChangeText={(name) => setitemName(name)}
                            placeholderTextColor={Color.blackRecColor} style={[styles.input, { width: '70%' }]} placeholder="item description" />
                        <TextInput
                            value={itemQty}
                            onChangeText={(name) => setitemQty(name)}
                            placeholderTextColor={Color.blackRecColor} style={[styles.input, { width: '30%' }]} keyboardType="numeric" placeholder="item qty..." />
                        <Pressable style={[styles.uploadBox2, { marginLeft: 'auto', marginTop: 10, marginRight: 12, marginBottom: 10 }]}>
                            <Pressable style={styles.cusButton1} onPress={()=>{if(billNo!="" && partyName!=""){
                                AddItem()
                            }}}>    
                                <Text style={{ color: Color.blackRecColor, padding: 4, textAlign: 'center', fontSize: 18 }}>
                                    Add <Icon name="plus-circle-outline" size={20}></Icon>
                                </Text>
                            </Pressable>
                        </Pressable>
                        <View style={{ width: '100%', flexDirection: 'row', flexWrap: 'wrap' }}>
                            {
                                itemList.map((item, index) => (
                                    <ListItem style={{ width: '98%', marginHorizontal: 5, marginBottom: 5, borderColor: Color.lightGreyRecColor, borderWidth: 1 }}
                                        linearGradientProps={{
                                            colors: [Color.lightGreyRecColor, Color.lightGreyRecColor],
                                        }}
                                        ViewComponent={LinearGradient} key={index} bottomDivider>
                                        <ListItem.Content>
                                            <ListItem.Title style={{ color: Color.blackRecColor, borderRadius: 50, padding:0 }}>Invoice: {index + 1}</ListItem.Title>
                                            <ListItem.Subtitle>Bill No:{item.ProdMovDetBillNumber}</ListItem.Subtitle>
                                            <ListItem.Subtitle>Party Name:{item.ProdMovDetPartyName}</ListItem.Subtitle>
                                            <ListItem.Subtitle>Total Qty:{item.ProdMovDetItemQty}</ListItem.Subtitle>
                                        </ListItem.Content>
                                    </ListItem>
                                ))
                            }
                        </View>
                    </View>
                </View>
                <View style={styles.boxRow2}>
                    <View style={styles.uploadBox}>
                        {imageBase != "" ? <Image
                            source={{ uri: `data:image/png;base64,${imageBase}` }}
                            style={styles.imageSize}></Image> : <Image
                                source={camLogo}
                                style={styles.imageSize}></Image>}
                        <Text
                            onPress={handleCameraLaunch}
                            style={{ marginRight: 'auto', marginLeft: 10, textAlign: 'center', color: 'blue', borderBottomWidth: 1, borderBottomColor: 'blue' }}>Take Photo</Text>
                    </View>
                    <View style={styles.uploadBox}></View>
                    <View style={styles.uploadBox}>
                        <View style={styles.outlineButton}>
                            <Text style={styles.buttonText} onPress={sentRequest}>Send Request <Icon name="send" size={15} color={Color.blackRecColor}></Icon> </Text>
                        </View>
                        <View style={styles.statusView}>
                            <Text style={[styles.statusText,{color:status?Color.redRecColor:Color.blackRecColor}]}>Status <Icon name="check-circle" size={25} color={ status?Color.redRecColor:Color.blackRecColor}></Icon></Text>
                        </View>
                    </View>
                </View>
                <View style={[styles.boxRow2,{marginBottom:100}]}>
                    <View style={[styles.outlineButton,{marginLeft:0}]}>
                        <Text style={styles.buttonText} onPress={selfApproveStatus}>Self Approve<Icon name="send" size={15} color={Color.blackRecColor}></Icon></Text>
                    </View>
                    <View style={styles.outlineButton}>
                        <Text style={styles.buttonText} onPress={checkOutApproval}>Check Out<Icon name="send" size={15} color={Color.blackRecColor}></Icon></Text>
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
        borderBottomColor: Color.blackRecColor,
        color: '#464646',
        borderBottomWidth: 1,
        borderRadius: 50
    },
    dropdown: {
        height: Dimensions.get('window').width > 756 ? 50 : 40,
        borderBottomColor: Color.darkRecGray,
        borderBottomWidth: 1.5,
        marginHorizontal: 20,
        backgroundColor: 'transparent',
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
})
export default FormDeliveryScreen 
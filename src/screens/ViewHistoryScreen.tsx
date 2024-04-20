"use strict"
import  React,{ useEffect, useState } from "react"
import { ActivityIndicator, Dimensions, FlatList, Image, Modal, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native"
import Color from "../theme/Color"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { ListItem, Overlay } from "react-native-elements"
import { ViewNotification } from "../models/RecepModels"
import { GetAllRevisitorsData, GetPhoneNumberDetails } from "../requests/recHomeRequest"


const camLogo = require("../../assets/recscreen/CAMERA.png")


const ViewHistoryScreen = ({ navigation }: any) => {
    const [phone, setPhonenos] = useState([])
    const [name, setName] = useState("")
    const [viewLog, setViewLog] = useState<ViewNotification>()
    const [isLoader, setIsLoader] = useState(false)
    const [totalView, setTotalView] = useState<ViewNotification[]>([])
    const [noReData,setNoReData]=useState(false)
    useEffect(() => {
        // getVisiorNumbers()
        getTodayNotifications()
        setTotalView([])
        setViewLog(undefined)
    }, [])

    const [query, setQuery] = useState('');
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);

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

    const handleInputChange = (text: any) => {
        console.log("input phone ", text);
        
        setQuery(text);
        filterSuggestions(text);
    };

    const filterSuggestions = (text: any) => {
        const filtered = phone.filter((item: any) =>
            item.VisitorMobileNo.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredSuggestions(filtered);
    };

    const handleSelectSuggestion = (item: any) => {
        console.log("item ", item)
        setQuery(item.VisitorMobileNo);
        setFilteredSuggestions([]);
        getDetailsByPhoneno(item.VisitorMobileNo)
    };

    const getDetailsByPhoneno = async (value: any,type?:any) => {
        setIsLoader(true)
        let currentData =  new Date().toISOString().split('T',1)[0].split('-')
        let formatDate =  currentData[2]+'/'+currentData[1]+'/'+currentData[0]
        let payload = {
            VisitorMobileNo: parseInt(query)==10 ? query : value,
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
                        setViewLog(undefined)
                        setName('')
                        setTotalView(notData[0])
                        setViewLog(notData[0][0])
                        setName(notData[0][0].VisitorName)
                    }else{
                        setNoReData(true)
                    }
                    setIsLoader(false)
                }
            }).catch((error: any) => {
                console.log("error ", error)
                setIsLoader(false)
            })
        } catch (error) {
            console.log("error ", error)
        }
    }

    const getTodayNotifications = async () => {
        setIsLoader(true)
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
                        setViewLog(undefined)
                        setName('')
                        setTotalView(notData[0])
                    }
                    setIsLoader(false)
                }
            }).catch((error: any) => {
                console.log("error found ", error)
                setIsLoader(false)
            })
        } catch (error) {
            console.log("error found", error)
            setIsLoader(false)
        }
    }

    return (
        <SafeAreaView>
            <View style={styles.container}>
                <View style={styles.boxRow}>
                    <View style={styles.uploadBox}>
                        <View style={{ width: '100%' }}>
                            <TextInput
                                style={{ height: 40,borderTopRightRadius:11,
                                    borderTopLeftRadius:11,backgroundColor:Color.lightGreyRecColor, color: Color.blackRecColor, borderBottomColor: Color.blackRecColor, borderBottomWidth: 1, marginHorizontal: 10 }}
                                value={query}
                                onPressIn={() => { getVisiorNumbers() }}
                                onChangeText={handleInputChange}
                                autoComplete="off"
                                keyboardType="numeric"
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
                                    maxHeight: 200, marginTop: 40, marginHorizontal:Dimensions.get('window').width > 756 ?20: 10, position: 'absolute', zIndex: 1, backgroundColor: '#fff',
                                    width: Dimensions.get('window').width > 756 ? 560 : 280
                                }}
                            />
                        </View>
                        <View style={styles.inputView}>
                            <TextInput value={name} onChangeText={setName} style={styles.input} placeholderTextColor={Color.blackRecColor} keyboardType="default" placeholder='Name' autoCapitalize='none' />
                        </View>
                    </View>
                    <View style={styles.uploadBox1}>
                        <Image source={viewLog?.VisitorImage != "" && viewLog?.VisitorImage!=undefined ? { uri: `data:image/png;base64,${viewLog.VisitorImage}` } : camLogo} style={styles.imageSize}></Image>
                    </View>
                </View>
                <Overlay isVisible={isLoader} statusBarTranslucent={true}  overlayStyle={{backgroundColor:'white',borderRadius:20}}  onBackdropPress={()=>{setIsLoader(true)}}>
                    <ActivityIndicator style={{ backfaceVisibility: 'hidden' }} size={60} color={Color.blueRecColor}></ActivityIndicator>   
                </Overlay>
            </View>
            <ScrollView style={{marginTop:Dimensions.get('window').height * 0.15}}>
            <View style={{width:Dimensions.get('window').width >756? '96%':'92%',marginHorizontal:15}}>
                {totalView.map((l, i) => (
                  <ListItem containerStyle={{backgroundColor:Color.whiteRecColor}} key={i} bottomDivider onPress={() => {
                  }}>
                    <ListItem.Content>
                      <ListItem.Title>{l.VisitorName}</ListItem.Title>
                      <ListItem.Subtitle style={{ color: Color.blackRecColor, }}>Place: {l.VisitTranVisitorFrom}</ListItem.Subtitle>
                      <ListItem.Subtitle style={{ color: Color.blackRecColor }}>Mobile No: {l.VisitorMobileNo}</ListItem.Subtitle>
                      <ListItem.Subtitle style={{ color: Color.blackRecColor }}>Purpose: {l.VisitTranPurpose}</ListItem.Subtitle>
                      <ListItem.Subtitle style={{ color: Color.blackRecColor }}>Date: {l.VisitTranCheckinTime.split('T')[1].split('.',1) + " " + (parseInt(l.VisitTranCheckinTime.split('T')[1].split(':')[0].toString()) >= 12 ? 'PM':'AM')} - {new Date(l.VisitTranCheckinTime).toDateString()}</ListItem.Subtitle>
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
                </View>
            </ScrollView>
            {viewLog==undefined && <View style={{ width: '93%', padding: 10, borderWidth: 5, borderColor: Color.lightGreyRecColor,marginHorizontal:20 }}>
            <Text style={{ textAlign: 'center', color: Color.blackRecColor }}>No Notification Today</Text>
          </View>}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    navContainer: {
        width: '100%',
        backgroundColor: Color.blueRecColor,
        height: 60, alignItems: 'center', flexDirection: 'row'
    },
    navContText: {
        color: Color.whiteRecColor,
        fontSize: 16,
        flex: 1.6,
        marginLeft: 15
    },
    boxRow: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: "100%",
        paddingHorizontal: Dimensions.get('window').width * 0.03,
    },
    uploadBox: {
        width: '80%',
        paddingTop: Dimensions.get('window').height * 0.01,
        marginTop:5
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
        borderRadius: 0,
        backgroundColor:Color.lightGreyRecColor,
        borderTopRightRadius:11,
        borderTopLeftRadius:11
    },
})

export default ViewHistoryScreen
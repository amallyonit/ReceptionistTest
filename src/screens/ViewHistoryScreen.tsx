"use strict"
import React, { useEffect, useState } from "react"
import { ActivityIndicator, Dimensions, FlatList, Image, Modal, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native"
import Color from "../theme/Color"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import Fonts from "../theme/Fonts"
import { ListItem } from "react-native-elements"
import LinearGradient from 'react-native-linear-gradient';
import { UserPayload, ViewHistory } from "../models/RecepModels"
import { GeViewHistoryData, GetAllRevisitorsData, GetPhoneNumberDetails } from "../requests/recHomeRequest"
import { MiscStoreKeys } from "../constants/RecStorageKeys"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { CommonModal } from "../components/RecCommonModal"
import { color } from "react-native-elements/dist/helpers"

const camLogo = require("../../assets/recscreen/CAMERA.png")


const ViewHistoryScreen = ({ navigation }: any) => {
    const [phone,setPhonenos]= useState([])
    const [name,setName] = useState("")
    const [viewLog,setViewLog] = useState<ViewHistory>({VisitorImage:'',VisitorMobileNo:'',VisitorName:'',VisitTranVisitorFrom:''})
    const [viewList,setViewList] = useState<ViewHistory[]>([])
    const [isLoader,setIsLoader] = useState(false)
    const [userToken,setUserToken] = useState<UserPayload>({userid:'',token:''})
    useEffect(()=>{
        // getVisiorNumbers()
    },[])

    const [query, setQuery] = useState('');
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  
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

    const handleInputChange = (text:any) => {
      console.log("input phone ",text);
      setQuery(text);
      filterSuggestions(text);
    };
  
    const filterSuggestions = (text:any) => {
      const filtered = phone.filter((item:any) =>
        item.VisitorMobileNo.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredSuggestions(filtered);
    };
  
    const handleSelectSuggestion = (item:any) => {
    console.log("item ",item)
      setQuery(item.VisitorMobileNo);
      setFilteredSuggestions([]);
      getDetailsByPhoneno(item.VisitorMobileNo)
    };

    const getDetailsByPhoneno=async (value:any)=>{
        setIsLoader(true)
        let payload = {
            VisitorMobileNo:query=="" || query==undefined?value:query
        }
        console.log("payload ",payload)
        try {
           await GetPhoneNumberDetails(payload)?.then((response:any)=>{
                if(response.data.Status){
                    console.log("response ",response.data.Data[0]) 
                    setViewLog({VisitorImage:'',VisitorMobileNo:'',VisitorName:'',VisitTranVisitorFrom:''})   
                    setName('')
                    setViewLog(response.data.Data[0])
                    setName(response.data.Data[0].VisitorName)
                    setIsLoader(false)
                }
            }).catch((error:any)=>{
                console.log("error ",error)
            })
        } catch (error) {
            console.log("error ",error)
        }
    }
    return (
            <SafeAreaView>
                <View style={styles.container}>
                <View style={styles.boxRow}>
                    <View style={styles.uploadBox}>
                    <View style={{width:'100%'}}>
                    <TextInput
                        style={{ height: 40,color:Color.blackRecColor, borderBottomColor:Color.blackRecColor, borderBottomWidth: 1, marginHorizontal:20 }}
                        value={query}
                        onPressIn={()=>{getVisiorNumbers()}}
                        onChangeText={handleInputChange}
                        autoComplete="off"
                        keyboardType="numeric"
                        placeholder="Type Phone number..."
                        placeholderTextColor={Color.blackRecColor}
                    />
                     <FlatList
                        data={filteredSuggestions}
                        renderItem={({ item }:any) => (
                        <Pressable  onPress={() => handleSelectSuggestion(item)}>
                            <Text style={{ padding: 15,width:'100%',color:Color.blackRecColor,borderBottomColor:Color.lightGreyRecColor,borderBottomWidth:1 }}>{item.VisitorMobileNo}</Text>
                        </Pressable>
                        )}
                        keyExtractor={(item, index) => index.toString()}
                        style={{maxHeight:200,marginTop:40,marginHorizontal:20,position:'absolute',zIndex:1,backgroundColor:'#fff',
                        width:Dimensions.get('window').width > 756?560:280}}
                    />
                    </View>
                        <View style={styles.inputView}>
                            <TextInput value={name} onChangeText={setName} style={styles.input} placeholderTextColor={Color.blackRecColor} keyboardType="default" placeholder='Name' autoCapitalize='none' />
                        </View>
                    </View>
                    <View style={styles.uploadBox1}>
                        <Image source={viewLog.VisitorImage!="" ? {uri: `data:image/png;base64,${viewLog.VisitorImage}`}: camLogo} style={styles.imageSize}></Image>
                    </View>
                </View>
                <Modal
                    animationType="fade"
                    transparent={false}
                    statusBarTranslucent={true}
                    visible={isLoader}
                    onRequestClose={() => {
                        setIsLoader(!isLoader);
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
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    navContainer:{ 
        width: '100%',
        backgroundColor: Color.blueRecColor, 
        height: 60, alignItems: 'center', flexDirection: 'row'
    },
    navContText:{ 
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
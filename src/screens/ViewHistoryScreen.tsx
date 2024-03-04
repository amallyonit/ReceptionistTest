"use strict"
import React, { useEffect, useState } from "react"
import { Dimensions, Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native"
import Color from "../theme/Color"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import Fonts from "../theme/Fonts"
import { ListItem } from "react-native-elements"
import LinearGradient from 'react-native-linear-gradient';
import { UserPayload, ViewHistory } from "../models/RecepModels"
import { GeViewHistoryData } from "../requests/recHomeRequest"
import { MiscStoreKeys } from "../constants/RecStorageKeys"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { CommonModal } from "../components/RecCommonModal"
import { color } from "react-native-elements/dist/helpers"

const camLogo = require("../../assets/recscreen/CAMERA.png")


const ViewHistoryScreen = ({ navigation }: any) => {
    const [phone,setPhone]= useState("")
    const [name,setName] = useState("")
    const [viewLog,setViewLog] = useState<ViewHistory>({VisitorImage:'',VisitorMobileNo:'',VisitorName:'',VisitTranVisitorFrom:''})
    const [viewList,setViewList] = useState<ViewHistory[]>([])
    const [isLoader,setIsLoader] = useState(false)
    const [userToken,setUserToken] = useState<UserPayload>({userid:'',token:''})
    useEffect(()=>{
        genrateViews(true)
    },[])

    const genrateViews = (loaderTrue?:boolean)=>{
        try {
            AsyncStorage.getItem(MiscStoreKeys.EZ_LOGIN).then((response:any)=>{
               let items = JSON.parse(response)
               if(items.Status){
                let tokenPay:UserPayload={
                    userid:items.Data[0][0].UserCode,
                    token:items.Token
                }
                setUserToken(tokenPay)
                getViewHistoryByUser(tokenPay,loaderTrue)
                console.log("token ",tokenPay,userToken)
               }
             }).catch((error:any)=>{
               console.log("error response ",error)
             })
           } catch (error) {
               console.log("error ",error)
           }
    }
    const getViewHistoryByUser = (userpayld:UserPayload,loader?:boolean)=>{
        if(loader){
            setIsLoader(true)}else{setIsLoader(false)}
        try {
            GeViewHistoryData(userpayld)?.then((response)=>{
                console.log("response ",response.data.Status)
                if(response.data.Status){
                    setViewList(response.data.Data)
                    setIsLoader(false)
                }
            }).catch((error:any)=>{
                console.log("error ",error)
            })
        } catch (error) {
            
        }
    }

    const filterUserHistory = ()=>{
        let findLog = viewList.find((item)=>item.VisitorMobileNo==phone || item.VisitorName==name)
        console.log("finlog ",findLog)
        if(findLog!=undefined){
            setViewLog(findLog)
            setViewList(viewList.filter((item)=>item==findLog))
        }else{
            genrateViews(false)
            setViewLog({VisitorImage:'',VisitorMobileNo:'',VisitorName:'',VisitTranVisitorFrom:''})
        }
    }
    return (
            <SafeAreaView>
                <View style={styles.container}>
                <View style={styles.boxRow}>
                    <View style={styles.uploadBox}>
                        <View style={styles.inputView}>
                            <TextInput value={phone} placeholderTextColor={Color.blackRecColor} onKeyPress={filterUserHistory} onChangeText={setPhone} style={styles.input} keyboardType="numeric" 
                                maxLength={10}
                                placeholder='Mobile No.' autoCapitalize='none' />
                            <TextInput value={name} onKeyPress={filterUserHistory} onChangeText={setName} style={styles.input} placeholderTextColor={Color.blackRecColor} keyboardType="default" placeholder='Name' autoCapitalize='none' />
                        </View>
                    </View>
                    <View style={styles.uploadBox1}>
                        <Image source={viewLog.VisitorImage!=""? {uri: `data:image/png;base64,${viewLog.VisitorImage}`}: camLogo} style={styles.imageSize}></Image>
                    </View>
                </View>
                <View style={{ width: '95%',marginLeft:10, paddingTop:Dimensions.get('window').height * 0.14}}>
                {isLoader?<CommonModal confirm={isLoader}></CommonModal>:<ScrollView style={{maxHeight:Dimensions.get('window').height * 0.76,width:'100%',overflow:'scroll'}}>
                    {
                        viewList.map((item, index) => (
                            <ListItem onPress={()=>{
                                setViewLog(item)
                                setPhone(item.VisitorMobileNo)
                                setName(item.VisitorName)
                            }}
                            containerStyle={{borderBottomColor:Color.lightRecBlue,borderBottomWidth:2}}
                                linearGradientProps={{
                                    colors: [Color.lightGreyRecColor, Color.lightGreyRecColor],
                                }}
                                ViewComponent={LinearGradient} key={index} bottomDivider>
                                <ListItem.Content>
                                    <ListItem.Title>{item.VisitorName}</ListItem.Title>
                                    <ListItem.Subtitle>{item.VisitTranVisitorFrom}</ListItem.Subtitle>
                                </ListItem.Content>
                            </ListItem>
                        ))
                    }
                </ScrollView>}
                </View>
            </View>
            </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
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
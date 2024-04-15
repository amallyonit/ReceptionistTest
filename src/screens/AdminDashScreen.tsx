"use strict"
import React, { useEffect, useState } from "react"
import { ViewNotification } from "../models/RecepModels"
import { GetNotificationByUserCode } from "../requests/recAdminRequest"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { MiscStoreKeys } from "../constants/RecStorageKeys"
import { SafeAreaView } from "react-native-safe-area-context"
import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text, View } from "react-native"
import Color from "../theme/Color"
import { Button, Icon } from "react-native-elements"


const AdminDashScreen = () => { 
    const [viewNots, setViewNots] = useState<ViewNotification[]>([])
    useEffect(()=>{
        generateNotfis()
    },[])

    const generateNotfis =async  () => {
        const value:any = await AsyncStorage.getItem(MiscStoreKeys.EZ_LOGIN)
        const data = JSON.parse(value)
        try {
          GetNotificationByUserCode({UserCode: data.Data[0][0].UserCode})?.then((response) => {
            if (response.data.Status) {
              console.log("data resp ",response.data)
              setViewNots(response.data.Data[0])
            }
          }).catch((error: any) => {
            console.log("error ", error)
          })
        } catch (error) {
    
        }
    }

      return(
        <SafeAreaView style={styles.safecontainer}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.container}>
            <View style={{flex:1,flexDirection:'row',marginTop:30,marginBottom:30,justifyContent:'center',alignItems:'center',marginHorizontal:30}}>
              <View style={{width:'50%',borderRadius:20,padding:5,paddingBottom:10,elevation:5,backgroundColor:Color.whiteRecColor}}>
                <Icon color={Color.greenRecColor} size={Dimensions.get('window').width > 756?60: 30} name="check-circle"></Icon>
                <Text style={{textAlign:'center',color:Color.greenRecColor}}>Approved</Text>
                <Button buttonStyle={{backgroundColor:Color.greenRecColor,borderRadius:10,borderColor:Color.greenRecColor}} title={viewNots.length==0? <ActivityIndicator style={{ backfaceVisibility: 'hidden' }} size={20} color={Color.whiteRecColor}></ActivityIndicator> :String(viewNots.filter((item)=>item.VisitTranVisitStatus=='A').length)}></Button>
              </View>
              <View style={{width:'50%',marginLeft:10,borderRadius:20,padding:5,paddingBottom:10,elevation:5,backgroundColor:Color.whiteRecColor}}>
                <Icon color={Color.redRecColor} size={Dimensions.get('window').width > 756?60: 30} name="cancel"></Icon>
                <Text style={{textAlign:'center',color:Color.redRecColor}}>Rejected</Text>
                <Button buttonStyle={{backgroundColor:Color.redRecColor,borderRadius:10,borderColor:Color.whiteRecColor,borderWidth:1}} title={viewNots.length==0? <ActivityIndicator style={{ backfaceVisibility: 'hidden' }} size={20} color={Color.whiteRecColor}></ActivityIndicator> :String(viewNots.filter((item)=>item.VisitTranVisitStatus!='A').length)}></Button>
              </View>
            </View>
            {viewNots.length==0 && <View style={{width:'80%',padding:10,borderWidth:5,borderColor:Color.lightGreyRecColor}}>
              <Text style={{textAlign:'center',color:Color.blackRecColor}}>No Notification Today</Text>
            </View>}
            </View>
            </ScrollView>
            </SafeAreaView>
      )
    
}

const styles = StyleSheet.create({
    safecontainer: {
      flex: 1,
    },
    scrollView: {
        flex: 1,
      },
      container: {
        alignItems: "center",
      },
})

export default AdminDashScreen
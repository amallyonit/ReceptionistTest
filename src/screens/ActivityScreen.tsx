import React, { Children, useEffect, useState } from "react"
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import Color from "../theme/Color"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import Fonts from "../theme/Fonts"
import { UserPayload, ViewNotification } from "../models/RecepModels"
import LinearGradient from "react-native-linear-gradient"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { MiscStoreKeys } from "../constants/RecStorageKeys"
import { GetNotificationByUserCode } from "../requests/recAdminRequest"
import { Card } from "react-native-elements"

const camLogo = require("../../assets/recscreen/CAMERA.png")

const ActivityScreen = ({ route, navigation }: any) => {
    
    const [viewNots,setViewNots]=useState<ViewNotification[]>([])
    const [userToken,setUserToken] = useState<{UserCode:''}>({UserCode:''})
    
    useEffect(()=>{
        getNotifications()
    },[])

    const getNotifications = ()=>{
        try {
            AsyncStorage.getItem(MiscStoreKeys.EZ_LOGIN).then((response:any)=>{
               let items = JSON.parse(response)
               if(items.Status){
                let tokenPay = {
                    UserCode:items.Data[0][0].UserCode
                }
                setUserToken(tokenPay)
                generateNotfis(tokenPay)
               }
             }).catch((error:any)=>{
               console.log("error response ",error)
             })
           } catch (error) {
               console.log("error ",error)
           }
    }

    const generateNotfis = (data:any)=>{
        try {
            GetNotificationByUserCode(data)?.then((response)=>{
                console.log("response ",response.data.Status)
                if(response.data.Status){
                    setViewNots(response.data.Data[0])
                }
            }).catch((error:any)=>{
                console.log("error ",error)
            })
        } catch (error) {
            
        }
    }

    return (
        <View>
            <View style={styles.container}>
                <View style={{ width: '100%', marginBottom: Dimensions.get('window').height * 0.0, backgroundColor: Color.blueRecColor, height: 60, alignItems: 'center', flexDirection: 'row' }}>
                    <Text style={{ color: Color.whiteRecColor, fontSize: 16, flex: 1.6, marginLeft: 15 }}>
                        <Icon onPress={() =>
                            navigation.navigate("Login")
                        } name="arrow-left" size={28} color={Color.whiteRecColor}></Icon>
                    </Text>
                    <Text style={{ marginLeft: 10, color: Color.whiteRecColor, fontSize: 18, fontFamily: Fonts.recFontFamily.titleRecFont, flex: 2 }}>Notifications</Text>
                </View>
                <View style={{width: '95%'}}>
        <Card>
          <Card.Title>Notifications</Card.Title>
          <Card.Divider />
          {viewNots.map((u, i) => {
            return (
              <View key={i} style={styles.user}>
                <Image
                  style={styles.image}
                  source={camLogo}
                />
                <Text style={styles.name}>{u.VisitorName}</Text>
              </View>
              
            );
          })}
        </Card>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
    },
    cardGroup: {
        margin: Dimensions.get('window').height * 0.01,
        marginHorizontal:3,
        height: Dimensions.get('window').height * 0.1,
        backgroundColor: Color.whiteRecColor,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        elevation: 9,
    },
    fonts: {
        marginBottom: 8,
      },
      user: {
        flexDirection: 'row',
        marginBottom: 6,
        borderBottomWidth:1
      },
      image: {
        width: 100,
        height: 100,
        marginRight: 10,
      },
      name: {
        fontSize: 16,
        marginTop: 5,
      },
})
export default ActivityScreen
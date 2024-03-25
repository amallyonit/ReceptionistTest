import React, { Children, ReactElement, useEffect, useState } from "react"
import { Alert, BackHandler, Dimensions, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import Color from "../theme/Color"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import Fonts from "../theme/Fonts"
import { UserPayload, ViewNotification } from "../models/RecepModels"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { MiscStoreKeys } from "../constants/RecStorageKeys"
import { GetNotificationByUserCode } from "../requests/recAdminRequest"
import { Card } from "react-native-elements"
import NotificationPop from "../components/RecNotification"
const camLogo = require("../../assets/recscreen/CAMERA.png")

const ActivityScreen = ({ route, navigation }: any): ReactElement => {

  const [viewNots, setViewNots] = useState<ViewNotification[]>([])
  const [userToken, setUserToken] = useState<{ UserCode: '' }>({ UserCode: '' })
  const [confirm, setConfirm] = useState(false)

  useEffect(() => {
    getNotifications()
  },[])

  const getNotifications = () => {
    try {
      AsyncStorage.getItem(MiscStoreKeys.EZ_LOGIN).then((response: any) => {
        let items = JSON.parse(response)
        if (items.Status) {
          let tokenPay = {
            UserCode: items.Data[0][0].UserCode
          }
          setUserToken(tokenPay)
          generateNotfis(tokenPay)
        }
      }).catch((error: any) => {
        console.log("error response ", error)
      })
    } catch (error) {
      console.log("error ", error)
    }
  }

  const generateNotfis = (data: any) => {
    try {
      GetNotificationByUserCode(data)?.then((response) => {
        if (response.data.Status) {
          setViewNots(response.data.Data[0])
        }
      }).catch((error: any) => {
        console.log("error ", error)
      })
    } catch (error) {

    }
  }

  return (
    <SafeAreaView>
      
      <View style={styles.container}>
        <View style={{ width: '95%' }}>
          <Card>
            <Card.Title>Notifications</Card.Title>
            <Card.Divider />
            {viewNots.map((u, i) => {
              return (
                <View key={i} style={styles.user}>
                  <Image
                    style={styles.image}
                    source={{ uri:`data:image/png;base64,${u.VisitorImage}` }}
                  />
                  <Text style={styles.name} onPress={(item) => {
                    console.log("valur ", confirm)
                    setConfirm(true)
                  }}>{u.VisitorName}</Text>
                </View>

              );
            })}
          </Card>
        </View>
        {/* <NotificationPop confirm={true}></NotificationPop> */}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center", 
  },
  cardGroup: {
    margin: Dimensions.get('window').height * 0.01,
    marginHorizontal: 3,
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
    borderBottomWidth: 1
  },
  image: {
    borderRadius:100,
    width: 80,
    height: 80,
    marginRight: 10,
  },
  name: {
    fontSize: 16,
    marginTop: 5,
    color:Color.blackRecColor
  },
})
export default ActivityScreen
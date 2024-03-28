import React, { Children, ReactElement, useEffect, useState } from "react"
import { Alert, BackHandler, Button, Dimensions, Image, Pressable, RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import Color from "../theme/Color"
import { UserPayload, ViewNotification } from "../models/RecepModels"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { MiscStoreKeys } from "../constants/RecStorageKeys"
import { GetNotificationByUserCode } from "../requests/recAdminRequest"
import { Avatar, Badge, Card, ListItem } from "react-native-elements"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
const camLogo = require("../../assets/recscreen/CAMERA.png")

const ActivityScreen = ({ route, navigation }: any): ReactElement => {

  const [viewNots, setViewNots] = useState<ViewNotification[]>([])
  const [userToken, setUserToken] = useState<{ UserCode: '' }>({ UserCode: '' })
  const [confirm, setConfirm] = useState(false)
  const [refreshing, setRefreshing] = React.useState(false);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    getNotifications()
    setConfirm(false)
    const backAction = () => {
      Alert.alert("Hold on!", "Are you sure you want to go back?", [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel",
        },
        { text: "YES", onPress: () => BackHandler.exitApp() }
      ]);
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    const intervalId = setInterval(() => {
      getNotifications()
      setCounter(prevCounter => prevCounter + 1);
      console.log("counter ", counter)
    }, 5000); // 3000 milliseconds = 3 seconds

    return () => {
      backHandler.remove();
      clearInterval(intervalId)
    }
  }, [])

  const getNotifications = async () => {
    try {
      const vals = await AsyncStorage.getItem(MiscStoreKeys.EZ_LOGIN)
      console.log("vals ", vals)
      const dataVal = JSON.parse(vals!)
      console.log("data vals ", dataVal.Data[0][0].UserCode)

      let tokenPay = {
        UserCode: dataVal.Data[0][0].UserCode
      }
      setUserToken(tokenPay)
      generateNotfis(tokenPay)
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

  const [expanded, setExpanded] = useState(false)


  return (
    <SafeAreaView style={styles.safecontainer}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <View style={{ width: '95%' }}>
            <ListItem.Accordion
              content={
                <>
                  <ListItem.Content>
                    <ListItem.Title>
                      <View>
                        <Icon color={Color.blueRecColor} name="bell" size={30} />
                        <Badge
                          status="success"
                          value={viewNots.length}
                          containerStyle={{ position: 'absolute', top: -4, right: -4 }}
                        />
                      </View></ListItem.Title>
                  </ListItem.Content>
                </>
              }
              isExpanded={expanded}
              onPress={() => {
                setExpanded(!expanded);
              }}
            >
              {viewNots.map((l, i) => (
                <ListItem key={i} bottomDivider>
                  <Avatar avatarStyle={{ borderRadius: 50, borderWidth: 3, borderColor: Color.lightRecBlue }} size={100} title={l.VisitorName} source={{ uri: `data:image/png;base64,${l.VisitorImage}` }} />
                  <ListItem.Content>
                    <ListItem.Title>{l.VisitorName}</ListItem.Title>
                    <ListItem.Subtitle style={{ color: Color.blackRecColor, }}>Place: {l.VisitTranVisitorFrom}</ListItem.Subtitle>
                    <ListItem.Subtitle style={{ color: Color.blackRecColor }}>Mobile No: {l.VisitorMobileNo}</ListItem.Subtitle>
                    <ListItem.Subtitle style={{ color: Color.blackRecColor }}>Purpose: {l.VisitTranPurpose}</ListItem.Subtitle>
                    <ListItem.Subtitle style={{ color: Color.blackRecColor,marginLeft:'auto', top:Dimensions.get('window').width > 756?-50:-30}}>
                      {l.VisitTranVisitStatus=='R'?(
                       <Icon color={Color.redRecColor} size={Dimensions.get('window').width > 756?60: 30} name="cancel"></Icon>
                      ):(
                        <Icon color={Color.greenRecColor} size={Dimensions.get('window').width > 756?60: 30} name="check-circle"></Icon>
                      )}
                    </ListItem.Subtitle>
                  </ListItem.Content>
                </ListItem>
              ))}
            </ListItem.Accordion>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safecontainer: {
    flex: 1,
  },
  iconStyle:{
    borderWidth:2,
    borderRadius:100,
    borderColor:Color.blueRecColor,
    backgroundColor:Color.blueRecColor,
    position:'relative',
    marginTop:5
},
  scrollView: {
    flex: 1,
    backgroundColor: Color.whiteRecColor,
  },
  container: {
    alignItems: "center",
  },
  buttonView: {
    marginTop: 30,
    marginLeft: 'auto'
  },
  cusButton: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 50,
    borderColor: Color.whiteRecColor,
    borderWidth: 1,
    elevation: 5,
    backgroundColor: "#99c2ff",
  },
  cusText: {
    fontSize: Dimensions.get('window').fontScale * 17,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: Color.whiteRecColor,
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
    borderRadius: 100,
    width: 80,
    height: 80,
    marginRight: 10,
  },
  name: {
    fontSize: 16,
    marginTop: 5,
    color: Color.blackRecColor
  },
})
export default ActivityScreen
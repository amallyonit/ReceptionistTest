import React, { ReactElement, useEffect, useState } from "react"
import { Alert, BackHandler, Dimensions, Image, Modal, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import Color from "../theme/Color"
import { ProductMovementData, UserLDData, ViewNotification } from "../models/RecepModels"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { MiscStoreKeys } from "../constants/RecStorageKeys"
import { GetGatePassByUserCode, GetNotificationByUserCode } from "../requests/recAdminRequest"
import { Avatar, Badge, Card, Dialog, ListItem, Icon } from "react-native-elements"
import Fonts from "../theme/Fonts"
import { UpdateVisitStatus } from "../requests/recHomeRequest"
import Snackbar from "react-native-snackbar"
import { UpdateEntryStatus } from "../requests/recProdRequest"


const camLogo = require("../../assets/recscreen/CAMERA.png")

const GateScreen = ({ route, navigation }: any): ReactElement => {

  const [viewNots, setViewNots] = useState<ProductMovementData[]>([])
  const [viewDeNot, setViewDeNot] = useState<ProductMovementData>()
  const [userToken, setUserToken] = useState<{ UserCode: '' }>({ UserCode: '' })
  const [confirm, setConfirm] = useState(false)
  const [counter, setCounter] = useState(0);
  const [isLoad, setIsLoader] = useState(false)
  const [viewUser, setViewUser] = useState<UserLDData>()

  useEffect(() => {
    getNotifications()
    setConfirm(false)
    getUserDatasDet()
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
    }, 6000);

    return () => {
      backHandler.remove();
      clearInterval(intervalId)
    }
  }, [])

  const getNotifications = async () => {
    try {
      const vals = await AsyncStorage.getItem(MiscStoreKeys.EZ_LOGIN)
      const dataVal = JSON.parse(vals!)
      console.log("data vals ", dataVal.Data[0][0].UserCode)
      let tokenPay = {
        UserCode: dataVal.Data[0][0].UserCode
      }
      setUserToken(tokenPay)
      generateNotfis(tokenPay)
    } catch(error) {
      console.log("error ", error)
    }
  }


  const getUserDatasDet = async () => {
    setViewUser({UserCode:'',UserDeviceToken:'',UserMobileNo:'',UserName:'',UserPassword:'',UserType:'',LocationPremise:''})
    const data: any = await AsyncStorage.getItem(MiscStoreKeys.EZ_LOGIN)
    const vals = JSON.parse(data)
    console.log("data ", vals.Data[0][0])
    setViewUser(vals.Data[0][0])
  }

  const generateNotfis = (data: any) => {
    setIsLoader(false)
    try {
      GetGatePassByUserCode(data)?.then((response) => {
        if (response.data.Status) {
            console.log("gate pass entry ",response.data.Data)
            setViewNots(response.data.Data)
            setIsLoader(false)
        }
      }).catch((error: any) => {
        console.log("error ", error)
      })
    } catch (error) {

    }
  }

  const [expanded, setExpanded] = useState(false)

  const UpdateStatus = async () => {
    let payload = {
        ProdMovCode:viewDeNot?.ProdMovCode,
        EntryStatus:'A'
    }
    try {
      await UpdateEntryStatus(payload).then((response) => {
        console.log("update sucess", response)
        Snackbar.show({
          text: `Approved ${viewDeNot?.ProdMovDriverName}`,
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: Color.greenRecColor,
          textColor: Color.whiteRecColor,
        })
      }).catch((error) => {
        console.log("error ", error)
      })
    } catch (error) {
      console.log("error while updating visitor status")
    }
  }


  return (
    <SafeAreaView style={styles.safecontainer}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <View style={{ marginTop: 4, flex: 1, flexDirection: 'row' }}>
            <Icon name="notifications-active" size={50} color={Color.blueRecColor}></Icon>
            <Badge
              status="success"
              value={viewNots.length}
              containerStyle={{ position: 'absolute', top: -4, right: -4 }}
            />
          </View>
          <View style={{ width: '95%' }}>
            {
              viewNots.map((l, i) => (
                <ListItem key={i} bottomDivider onPress={() => {
                  setConfirm(true)
                  console.log("l ", l)
                  setViewDeNot(l)
                }}>
                  <Avatar avatarStyle={{ borderRadius: 50, borderWidth: 3, borderColor: Color.lightRecBlue }} size={100} title={l.ProdMovDriverName} source={{ uri: `data:image/png;base64,${l.ProdMovImage}` }} />
                  <ListItem.Content>
                    <ListItem.Title>{l.ProdMovDriverName}</ListItem.Title>
                    <ListItem.Subtitle style={{ color: Color.blackRecColor }}>Mobile No: {l.ProdMovMobileNo}</ListItem.Subtitle>
                    <ListItem.Subtitle style={{ color: Color.blackRecColor }}>Date: {l.ProdMovInTime.split('T')[1].split('.',1) + " " + (parseInt(l.ProdMovInTime.split('T')[1].split(':')[0].toString()) >= 12 ? 'PM':'AM')} - {new Date(l.ProdMovInTime).toDateString()}</ListItem.Subtitle>
                    {/* <ListItem.Subtitle style={{ color: Color.blackRecColor, marginLeft: 'auto', top: Dimensions.get('window').width > 756 ? -50 : -30 }}>
                      {l.ProdMovOutTime === 'R' || l.VisitTranVisitStatus == '' ? (
                        <Icon color={Color.redRecColor} size={Dimensions.get('window').width > 756 ? 60 : 30} name="cancel"></Icon>
                      ) : (
                        <Icon color={Color.greenRecColor} size={Dimensions.get('window').width > 756 ? 60 : 30} name="check-circle"></Icon>
                      )}
                    </ListItem.Subtitle> */}
                  </ListItem.Content>
                </ListItem>
              ))
            }
          </View>
          {viewNots.length == 0 && <View style={{ width: '80%', padding: 10, borderWidth: 5, borderColor: Color.lightGreyRecColor }}>
            <Text style={{ textAlign: 'center', color: Color.blackRecColor }}>No Notification Today</Text>
          </View>}
        </View>
      </ScrollView>

      {confirm &&
        <Modal
          animationType="fade"
          transparent={true}
          statusBarTranslucent={true}
          visible={true}
          onRequestClose={() => {
            console.log("pressed")
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Icon style={styles.iconStyles} color={Color.whiteRecColor} size={40} name="notifications-none" />
              <Text style={styles.modalTitleStyle}>
                {
                  viewDeNot?.ProdMovDriverName + " is waiting at "+ viewUser?.LocationPremise
                }
              </Text>
              <View style={styles.hairline}></View>
              <View style={styles.modalContentStyle}>
                <View style={{ width: '30%' }}>
                  {viewDeNot?.ProdMovImage != undefined || viewDeNot?.ProdMovImage != '' ?
                    (<Image
                      source={{ uri: `data:image/png;base64,${viewDeNot?.ProdMovImage}` }}
                      style={{ height: 70, width: 70, borderRadius: 100 }}></Image>) : (
                      <Image
                        source={camLogo}
                        style={{ height: 70, width: 70, borderRadius: 100 }}></Image>)

                  }
                </View>
                <View style={{ width: '70%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                  <Text style={{ fontSize: 18, color: Color.blackRecColor }}>{viewDeNot?.ProdMovDriverName}</Text>
                </View>
              </View>
              <View style={styles.hairline}></View>
              {viewDeNot?.ProdMovOutTime == '' || viewDeNot?.ProdMovOutTime == undefined || null ?
                (
                  <View style={{
                    flexDirection: 'row',
                    paddingHorizontal: 10, marginTop: 10,
                    borderRadius: 10, backgroundColor: Color.whiteRecColor
                  }}>
                    <View style={{ width: Dimensions.get('window').width > 1024 ? '23%' : '23%' }}>
                      <Pressable android_ripple={{ color: Color.lightGreyRecColor, borderless: true }} onPress={() => { setConfirm(false) }}>
                        <Icon style={{
                          borderRadius: 100, borderColor: Color.lightGreyRecColor,
                          shadowColor: Color.darkGrayLight,
                          shadowOffset: {
                            width: 0,
                            height: 12,
                          },
                          shadowOpacity: 0.1,
                          shadowRadius: 50,
                          elevation: 0.1
                        }} color={Color.darkRecGray} size={60} name="cancel"></Icon>
                      </Pressable>
                    </View>
                    <View style={{ width: '54%' }}></View>
                    <View style={{ width: Dimensions.get('window').width > 756 ? '23%' : '23%' }}>
                      <Pressable android_ripple={{ color: Color.greenRecColor, borderless: true }} onPress={(item) => {
                        setConfirm(false)
                        UpdateStatus()
                      }}>
                        <Icon style={{
                          borderRadius: 100, borderColor: Color.greenRecColor,
                          shadowColor: Color.greenRecColor,
                          shadowOffset: {
                            width: 0,
                            height: 12,
                          },
                          shadowOpacity: 0.1,
                          shadowRadius: 20,
                          elevation: 0.1
                        }} color={Color.greenRecColor} size={60} name="check-circle"></Icon>
                      </Pressable>
                    </View>
                  </View>
                ) : (
                  <View style={{
                    flexDirection: 'row',
                    paddingHorizontal: 10, marginTop: 10,
                    borderRadius: 10, backgroundColor: Color.whiteRecColor
                  }}>
                    <View style={{ width: Dimensions.get('window').width > 1024 ? '23%' : '23%' }}>
                      <Pressable android_ripple={{ color: Color.greenRecColor, borderless: true }} onPress={() => { setConfirm(false) }}>
                        <Icon style={{
                          borderRadius: 100, borderColor: Color.greenRecColor,
                          shadowColor: Color.greenRecColor,
                          shadowOffset: {
                            width: 0,
                            height: 12,
                          },
                          shadowOpacity: 0.1,
                          shadowRadius: 50,
                          elevation: 0.1
                        }} color={Color.greenRecColor} size={60} name="done-all"></Icon>
                      </Pressable>
                    </View>
                  </View>
                )
              }
            </View>
          </View>
        </Modal>
      }
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safecontainer: {
    flex: 1,
  },
  hairline: {
    marginTop: 5,
    marginBottom: 5,
    backgroundColor: Color.lightGreyRecColor,
    height: 2,
    width: '100%'
  },
  iconStyle: {
    borderWidth: 2,
    borderRadius: 100,
    borderColor: Color.blueRecColor,
    backgroundColor: Color.blueRecColor,
    position: 'relative',
    marginTop: 5
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
  iconStyles: {
    borderWidth: 2,
    borderRadius: 100,
    borderColor: Color.blueRecColor,
    backgroundColor: Color.blueRecColor,
    position: 'relative',
    marginTop: 5
  },
  modalTitleStyle: {
    color: Color.blackRecColor,
    fontFamily: Fonts.recFontFamily.titleRecFont,
    fontSize: Dimensions.get('window').fontScale * 21,
    textAlign: 'center',
    margin: 10
  },
  modalContentStyle: {
    flexDirection: 'row', flexWrap: 'wrap',
    borderRadius: 10, padding: 10,
    justifyContent: 'flex-start', marginTop: 5,
    backgroundColor: Color.whiteRecColor
  },
  modalView: {
    margin: 10,
    width: '90%',
    backgroundColor: Color.whiteRecColor,
    borderRadius: 15,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
})
export default GateScreen
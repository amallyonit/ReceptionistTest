import React, { Children, ReactElement, useEffect, useState } from "react"
import { Alert, BackHandler, Button, Dimensions, Image, Modal, Pressable, RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import Color from "../theme/Color"
import { UserPayload, ViewNotification } from "../models/RecepModels"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { MiscStoreKeys } from "../constants/RecStorageKeys"
import { GetNotificationByUserCode } from "../requests/recAdminRequest"
import { Avatar, Badge, Card, Dialog, ListItem,Icon } from "react-native-elements"
import NotificationPop from "../components/RecNotification"
import Fonts from "../theme/Fonts"
import { UpdateVisitStatus } from "../requests/recHomeRequest"
import Snackbar from "react-native-snackbar"
const camLogo = require("../../assets/recscreen/CAMERA.png")

const ActivityScreen = ({ route, navigation }: any): ReactElement => {

  const [viewNots, setViewNots] = useState<ViewNotification[]>([])
  const [viewDeNot,setViewDeNot] = useState<ViewNotification>()
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

  const UpdateStatus = async () =>{
        //call the api to get update  api
        let payload={
          VisitorMasterCode:viewDeNot?.VisitorCode,
          VisitTranId:viewDeNot?.VisitTranId,
          VisitTranVisitStatus:'A'
        }
        try {
          await UpdateVisitStatus(payload).then((response)=>{
            console.log("update sucess",response)
            Snackbar.show({
              text:`Approved ${viewDeNot?.VisitorName}`,
              duration:Snackbar.LENGTH_SHORT,
              backgroundColor:Color.greenRecColor,
              textColor:Color.whiteRecColor,
            })
          }).catch((error)=>{
            console.log("error ",error)
          })
        } catch (error) {
          console.log("error while updating visitor status")
        }
  }


  return (
    <SafeAreaView style={styles.safecontainer}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <View style={{ width: '95%' }}>
            <ListItem.Accordion containerStyle={{backgroundColor:Color.lightRecBlue}}
              content={
                <>
                  <ListItem.Content>
                    <ListItem.Title>
                      <View>
                        <Icon color={Color.blueRecColor} name="notifications-none" size={30} />
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
                <ListItem key={i} bottomDivider onPress={()=>{
                  setConfirm(true)
                  setViewDeNot(l)
                }}>
                  <Avatar avatarStyle={{ borderRadius: 50, borderWidth: 3, borderColor: Color.lightRecBlue }} size={100} title={l.VisitorName} source={{ uri: `data:image/png;base64,${l.VisitorImage}` }} />
                  <ListItem.Content>
                    <ListItem.Title>{l.VisitorName}</ListItem.Title>
                    <ListItem.Subtitle style={{ color: Color.blackRecColor, }}>Place: {l.VisitTranVisitorFrom}</ListItem.Subtitle>
                    <ListItem.Subtitle style={{ color: Color.blackRecColor }}>Mobile No: {l.VisitorMobileNo}</ListItem.Subtitle>
                    <ListItem.Subtitle style={{ color: Color.blackRecColor }}>Purpose: {l.VisitTranPurpose}</ListItem.Subtitle>
                    <ListItem.Subtitle style={{ color: Color.blackRecColor,marginLeft:'auto', top:Dimensions.get('window').width > 756?-50:-30}}>
                      {l.VisitTranVisitStatus=='R' || l.VisitTranVisitStatus==''?(
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
                 <Text style={styles.modalTitleStyle}>You've got a Delivery at the main gate</Text>
                 <View style={styles.hairline}></View>
                 <View style={styles.modalContentStyle}>
                     <View style={{width:'30%'}}>
                      <Image
                                 source={{ uri:`data:image/png;base64,${viewDeNot?.VisitorImage}` }}
                                 style={{height:70,width:70,borderRadius:100}}></Image>
                     </View>
                     <View style={{width:'70%',flexDirection:'row',justifyContent:'flex-start',alignItems:'center'}}>
                         <Text style={{fontSize:18,color:Color.blackRecColor}}>{viewDeNot?.VisitorName}</Text>
                     </View>
                 </View>
                 <View style={styles.hairline}></View>
                  {viewDeNot?.VisitTranVisitStatus=='R' || viewDeNot?.VisitTranVisitStatus==''?
                  (
                    <View style={{flexDirection:'row',
                    paddingHorizontal:10,marginTop:10,
                    borderRadius:10,backgroundColor:Color.whiteRecColor}}>
                        <View style={{width:Dimensions.get('window').width > 1024? '23%':'23%'}}>
                            <Pressable android_ripple={{color:Color.lightGreyRecColor,borderless:true}} onPress={()=>{setConfirm(false)}}>
                            <Icon style={{borderRadius:100,borderColor:Color.lightGreyRecColor,
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
                        <View style={{width:'54%'}}></View>
                        <View style={{width:Dimensions.get('window').width > 756? '23%':'23%'}}>
                        <Pressable android_ripple={{color:Color.greenRecColor,borderless:true}} onPress={(item)=>{
                          setConfirm(false)
                          UpdateStatus()
                          }}>
                        <Icon style={{borderRadius:100,borderColor:Color.greenRecColor,
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
                  ):(
                    <View style={{flexDirection:'row',
                    paddingHorizontal:10,marginTop:10,
                    borderRadius:10,backgroundColor:Color.whiteRecColor}}>
                        <View style={{width:Dimensions.get('window').width > 1024? '23%':'23%'}}>
                            <Pressable android_ripple={{color:Color.greenRecColor,borderless:true}} onPress={()=>{setConfirm(false)}}>
                            <Icon style={{borderRadius:100,borderColor:Color.greenRecColor,
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
    marginTop:5,
    marginBottom:5,
    backgroundColor: Color.lightGreyRecColor,
    height: 2,
    width: '100%'
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
  iconStyles:{
    borderWidth:2,
    borderRadius:100,
    borderColor:Color.blueRecColor,
    backgroundColor:Color.blueRecColor,
    position:'relative',
    marginTop:5
},
modalTitleStyle:{
    color:Color.blackRecColor,
    fontFamily:Fonts.recFontFamily.titleRecFont,
    fontSize:Dimensions.get('window').fontScale * 21,
    textAlign:'center',
    margin:10
},
modalContentStyle:{
    flexDirection:'row',flexWrap:'wrap',
    borderRadius:10,padding:10,
    justifyContent:'flex-start',marginTop:5,
    backgroundColor:Color.whiteRecColor
},
modalView: {
    margin: 10,
    width:'90%',
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
export default ActivityScreen
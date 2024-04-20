/**
 * @format
 */
import {Alert, AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import notifee, { AndroidBadgeIconType, AndroidImportance,AndroidStyle, EventType} from '@notifee/react-native';
import messaging from "@react-native-firebase/messaging"
import { GetPhoneNumberDetails,UpdateVisitStatus } from './src/requests/recHomeRequest';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Color from './src/theme/Color';  


messaging().getInitialNotification(async (message)=>{
  AsyncStorage.setItem('FCM_TRAN_key',message.data['trancode'])
  let img;
  const channelId = await notifee.createChannel({
    id:'default',
    name:'EzEntry Notifications',
    importance:AndroidImportance.HIGH,
    sound:'old_ring_bell',
    lightColor:Color.blueRecColor,
    lights:true,
  })
  let messageString = JSON.parse(message.data['data_fcm'])
  let dataString=""
  if(messageString.VisitTranNoOfVisitors!=undefined){
    dataString = `${messageString.VisitorName} ${" and "} ${messageString.VisitTranNoOfVisitors} ${" is waiting at Main Gate From "} ${messageString.VisitTranVisitorFrom} ${" "}${messageString.VisitTranPurpose}`;
  }else{
    dataString = `${messageString.VisitorName} ${" and "} ${" is waiting at Main Gate From "} ${messageString.VisitTranVisitorFrom} ${" "}${messageString.VisitTranPurpose}`;
  }
  if(messageString.VisitorMobileNo!=""){
    let payload = {
      VisitorMobileNo:messageString.VisitorMobileNo
  }
    await GetPhoneNumberDetails(payload).then((response)=>{
      img = JSON.parse(response.data.Data)
    }).catch((error)=>{
      console.log("error ",error)
    })
  }
  if(img[0][0].VisitorImage!=''){
    await notifee.displayNotification({
      title:'<p style="color:#99c2ff"><b>Persons are Watiting...</span></p></b></p>',
      body:dataString,
      android:{ 
        ongoing:true,
        loopSound:true,
        badgeIconType:AndroidBadgeIconType.LARGE,
        smallIcon:'cus_icon_color',
        channelId,
        largeIcon:require('./assets/cus_icon_color.png'),
        sound:'old_ring_bell',
        style:{
          type:AndroidStyle.BIGPICTURE,
          picture:`data:image/png;base64,${img}`
        },
        actions: [
          {
            title: 'Accept',
            icon: 'https://my-cdn.com/icons/reply.png',
            pressAction: {
              id: 'Accept',
              launchActivity:'default',
              mainComponent:'App'
            },
          },
          {
            title: 'Deny',
            icon: 'https://my-cdn.com/icons/reply.png',
            pressAction: {
              id: 'Deny',
              launchActivity:'default',
              mainComponent:'App'
            },
          },
          {
            title: 'Replay',
            pressAction: {
              id: 'Replay',
            },
            input: true
          }
        ],
      }
    })
  }
})

messaging().setBackgroundMessageHandler(async(message)=>{
  AsyncStorage.setItem('FCM_TRAN_key',message.data['trancode'])
  let img;
  const channelId = await notifee.createChannel({
    id:'default',
    name:'EzEntry Notifications',
    importance:AndroidImportance.HIGH,
    sound:'old_ring_bell',
    lightColor:Color.blueRecColor,
    lights:true,
  })
  let messageString = JSON.parse(message.data['data_fcm'])
  let dataString=""
  if(messageString.VisitTranNoOfVisitors!=undefined){
    dataString = `${messageString.VisitorName} ${" and "} ${messageString.VisitTranNoOfVisitors} ${" is waiting at "} ${messageString.VisiPersonLocation} ${' From '} ${messageString.VisitTranVisitorFrom} ${" "}${messageString.VisitTranPurpose}`;
  }else{
    dataString = `${messageString.VisitorName} ${" and "}  ${" is waiting at "} ${messageString.VisiPersonLocation} ${' From '} ${messageString.VisitTranVisitorFrom} ${" "}${messageString.VisitTranPurpose}`;
  }
  if(messageString.VisitorMobileNo!=""){
    let payload = {
      VisitorMobileNo:messageString.VisitorMobileNo
  }
    await GetPhoneNumberDetails(payload).then((response)=>{
      img = JSON.parse(response.data.Data)
    }).catch((error)=>{
      console.log("error ",error)
    })
  }
  if(img[0][0].VisitorImage!=''){
    await notifee.displayNotification({
      title:'<p style="color:#99c2ff"><b>Persons are Watiting...</span></p></b></p>',
      body:dataString,
      ios:{
        criticalVolume:1.0,
        critical:true,
        sound:'old_ring_bell',
      },
      android:{ 
        ongoing:true,
        loopSound:true,
        badgeIconType:AndroidBadgeIconType.LARGE,
        smallIcon:'cus_icon_color',
        channelId,
        largeIcon:require('./assets/cus_icon_color.png'),
        sound:'old_ring_bell',
        style:{
          type:AndroidStyle.BIGPICTURE,
          picture:`data:image/png;base64,${img[0][0].VisitorImage}`
        },
        actions: [
          {
            title: 'Accept',
            icon: 'https://my-cdn.com/icons/reply.png',
            pressAction: {
              id: 'Accept',
              mainComponent:'App'
            },
          },
          {
            title: 'Deny',
            icon: 'https://my-cdn.com/icons/reply.png',
            pressAction: {
              id: 'Deny',
              mainComponent:'App'
            },
          },
          {
            title: 'Replay',
            pressAction: {
              id: 'Replay',
            },
            input: true
          }
        ],
        fullScreenAction:{
          id:'default'
        }
      }
    })
  }
})

notifee.onBackgroundEvent(async ({ type, detail }) => {
  const { notification, pressAction } = detail;
  // Check if the user pressed the "Mark as read" action
  if (type === EventType.ACTION_PRESS && pressAction.id === 'Accept') {
    const dataKey = await AsyncStorage.getItem('FCM_Data_key')
    const dataKey2 = await AsyncStorage.getItem('FCM_TRAN_key')
    AsyncStorage.setItem('FCM_STATUS','ACCEPTED')
    //call the api to get update  api
    let payload={
      VisitorMasterCode:dataKey,
      VisitTranId:dataKey2,
      VisitTranVisitStatus:'A',
      VisitTranReason: ''
    }
    try {
      await UpdateVisitStatus(payload).then((response)=>{
        console.log("update sucess",response)
      }).catch((error)=>{
        console.log("error ",error)
      })
    } catch (error) {
      console.log("error while updating visitor status")
    }
      console.log("event pressed ",pressAction.id);
  }else if(type === EventType.ACTION_PRESS && pressAction.id === 'Deny'){
      await notifee.cancelNotification(notification.id);
      const dataKey = await AsyncStorage.getItem('FCM_Data_key')
      const dataKey2 = await AsyncStorage.getItem('FCM_TRAN_key')
      let payload={
        VisitorMasterCode:dataKey,
        VisitTranId:dataKey2,
        VisitTranVisitStatus:'R',
        VisitTranReason: ''
      }
      try {
        await UpdateVisitStatus(payload).then((response)=>{
          console.log("update sucess",response)
        }).catch((error)=>{
          console.log("error ",error)
        })
      } catch (error) {
        console.log("error while updating visitor status")
      }
    
  } else if (type === EventType.ACTION_PRESS && detail.pressAction?.id === 'Replay') {
    const dataKey = await AsyncStorage.getItem('FCM_Data_key')
    const dataKey2 = await AsyncStorage.getItem('FCM_TRAN_key')
    let payload = {
      VisitorMasterCode: dataKey,
      VisitTranId: dataKey2,
      VisitTranVisitStatus: 'R',
      VisitTranReason: detail.input
    }
    try {
      await UpdateVisitStatus(payload).then(async (response) => {
        console.log("update sucess", response)
      }).catch((error) => {
        console.log("error ", error)
      })
    } catch (error) {
      console.log("error while updating visitor status")
    }
    await notifee.cancelNotification(detail.notification.id);
  }
});

AppRegistry.registerComponent(appName, () => App);
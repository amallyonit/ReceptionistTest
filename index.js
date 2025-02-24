/**
 * @format
 */
import { AppRegistry, Platform} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import notifee, { AndroidBadgeIconType, AndroidImportance,AndroidStyle, EventType} from '@notifee/react-native';
import messaging from "@react-native-firebase/messaging"
import { GetPhoneNumberDetails,UpdateVisitStatus } from './src/requests/recHomeRequest';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Color from './src/theme/Color';  
import { UpdateEntryStatus } from './src/requests/recProdRequest';


messaging().getInitialNotification(async (message)=>{
  console.log("message ",message)
  if(message.data['key']=='RECE'){
    receptionEntry(message)
  }else if(message.data['key']=='GATE'){
    gateEntry(message)
  }
})

const gateEntry =  async (message) =>{
  AsyncStorage.setItem('FCM_GATE_MASTERCODE', message.data['mastercode_2'])
  let img;
  const channelId = await notifee.createChannel({
    id:'default',
    name:'EzEntry Notifications',
    importance:AndroidImportance.HIGH,
    sound:'old_ring_bell',
    lightColor:Color.blueRecColor,
    lights:true,
  })
  let messageString = JSON.parse(message.data['data_fcm_2'])
  let dataString=`${messageString.ProdMovDriverName} ${" is waiting at  Main Gate"}`
  if(messageString.ProdMovMobileNo!=""){
    let payload = {
      ProdMovMobileNo:messageString.ProdMovMobileNo
  }
    await GetPhoneNumberDetails(payload).then((response)=>{
      const data = JSON.parse(response.data.Data)
      console.log("image block")
      img = data[0]
    }).catch((error)=>{
      console.log("error ",error)
    })
  }
  if(img.ProdMovImage!=''){
    await notifee.displayNotification({
      title:'<p style="color:#99c2ff"><b>Persons are Watiting...</span></p></b></p>',
      body:dataString,
      android:{ 
        ongoing:true,
        loopSound:true,
        autoCancel:false,
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
          }
        ],
      }
    })
  }
}

const receptionEntry = async (message)=>{
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
      console.log("image entry ",img)
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
        autoCancel:false,
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
}

messaging().setBackgroundMessageHandler(async(message)=>{
  console.log("message ",message)
  if(message.data['key']=='RECE'){
    receptionEntry(message)
  }else if(message.data['key']=='GATE'){
    gateEntry(message)
  }
})

notifee.onBackgroundEvent(async ({ type, detail }) => {
  const { notification, pressAction } = detail;
  const checkData = await AsyncStorage.getItem('FCM_GATE_MASTERCODE')
  let CodeParse = JSON.parse(checkData)
  if(CodeParse!="MASTERCODE_EMPTY"){
    if (type === EventType.ACTION_PRESS && pressAction.id === 'Accept') {
      const dataKey = await AsyncStorage.getItem('FCM_GATE_MASTERCODE')
      let payload = {
        ProdMovCode:dataKey,
        EntryStatus:'A'
    }
        try {
            await UpdateEntryStatus(payload).then((response)=>{
                console.log("response data ",response?.data.Data);
                AsyncStorage.setItem('ProvMoveCode',JSON.stringify("PM_EMPTY"))
            }).catch((error)=>{
                console.log("error ",error)
            }) 
        } catch (error) {
            console.log("error ",error)
        }
        console.log("event pressed ",pressAction.id);
    }else if(type === EventType.ACTION_PRESS && pressAction.id === 'Deny'){
        await notifee.cancelNotification(notification.id);
        const dataKey = await AsyncStorage.getItem('FCM_GATE_MASTERCODE')
        let payload = {
          ProdMovCode:dataKey,
          EntryStatus:'R'
      }
          try {
              await UpdateEntryStatus(payload).then((response)=>{
                  console.log("response data ",response?.data.Data);
                  AsyncStorage.setItem('ProvMoveCode',JSON.stringify("PM_EMPTY"))
              }).catch((error)=>{
                  console.log("error ",error)
              })
          } catch (error) {
              console.log("error ",error)
          }
    }
  }else{
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
  }

});


if (Platform.OS === 'web') {
  // You might need to add additional web-related configuration here.
  AppRegistry.registerComponent(appName, () => App);
  AppRegistry.runApplication(appName, {
    initialProps: {},
    rootTag: document.getElementById('app-root'),
  });
} else {
  AppRegistry.registerComponent(appName, () => App);
}
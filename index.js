/**
 * @format
 */
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import notifee, { AndroidImportance,AndroidStyle, EventType} from '@notifee/react-native';
import messaging from "@react-native-firebase/messaging"
import { GetPhoneNumberDetails,UpdateVisitStatus } from './src/requests/recHomeRequest';
import AsyncStorage from "@react-native-async-storage/async-storage";

messaging().setBackgroundMessageHandler(async(message)=>{
  let img =""
  const channelId = await notifee.createChannel({
    id:'default',
    name:'EzEntry Notifications',
    importance:AndroidImportance.HIGH,
    sound:'not_ez_sound',
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
      img = response.data.Data[0].VisitorImage
    }).catch((error)=>{
      console.log("error ",error)
    })
  }
  if(img!=''){
    await notifee.displayNotification({
      title:'<p style="color:#99c2ff"><b>Persons are Watiting...</span></p></b></p>',
      body:dataString,
      android:{ 
        ongoing:true,
        loopSound:true,
        smallIcon:'cus_icon_color',
        channelId,
        largeIcon:require('./assets/cus_icon_color.png'),
        sound:'bel_ring_tone',
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
            },
          },
          {
            title: 'Deny',
            icon: 'https://my-cdn.com/icons/reply.png',
            pressAction: {
              id: 'Deny',
            },
          },
        ],
        fullScreenAction:{
          id:'default'
        },
      }
    })
  }
})
notifee.onBackgroundEvent(async ({ type, detail }) => {
  const { notification, pressAction } = detail;

  // Check if the user pressed the "Mark as read" action
  if (type === EventType.ACTION_PRESS && pressAction.id === 'Accept') {
    const dataKey = await AsyncStorage.getItem('FCM_Data_key')
    AsyncStorage.setItem('FCM_STATUS','ACCEPTED')
    //call the api to get update  api
    let payload={
      VisitorMasterCode:dataKey,
      VisitTranVisitStatus:'A'
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
      const getUpdateKey =  await AsyncStorage.getItem('FCM_STATUS')
    if(getUpdateKey=='ACCEPTED'){
      let payload={
        VisitorMasterCode:dataKey,
        VisitTranVisitStatus:'R'
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
    }
  }
});

function HeadlessCheck({ isHeadless }) {
  if (isHeadless) {
    // App has been launched in the background by iOS, ignore
    return null;
  }

  return <App />;
}


AppRegistry.registerComponent(appName, () => HeadlessCheck);
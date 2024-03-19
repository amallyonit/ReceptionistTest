/**
 * @format
 */

import {AppRegistry,PermissionsAndroid} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import NotificationPop from './src/components/RecNotification';
import notifee, { AndroidImportance, EventType} from '@notifee/react-native';
import messaging from "@react-native-firebase/messaging"
import uuid from "react-native-uuid"
import RNCallKeep from "react-native-callkeep"

RNCallKeep.setup({
  ios:{
    appName:'EZEntry'
  },
  android:{
    alertTitle:'Permission Required',
    alertDescription:'access contacts',
    cancelButton: 'Cancel',
    okButton: 'ok',
    additionalPermissions:[PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE]
  }
})
const callerID = uuid.v4().toString()

messaging().setBackgroundMessageHandler(async(message)=>{
  const channelId = await notifee.createChannel({
    id:'default',
    name:'EzEntry Notifications',
    importance:AndroidImportance.HIGH,
    sound:'not_ez_sound',
  })
  let messageString;
  if(message.notification.body!=undefined){
    messageString = JSON.parse(message.notification.body)
  }
 await notifee.displayNotification({
    title:'EzEntry Notification',
    body:`${messageString.VisitorName} want to meet you`,
    android:{ 
      smallIcon:'ic_ezentry_trans',
      channelId,
      largeIcon:require('./assets/ez_entry_not.png'),
      sound:'not_ez_sound',
      actions: [
        {
          title: 'Accept',
          icon: 'https://my-cdn.com/icons/reply.png',
          pressAction: {
            id: 'Accept',
            mainComponent:'custom-pop-component'
          },
        },
        {
          title: 'Deny',
          icon: 'https://my-cdn.com/icons/reply.png',
          pressAction: {
            id: 'Deny',
            mainComponent:'custom-pop-component'
          },
        },
      ],
    }
  })
  RNCallKeep.displayIncomingCall(callerID,'EZEntryNOtification',`${messageString.VisitorName} want to meet you`,'generic',false)  
})

notifee.onBackgroundEvent(async ({ type, detail }) => {
    const { notification, pressAction } = detail;
  
    // Check if the user pressed the "Mark as read" action
    if (type === EventType.ACTION_PRESS && pressAction.id === 'Accept') {
        console.log("event pressed ",pressAction.id);
    }else if(type === EventType.ACTION_PRESS && pressAction.id === 'Deny'){
        await notifee.cancelNotification(notification.id);
    }
  });

AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerComponent('custom-pop-component',()=>NotificationPop)
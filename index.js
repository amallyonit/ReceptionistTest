/**
 * @format
 */

import {AppRegistry,PermissionsAndroid} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import NotificationPop from './src/components/RecNotification';
import notifee, { AndroidLaunchActivityFlag, AndroidImportance, AndroidVisibility, EventType, RepeatFrequency, TriggerType, AndroidCategory, AndroidStyle } from '@notifee/react-native';
import messaging from "@react-native-firebase/messaging"
import RNCallKeep from 'react-native-callkeep';
import uuid from "react-native-uuid"

messaging().getInitialNotification().then((response)=>{
  console.log("first hit")
})
messaging().setBackgroundMessageHandler(async(message)=>{
  const channelId = await notifee.createChannel({
    id:'default',
    name:'EzEntry Notifications',
    importance:AndroidImportance.HIGH,
    sound:'not_ez_sound',
  })
 await notifee.displayNotification({
    title:'EzEntry Notification',
    body:"Amal want to meet you",
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
            launchActivity:'default'
          },
        },
        {
          title: 'Deny',
          icon: 'https://my-cdn.com/icons/reply.png',
          pressAction: {
            id: 'Deny',
            launchActivity:'default',
          },
        },
      ],
    }
  })
  displayIncomingCall('EzEntry Notification')

})
const displayIncomingCall = (number) => {

  const options = {
    ios: {
      appName: 'My app name',
    },
    android: {
      alertTitle: 'Permissions required',
      alertDescription: 'This application needs to access your phone accounts',
      cancelButton: 'Cancel',
      okButton: 'ok',
      imageName: 'phone_account_icon',
      additionalPermissions: [
        PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,  
        PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,  
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        PermissionsAndroid.PERMISSIONS.READ_PHONE_NUMBER
      ],
      foregroundService: {
        channelId: 'com.company.my',
        channelName: 'Foreground service for my app',
        notificationTitle: 'My app is running on background',
        notificationIcon: 'Path to the resource icon of the notification',
      },
      selfManaged:true
    }
  };

  RNCallKeep.setup(options)
  RNCallKeep.displayIncomingCall(uuid.v1().toLocaleString(), 'ezEntry Notification', 'ezEntry Notification', 'number', false);


  RNCallKeep.setup(options).then((accepted)=>{
    RNCallKeep.endCall()
    console.log("call attend",accepted)
  }).catch(()=>{

  })
  RNCallKeep.displayIncomingCall(uuid.v3().toLocaleString(), number.toString(), number.toString(), 'number', false);
}

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
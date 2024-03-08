/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import NotificationPop from './src/components/RecNotification';
import notifee, { AndroidLaunchActivityFlag, AndroidImportance, AndroidVisibility, EventType, RepeatFrequency, TriggerType, AndroidCategory, AndroidStyle } from '@notifee/react-native';
import Color from './src/theme/Color';
import messaging from "@react-native-firebase/messaging"

messaging().getInitialNotification()
messaging().setBackgroundMessageHandler(async(message)=>{
        const channelId = await notifee.createChannel({
            id:'default',
            name:'EzEntry Notifications',
            importance:AndroidImportance.HIGH,
            lights:true,
            lightColor:Color.blueRecColor,
            sound:'not_ez_sound',
            visibility:AndroidVisibility.PUBLIC,
          })
         await notifee.displayNotification({
            title:'EzEntry Notification',
            body:"Amal want to meet you",
            android:{
              smallIcon:'not_bell_icon',
              channelId,
              largeIcon:require('./assets/ez_entry_not.png'),
              sound:'not_ez_sound',
              channelId,
              category:AndroidCategory.CALL,
              fullScreenAction:{
                id:'default',
              },
              color:Color.blueRecColor,
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
            }
          })
})

notifee.onBackgroundEvent(async ({ type, detail }) => {
    console.log("event pressed ",detail,type)
    const { notification, pressAction } = detail;
  
    // Check if the user pressed the "Mark as read" action
    if (type === EventType.ACTION_PRESS && pressAction.id === 'Accept') {
        console.log("event pressed ",pressAction.id);
    }else if(type === EventType.ACTION_PRESS && pressAction.id === 'Deny'){
        await notifee.cancelNotification(notification.id);
    }
  });

AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerComponent('notification-pop', () => NotificationPop)
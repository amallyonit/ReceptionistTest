// import messaging from '@react-native-firebase/messaging';
// import { Platform } from 'react-native';
// import notifee, { AndroidImportance } from '@notifee/react-native';
// import navigt from './navigation.wrapper';
// import { useNavigation, ParamListBase,  NavigationProp } from '@react-navigation/native';
// const navigation: NavigationProp<ParamListBase> = useNavigation();

// export async function requestUserPermission() {
//     const authStatus = await messaging().requestPermission();
//     const enabled =
//         authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
//         authStatus === messaging.AuthorizationStatus.PROVISIONAL;

//     if (enabled) {
//         console.log('Authorization status:', authStatus);
//         getFcmToken()
//     }
// }

// const getFcmToken = async () => {

//     try {
//         const token = await messaging().getToken()
//         console.log("fcm token:", token)
//     } catch (error) {
//         console.log("error in creating token")
//     }

// }



// async function onDisplayNotification(data:any) {
//     // Request permissions (required for iOS)

//     if (Platform.OS == 'ios') {
//         await notifee.requestPermission()
//     }
//             const channelId = await notifee.createChannel({
//             id:'default',
//             name:'EzEntry Notifications',
//             importance:AndroidImportance.HIGH,
//             lights:true,
//             lightColor:Color.blueRecColor,
//             sound:'not_ez_sound',
//             visibility:AndroidVisibility.PUBLIC,
//           })
//          await notifee.displayNotification({
//             title:'EzEntry Notification',
//             body:"Amal want to meet you",
//             android:{
//               smallIcon:'not_bell_icon',
//               channelId,
//               largeIcon:require('./assets/ez_entry_not.png'),
//               sound:'not_ez_sound',
//               channelId,
//               category:AndroidCategory.CALL,
//               fullScreenAction:{
//                 id:'default',
//               },
//               color:Color.blueRecColor,
//               actions: [
//                 {
//                   title: 'Accept',
//                   icon: 'https://my-cdn.com/icons/reply.png',
//                   pressAction: {
//                     id: 'Accept',
//                   },
//                 },
//                 {
//                   title: 'Deny',
//                   icon: 'https://my-cdn.com/icons/reply.png',
//                   pressAction: {
//                     id: 'Deny',
//                   },
//                 },
//               ],
//             }
//           })    
// }

// export async function notificationListeners() {
//     const unsubscribe = messaging().onMessage(async remoteMessage => {
//         console.log('A new FCM message arrived!', remoteMessage);
//         onDisplayNotification(remoteMessage)
//     });


//     messaging().onNotificationOpenedApp(remoteMessage => {
//         console.log(
//             'Notification caused app to open from background state:',
//             remoteMessage,
//         );
//     });

//     // Check whether an initial notification is available
//     messaging()
//         .getInitialNotification()
//         .then(remoteMessage => {
//             if (remoteMessage) {
//                 console.log(
//                     'Notification caused app to open from quit state:',
//                     remoteMessage.notification,
//                 );

//             }
//         });

//     return unsubscribe;
// }
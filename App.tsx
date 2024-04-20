"use strict"
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import FormScreen from './src/screens/FormScreen';
import FormDeliveryScreen from './src/screens/FormDeliveryScreen';
import ViewHistoryScreen from './src/screens/ViewHistoryScreen';
import ActivityScreen from './src/screens/ActivityScreen';
import Color from './src/theme/Color';
import Fonts from './src/theme/Fonts';
import messaging from "@react-native-firebase/messaging"
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createRef, useEffect, useState } from 'react';
import { NotificationData, ViewNotification } from './src/models/RecepModels';
import { RegisterMessageToken } from './src/requests/recNotifiRequest';
import notifee, { AndroidImportance, AndroidStyle, EventType } from '@notifee/react-native';
import { PermissionsAndroid } from 'react-native';
import NotificationPop from './src/components/RecNotification';
import SplashEzEntryScreen from './src/screens/SplashEzEntryScreen';
import AdminScreen from './src/screens/AdminScreen';
import SettingScreen from './src/screens/SettingsScreen';
import { GetPhoneNumberDetails, UpdateVisitStatus } from './src/requests/recHomeRequest';
import CourierScreen from './src/screens/CourierScreen';


const Stack = createNativeStackNavigator()

const onRegisterMessaging = async () => {
  const authorizationStatus = await messaging().requestPermission();
  if (authorizationStatus) {
    await messaging().registerDeviceForRemoteMessages()
    await messaging().registerDeviceForRemoteMessages()
    const token = await messaging().getToken()
    //store the token into the table with unique user code
    let data: NotificationData = {
      NotificationDeviceToken: token,
      NotificationCreatedAt: new Date(),
      NotificationsData: ''
    }
    try {
      await RegisterMessageToken(data)?.then((reponse) => {
      }).catch((error: any) => {
        console.log("error ", error)
      })
    } catch (error) {
      console.log("error ", error)
    }
    await AsyncStorage.setItem('FCM_Token', token)
  }
}

const onMessageGetter = async (message: any) => {
  let img: ViewNotification | null = null
  AsyncStorage.setItem('FCM_Data_key', message.data['mastercode'])
  AsyncStorage.setItem('FCM_TRAN_key', message.data['trancode'])
  console.log("message ", message.data['data_fcm'])
  const messString: any = JSON.parse(message.data['data_fcm'])
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'EzEntry Notifications',
    importance: AndroidImportance.HIGH,
    sound: 'old_ring_bell',
  })
  let dataString = ""
  if (messString.VisitTranNoOfVisitors != undefined) {
    dataString = `${messString.VisitorName} ${" and "} ${messString.VisitTranNoOfVisitors} ${" is waiting at "} ${messString.VisiPersonLocation} ${' From '} ${messString.VisitTranVisitorFrom} ${" "}${messString.VisitTranPurpose}`;
  } else {
    dataString = `${messString.VisitorName} ${" and "} ${" is waiting at "} ${messString.VisiPersonLocation} ${' From '} ${messString.VisitTranVisitorFrom} ${" "}${messString.VisitTranPurpose}`;
  }
  if (messString.VisitorMobileNo != "") {
    let payload = {
      VisitorMobileNo: messString.VisitorMobileNo
    }
    await GetPhoneNumberDetails(payload).then((response: any) => {
      const data = JSON.parse(response.data.Data)
      img = data[0][0]
      console.log("image ", response)
    }).catch((error) => {
      console.log("error ", error)
    })
  }
  if (img!.VisitorImage != "") {
    await notifee.displayNotification({
      title: 'EzEntry Notification',
      body: dataString,
      android: {
        ongoing: true,
        loopSound:true,
        smallIcon: 'cus_icon_color',
        channelId,
        color: Color.blueRecColor,
        largeIcon: require('./assets/cus_icon_color.png'),
        sound: 'old_ring_bell',
        style: {
          type: AndroidStyle.BIGPICTURE,
          picture: `data:image/png;base64,${img!.VisitorImage}`
        },
        actions: [
          {
            title: 'Accept',
            icon: 'https://my-cdn.com/icons/reply.png',
            pressAction: {
              id: 'Accept',
              mainComponent: 'App'
            },
          },
          {
            title: 'Deny',
            icon: 'https://my-cdn.com/icons/reply.png',
            pressAction: {
              id: 'Deny',
              mainComponent: 'App'
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
        fullScreenAction: {
          id: 'default'
        }
      }
    })
  }
  notifee.onForegroundEvent(async ({ type, detail }) => {
    const { notification, pressAction }: any = detail;
    if (type === EventType.ACTION_PRESS && pressAction.id === 'Accept') {
      const dataKey = await AsyncStorage.getItem('FCM_Data_key')
      const dataKey2 = await AsyncStorage.getItem('FCM_TRAN_key')
      AsyncStorage.setItem('FCM_STATUS', 'ACCEPTED')
      let payload = {
        VisitorMasterCode: dataKey,
        VisitTranId: dataKey2,
        VisitTranVisitStatus: 'A',
        VisitTranReason: ''
      }
      try {
        await UpdateVisitStatus(payload).then((response) => {
          console.log("update sucess", response)
        }).catch((error) => {
          console.log("error ", error)
        })
      } catch (error) {
        console.log("error while updating visitor status")
      }
    } else if (type === EventType.ACTION_PRESS && pressAction.id === 'Deny') {
      const dataKey = await AsyncStorage.getItem('FCM_Data_key')
      const dataKey2 = await AsyncStorage.getItem('FCM_TRAN_key')
      let payload = {
        VisitorMasterCode: dataKey,
        VisitTranId: dataKey2,
        VisitTranVisitStatus: 'R',
        VisitTranReason: ''
      }
      try {
        await UpdateVisitStatus(payload).then((response) => {
          console.log("update sucess", response)
        }).catch((error) => {
          console.log("error ", error)
        })
      } catch (error) {
        console.log("error while updating visitor status")
      }
      await notifee.cancelNotification(notification.id);
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
      await notifee.cancelNotification(detail.notification?.id!);
    }
  })
}

const App = () => {
  useEffect(() => {
    notifee.requestPermission({
      criticalAlert: true
    })
    onRegisterMessaging();
    messaging().onNotificationOpenedApp(onMessageGetter)
    const messageSetile = messaging().onMessage(onMessageGetter)
    return () => {
      messageSetile()
    };
  }, [])
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{
        headerTintColor: Color.whiteRecColor,
        headerTitleAlign: 'center', headerTitleStyle: {
          color: Color.whiteRecColor,
          fontFamily: Fonts.recFontFamily.titleRecFont
        }, headerStyle: {
          backgroundColor: Color.blueRecColor,
        }, headerShown: true, statusBarAnimation: 'fade', statusBarTranslucent: true, statusBarHidden: false, statusBarColor: Color.blueRecColor
      }} initialRouteName='Splash'>
        <Stack.Screen name='Splash' options={{ headerShown: false }} component={SplashEzEntryScreen}></Stack.Screen>
        <Stack.Screen name='Login' options={{ headerShown: false }} component={LoginScreen}></Stack.Screen>
        <Stack.Screen name='Home' options={{ headerShown: false }} component={HomeScreen}></Stack.Screen>
        <Stack.Screen name='Form' component={FormScreen}></Stack.Screen>
        <Stack.Screen name='PickDel' options={{ headerTitle: 'Delivery / Pickup' }} component={FormDeliveryScreen}></Stack.Screen>
        <Stack.Screen name='Courier' component={CourierScreen}></Stack.Screen>
        <Stack.Screen name='History' options={{ headerTitle: 'View History' }} component={ViewHistoryScreen}></Stack.Screen>
        <Stack.Screen name='Admin' options={{ headerShown: false }} component={AdminScreen}></Stack.Screen>
        <Stack.Screen name='Activity' component={ActivityScreen}></Stack.Screen>
        <Stack.Screen name='Settings' component={SettingScreen}></Stack.Screen>
        <Stack.Screen name='Popup' component={NotificationPop}></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}



export default App;


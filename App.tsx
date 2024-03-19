"use strict"
import { NavigationContainer, useNavigation,ParamListBase,  NavigationProp } from '@react-navigation/native';
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
import { NotificationData } from './src/models/RecepModels';
import { RegisterMessageToken } from './src/requests/recNotifiRequest';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import uuid from "react-native-uuid"
import { PermissionsAndroid, Platform } from 'react-native';
import RNCallKeep from "react-native-callkeep";
import NotificationPop from './src/components/RecNotification';
import { MiscStoreKeys } from './src/constants/RecStorageKeys';
import SplashEzEntryScreen from './src/screens/SplashEzEntryScreen';
import AdminScreen from './src/screens/AdminScreen';
import SettingScreen from './src/screens/SettingsScreen';
const Stack = createNativeStackNavigator()

const onRegisterMessaging = async () => {
  const authorizationStatus = await messaging().requestPermission();
  if (authorizationStatus) {
    await messaging().registerDeviceForRemoteMessages()
    await messaging().registerDeviceForRemoteMessages()
    const token = await messaging().getToken()
    //store the token into the table with unique user code
    let data:NotificationData={
      NotificationDeviceToken:token,
      NotificationCreatedAt:new Date(),
      NotificationsData:''
    }
    try {
      await RegisterMessageToken(data)?.then((reponse)=>{
      }).catch((error:any)=>{
        console.log("error ",error)
      })
    } catch (error) {
      console.log("error ",error)
    }
    await AsyncStorage.setItem('FCM_Token', token)
  }
}

RNCallKeep.setup({
  ios:{
    appName:'EZEntry'
  },
  android:{
    alertTitle:'Permission Required',
    alertDescription:'access contacts',
    imageName:'',
    cancelButton: 'Cancel',
    okButton: 'ok',
    additionalPermissions:[PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE]
  }
})

const callerID = uuid.v4().toString()

const onMessageGetter = async ()=>{
  messaging().onMessage(async (message:any)=>{
    const messString:any = JSON.parse(message.notification.body)
    const channelId = await notifee.createChannel({
      id:'default',
      name:'EzEntry Notifications',
      importance:AndroidImportance.HIGH,
      sound:'not_ez_sound',
    })
   await notifee.displayNotification({
      title:'EzEntry Notification',
      body:`${messString.VisitorName} want to meet you`,
      android:{ 
        channelId,
        largeIcon:require('./assets/ez_entry_not.png'),
        sound:'not_ez_sound',
        actions: [
          {
            title: 'Accept',
            icon: 'https://my-cdn.com/icons/reply.png',
            pressAction: {
              id: 'Accept',
              // mainComponent:'custom-pop-component'
            },
          },
          {
            title: 'Deny',
            icon: 'https://my-cdn.com/icons/reply.png',
            pressAction: {
              id: 'Deny',
              // mainComponent:'custom-pop-component'
            },
          },
        ],
      }
    })
    displayincomingCall(messString)
  })

}

const displayincomingCall = (data?:any) =>{
  RNCallKeep.displayIncomingCall(callerID,'EZEntry Notification',`${data.VisitorName} and ${data.vistno} waiting  at the main gate.`,'generic',false) 
}
const checkApplicationPermission = async () => {
  if (Platform.OS === 'android') {
    try {
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
      await PermissionsAndroid.request('android.permission.CALL_PHONE')
      await PermissionsAndroid.request('android.permission.READ_PHONE_STATE')
    } catch (error) {
    }
  }
}
const App = () => {
  const navigationRef:any = createRef();
  useEffect(() => {
    notifee.requestPermission()
    onRegisterMessaging();
    onMessageGetter();
    notifee.onForegroundEvent(async ({ type, detail }) => {
      console.log("event pressed ",detail,type)
      const { notification, pressAction }:any = detail;
      // Check if the user pressed the "Mark as read" action
      if (type === EventType.ACTION_PRESS && pressAction.id === 'Accept') {
          console.log("event pressed ",pressAction.id);
          navigationRef.navigate('Popup')
      }else if(type === EventType.ACTION_PRESS && pressAction.id === 'Deny'){
          await notifee.cancelNotification(notification.id);
          navigationRef.navigate('Popup')
      }
      
    });
    checkApplicationPermission()
  }, [])
  return (
     <NavigationContainer ref={navigationRef}>
      <Stack.Navigator  screenOptions={{
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
        <Stack.Screen name='History' options={{ headerTitle: 'View History' }} component={ViewHistoryScreen}></Stack.Screen>
        <Stack.Screen name='Admin' options={{ headerShown: false }} component={AdminScreen}></Stack.Screen>
        <Stack.Screen name='Activity'  component={ActivityScreen}></Stack.Screen>
        <Stack.Screen name='Settings'component={SettingScreen}></Stack.Screen>
        <Stack.Screen name='Popup' component={NotificationPop}></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}



export default App;


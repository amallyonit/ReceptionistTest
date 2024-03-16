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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { NotificationData } from './src/models/RecepModels';
import { RegisterMessageToken } from './src/requests/recNotifiRequest';
import notifee, { AndroidCategory, AndroidImportance, AndroidStyle, AndroidVisibility, EventType, RepeatFrequency, TriggerType } from '@notifee/react-native';
import NotificationPop from './src/components/RecNotification';
import { MiscStoreKeys } from './src/constants/RecStorageKeys';
import RNCallKeep, { IOptions } from 'react-native-callkeep';
import uuid from "react-native-uuid"
import { PermissionsAndroid } from 'react-native';

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
    console.log("token registerd ", token)
  }
}

const onMessageGetter = async ()=>{
  messaging().onMessage(async (message:any)=>{
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
  })
}

async function requestPhoneNumbersPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_PHONE_NUMBERS,
      {
        title: 'Phone Numbers Permission',
        message: 'This app needs access to your phone numbers.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Phone numbers permission granted');
    } else {
      console.log('Phone numbers permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
}



const App = () => {
  const [isLogin,setIsLogin] = useState("")

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
      }else if(type === EventType.ACTION_PRESS && pressAction.id === 'Deny'){
          await notifee.cancelNotification(notification.id);
      }
      
    });
    requestPhoneNumbersPermission()
  }, [])
  return (
     <NavigationContainer>
      <Stack.Navigator  screenOptions={{
        headerTintColor: Color.whiteRecColor,
        headerTitleAlign: 'center', headerTitleStyle: {
          color: Color.whiteRecColor,
          fontFamily: Fonts.recFontFamily.titleRecFont
        }, headerStyle: {
          backgroundColor: Color.blueRecColor,
        }, headerShown: true, statusBarAnimation: 'fade', statusBarTranslucent: true, statusBarHidden: false, statusBarColor: Color.blueRecColor
      }} initialRouteName={isLogin}>
        <Stack.Screen name='Login' options={{ headerShown: false }} component={LoginScreen}></Stack.Screen>
        <Stack.Screen name='Home' options={{ headerShown: false }} component={HomeScreen}></Stack.Screen>
        <Stack.Screen name='Form' component={FormScreen}></Stack.Screen>
        <Stack.Screen name='PickDel' options={{ headerTitle: 'Delivery / Pickup' }} component={FormDeliveryScreen}></Stack.Screen>
        <Stack.Screen name='History' options={{ headerTitle: 'View History' }} component={ViewHistoryScreen}></Stack.Screen>
        <Stack.Screen name='Activity' component={ActivityScreen}></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}



export default App;


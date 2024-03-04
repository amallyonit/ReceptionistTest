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
import SplashEzEntryScreen from './src/screens/SplashEzEntryScreen';
import Color from './src/theme/Color';
import Fonts from './src/theme/Fonts';
import messaging from "@react-native-firebase/messaging"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { NotificationData } from './src/models/RecepModels';
import { RegisterMessageToken } from './src/requests/recNotifiRequest';
import { Alert } from 'react-native';
import notifee from '@notifee/react-native';

const Stack = createNativeStackNavigator()


const App = () => {
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
        RegisterMessageToken(data)?.then((reponse)=>{
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
    messaging().onMessage(async messages=>{
        Alert.alert('EzEntry App Notification ',JSON.stringify(messages))
        if(messages.data!=undefined){
        notifee.displayNotification(messages.data)
        }
        console.log("messages ",JSON.stringify(messages))
    })
  }
  const onMessageBackground = async ()=>{
    messaging().setBackgroundMessageHandler(async messages=>{
      Alert.alert('EzEntry App Notification ',JSON.stringify(messages))
    })
  }
  
  const onMessageNotification = async ()=>{
    messaging().onNotificationOpenedApp(async (message)=>{
      console.log("message ",JSON.stringify(message))
    })
  }

  useEffect(() => {
    onRegisterMessaging();
    onMessageGetter();
    onMessageBackground();
    onMessageNotification();
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
      }} initialRouteName='SplashEzEntry'>
        <Stack.Screen name='SplashEzEntry' options={{ headerShown: false }} component={SplashEzEntryScreen}></Stack.Screen>
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


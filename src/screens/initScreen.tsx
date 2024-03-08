"use strict"
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import notifee from "@notifee/react-native"
import messaging from "@react-native-firebase/messaging"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PermissionsAndroid } from 'react-native';
import { MiscStoreKeys } from '../constants/RecStorageKeys';
import { NotificationData } from '../models/RecepModels';
import { RegisterMessageToken } from '../requests/recNotifiRequest';
import Color from '../theme/Color';
import Fonts from '../theme/Fonts';
import ActivityScreen from './ActivityScreen';
import FormDeliveryScreen from './FormDeliveryScreen';
import FormScreen from './FormScreen';
import HomeScreen from './HomeScreen';
import LoginScreen from './LoginScreen';
import ViewHistoryScreen from './ViewHistoryScreen';

const Stack = createNativeStackNavigator()

const InitScreen = () => {
  const [route,setRoute] = React.useState("")
  const [routeData,setRouteData] = React.useState<any>()
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
  
  const onMessageGetter = async (message:any)=>{
    console.log("message ",message)
    await notifee.displayNotification(
      {
          title: 'New notification',
          android: {
            channelId:'default',
            pressAction: {
              id: 'default',
              mainComponent: 'notification-pop',
            },
          },
        }
  );
  }
 

  React.useEffect(() => {
    setRoute('')
    setRouteData({})
    onRegisterMessaging();
    messaging().onMessage(onMessageGetter)
    messaging().setBackgroundMessageHandler(async (message)=>{})
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    onCheckUserToken()
  }, [])
  const onCheckUserToken = async () =>{
    try {
      console.log("route 1",route)
      const token:any = await AsyncStorage.getItem(MiscStoreKeys.EZ_LOGIN)
      const infoData = JSON.parse(token)
      setRouteData(infoData)
      console.log("token data ",routeData.Token,infoData)
      if(routeData.Token!=''){
        if(routeData.Data[0][0].UserType=='U'){
          setRoute('Activity')
          console.log("route 2",route)
        }else{
          setRoute('Home')
          console.log("route 3",route)
        }
      }else{
        setRoute('Login')
        console.log("route 4",route)
      }
      console.log("route cond..",route)
    } catch (error) {
      console.log("token expired ",error)
    }
  }
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
      }} initialRouteName={route}>
        <Stack.Screen name='Login' options={{ headerShown: false }} component={LoginScreen}></Stack.Screen>
        <Stack.Screen name='Home' options={{headerShown:false}} component={HomeScreen}></Stack.Screen>
        <Stack.Screen name='Form' component={FormScreen}></Stack.Screen>
        <Stack.Screen name='PickDel' options={{ headerTitle: 'Delivery / Pickup' }} component={FormDeliveryScreen}></Stack.Screen>
        <Stack.Screen name='History' options={{ headerTitle: 'View History' }} component={ViewHistoryScreen}></Stack.Screen>
        <Stack.Screen name='Activity' component={ActivityScreen}></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}



export default InitScreen;


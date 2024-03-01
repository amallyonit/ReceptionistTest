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

const Stack =  createNativeStackNavigator()

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{
        headerTintColor:Color.whiteRecColor,
        headerTitleAlign:'center',headerTitleStyle:{
        color:Color.whiteRecColor,
        fontFamily:Fonts.recFontFamily.titleRecFont
      },headerStyle:{
        backgroundColor:Color.blueRecColor,
      },headerShown:true,statusBarAnimation:'fade',statusBarTranslucent:true,statusBarHidden:false,statusBarColor:Color.blueRecColor}} initialRouteName='SplashEzEntry'>
        <Stack.Screen name='SplashEzEntry' options={{headerShown:false}} component={SplashEzEntryScreen}></Stack.Screen>
        <Stack.Screen  name='Login' options={{headerShown:false}} component={LoginScreen}></Stack.Screen>
        <Stack.Screen name='Home' options={{headerShown:false}} component={HomeScreen}></Stack.Screen>
        <Stack.Screen name='Form' component={FormScreen}></Stack.Screen>
        <Stack.Screen name='PickDel' options={{headerTitle:'Delivery / Pickup'}} component={FormDeliveryScreen}></Stack.Screen>
        <Stack.Screen name='History' component={ViewHistoryScreen}></Stack.Screen>
        <Stack.Screen name='Activity' component={ActivityScreen}></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}



export default App;

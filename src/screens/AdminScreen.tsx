"use strict"
import React,{ Children, ReactElement, useEffect, useState } from "react"
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ActivityScreen from './ActivityScreen';
import Color from "../theme/Color";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import SettingScreen from "./SettingsScreen";
import AdminDashScreen from "./AdminDashScreen";
import { Icon } from "react-native-elements";


const Tab = createBottomTabNavigator();

const AdminScreen = ()=> {
  useEffect(()=>{

  },[])
  return (
    <Tab.Navigator>
      <Tab.Screen name="Dashboard" 
      options={{
        headerShown:true,
        headerTintColor:Color.blueRecColor,
      tabBarIcon: ({ color, size }:any) => (
        <Icon name="dashboard" color={Color.blueRecColor} size={25} />
      ),
      tabBarActiveTintColor:Color.blueRecColor}} component={AdminDashScreen} />
      <Tab.Screen name="Activity" 
      options={{
        headerShown:true,
        headerTintColor:Color.blueRecColor,
      tabBarIcon: ({ color, size }:any) => (
        <MaterialCommunityIcons name="history" color={Color.blueRecColor} size={25} />
      ),
      tabBarActiveTintColor:Color.blueRecColor}} component={ActivityScreen} />
      <Tab.Screen name="Setting" 
      options={{
      headerShown:true,
      headerTintColor:Color.blueRecColor,
      tabBarIcon: ({ color, size }:any) => (
        <MaterialCommunityIcons name="account-settings" color={Color.blueRecColor} size={25} />
      ),
      tabBarActiveTintColor:Color.blueRecColor}} component={SettingScreen} />
      
    </Tab.Navigator>
  );
}
export default AdminScreen
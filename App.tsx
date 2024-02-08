import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import FormScreen from './src/screens/FormScreen';
import FormDeliveryScreen from './src/screens/FormDeliveryScreen';
import ViewHistoryScreen from './src/screens/ViewHistoryScreen';


const Stack =  createNativeStackNavigator()

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown:false}} initialRouteName='Login'>
        <Stack.Screen  name='Login' component={LoginScreen}></Stack.Screen>
        <Stack.Screen name='Home' component={HomeScreen}></Stack.Screen>
        <Stack.Screen name='Form' component={FormScreen}></Stack.Screen>
        <Stack.Screen name='PickDel' component={FormDeliveryScreen}></Stack.Screen>
        <Stack.Screen name='History' component={ViewHistoryScreen}></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}



export default App;

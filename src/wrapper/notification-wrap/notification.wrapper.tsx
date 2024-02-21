import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import notifee, { AndroidImportance, AndroidStyle } from "@notifee/react-native";
import Color from "../../theme/Color";

  async function onDisplayNotification() {
    const channelId = await notifee.createChannel({
      id: "default",
      name: "Default Channel",
    });

    // Required for iOS
    // See https://notifee.app/react-native/docs/ios/permissions
    await notifee.requestPermission();
    await notifee.displayNotification({
      id: "1234",
      title: `New Invitation`,
      body: "Hey Sivadarsh",
      android: {
        channelId,
        importance:AndroidImportance.HIGH,
        style:{
          type: AndroidStyle.MESSAGING, 
          person: {
            name: 'Amal',
            icon: 'https://my-cdn.com/avatars/123.png',
          },
          messages:[{
            text: 'Hey, how are you?',
            timestamp: Date.now() - 600000, // 10 minutes ago
          },
          {
            text: 'Great thanks, food later?',
            timestamp: Date.now(), // Now
            person: {
              name: 'Sarah Lane',
              icon: 'https://my-cdn.com/avatars/567.png',
            },
          }
        ]
        },
        color: Color.blueRecColor,
        timestamp: Date.now() - 800, // 8 minutes ago
        showTimestamp: true,
        actions:[
          {
            title:'Yes',
            pressAction:{mainComponent:'Login',id:'check'}
          },
          {
            title:'No',
            pressAction:{id:'cancel'}
          }
        ]
      },
    });
  }
  // Clearing notification
  const onClearNotification = () => {
    notifee.cancelDisplayedNotifications()
  };


export default onDisplayNotification;

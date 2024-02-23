import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import notifee, { AndroidImportance, AndroidStyle } from "@notifee/react-native";
import Color from "../../theme/Color";

  async function onDisplayNotification(data:any) {
    const channelId = await notifee.createChannel({
      id: "default",
      name: "Default Channel",
    });

    // Required for iOS
    // See https://notifee.app/react-native/docs/ios/permissions
    await notifee.requestPermission();
    await notifee.displayNotification(data);
  }
  // Clearing notification
  const onClearNotification = () => {
    notifee.cancelDisplayedNotifications()
  };


export default onDisplayNotification;

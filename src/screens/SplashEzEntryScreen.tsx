import React, { useEffect, useState } from "react"
import { Animated, Image } from "react-native";
import BootSplash from "react-native-bootsplash";
const logoImage = require('../../assets/EzEntry-removebg-preview.png')

type Props = {
  onAnimationEnd: () => void;
};

const SplashEzEntryScreen = ({ onAnimationEnd }: Props) => {
  const [opacity] = useState(() => new Animated.Value(1));

  const { container, logo} = BootSplash.useHideAnimation({
    manifest: require("../assets/bootsplash_manifest.json"),
    logo: require("../../assets/EzEntry-removebg-preview.png"),
    statusBarTranslucent: true,
    navigationBarTranslucent: false,

    animate: () => {
      // Perform animations and call onAnimationEnd
      Animated.timing(opacity, {
        useNativeDriver: true,
        toValue: 0,
        duration: 500,
      }).start(() => {
        onAnimationEnd();
      });
    },
  });

  return (
    <Animated.View {...container} style={[container.style, { opacity }]}>
      <Image {...logo} />
      {/* <Image {...brand} /> */}
    </Animated.View>
  );
};
export default SplashEzEntryScreen
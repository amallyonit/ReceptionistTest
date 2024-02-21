import React from "react"
import { Text, View } from "react-native"

const ActivityScreen = ({route,navigation}:any) => {
    console.log(route,navigation)

    return(
        <View>
            <Text>Activity Screen</Text>
        </View>
    )
}

export default ActivityScreen
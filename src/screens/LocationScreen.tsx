import React, { useState } from "react"
import { Dimensions, StyleSheet, Text, View } from "react-native"
import { Dropdown } from "react-native-element-dropdown";
import Color from "../theme/Color";
import { UserLoginLocation } from "../models/RecepModels";
import { RetrieveValue, StoreValue } from "../wrapper/storedata.wrapper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Fonts from "../theme/Fonts";

const LocationScreen = ({route,navigation}:any)=>{
    const [value, setValue] = useState("");
    const locations:UserLoginLocation[] = route.params['userLocations']
    return(
        <View>
        <View style={{ width: '100%', backgroundColor: Color.greenRecColor, height: 60, alignItems: 'center', flexDirection: 'row' }}>
                    <Text style={{ color: Color.whiteRecColor, fontSize: 16, flex: 1.6, marginLeft: 15 }}>
                        <Icon onPress={() =>
                            navigation.navigate("Login")
                        } name="arrow-left" size={28} color={Color.whiteRecColor}></Icon>
                    </Text>
                    <Text style={{ marginLeft: 10, color: Color.whiteRecColor, fontSize: 18, fontFamily: Fonts.recFontFamily.titleRecFont, flex: 2 }}>Locations</Text>
                </View>
                <View style={styles.container}>
                <Dropdown
                        style={styles.dropdown}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        iconStyle={styles.iconStyle}
                        data={locations}
                        itemTextStyle={{color:Color.blackRecColor}}
                        search
                        maxHeight={300}
                        labelField="LocationName"
                        valueField="LocationCompanyCode"
                        placeholder="Select Locations"
                        searchPlaceholder="Search..."
                        value={value}
                        onChange={async item => {
                            setValue(item.LocationName);
                            StoreValue('EZ_USER_LOCTION',item)
                            let data = await RetrieveValue('EZ_USER_LOCTION')
                            let uData = await RetrieveValue('EZ_LOGIN_DET')
                            console.log("data ",data,uData)
                        }}
                    />
                </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        margin:Dimensions.get('window').height * 0.1
    },
    dropdown: {
        height: 50,
        borderBottomColor: Color.blackRecColor,
        borderBottomWidth: 1,
        marginHorizontal: 20,
    },
    icon: {
        marginRight: 5,
    },
    placeholderStyle: {
        fontSize: 16,
        color: Color.blackRecColor
    },
    selectedTextStyle: {
        fontSize: 16,
        color: Color.blackRecColor
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
})

export default LocationScreen
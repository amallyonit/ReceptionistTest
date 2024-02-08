import React, { useState } from "react"
import { Image, Linking, Pressable, StyleSheet, Text, TextInput, View } from "react-native"
import Color from "../theme/Color"
import Fonts from "../theme/Fonts"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { InfoFormProps } from "../models/RecepModels";
import { Dropdown } from "react-native-element-dropdown"

const camLogo = require("../../assets/recscreen/CAMERA.png")

const FormScreen = ({ route, navigation }: any) => {
    const data: InfoFormProps = route.params["propData"]
    const [value, setValue] = useState("");
    const userData = [
        { label: 'Amal', value: '1' },
        { label: 'Ajith', value: '2' },
        { label: 'Manoj', value: '3' },
        { label: 'Sivadarsh', value: '4' },
        { label: 'Shyamily', value: '5' },
        { label: 'Jayachandran', value: '6' },
        { label: 'Dileep', value: '7' },
        { label: 'Prabakar', value: '8' },
    ];
    return (
        <View>
            <View style={styles.container}>
                <View style={{ width: '100%', backgroundColor: Color.greenRecColor, height: 60, alignItems: 'center', flexDirection: 'row' }}>
                    <Text style={{ color: Color.whiteRecColor, fontSize: 16, flex: 1.6, marginLeft: 15 }}>
                        <Icon onPress={() =>
                            navigation.navigate("Home")
                        } name="arrow-left" size={28} color={Color.whiteRecColor}></Icon>
                    </Text>
                    <Text style={{ marginLeft: 10, color: Color.whiteRecColor, fontSize: 18, fontFamily: Fonts.recFontFamily.titleRecFont, flex: 2 }}>{data.appBarTitle}</Text>
                </View>
                <View style={styles.inputView}>
                    <TextInput style={styles.input} placeholder='Mobile No of Vistor' autoCapitalize='none' />
                    <TextInput style={styles.input} placeholder='Name of Vistor' autoCapitalize='none' />
                    <TextInput style={styles.input} placeholder='From' autoCapitalize='none' />
                    <TextInput style={styles.input} placeholder='Purpose of Vistor' autoCapitalize='none' />
                    <TextInput style={styles.input} placeholder="Company name" autoCapitalize='none'></TextInput>
                    <TextInput style={styles.input} placeholder='Meeting with' autoCapitalize='none' />
                    <Dropdown
                        style={styles.dropdown}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        iconStyle={styles.iconStyle}
                        data={userData}
                        search
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder="Meeting with"
                        searchPlaceholder="Search..."
                        value={value}
                        onChange={item => {
                            setValue(item.value);
                        }}
                    />
                    <TextInput keyboardType="numeric" style={styles.input} placeholder='No of Visitors' autoCapitalize='none' />
                </View>
                <View style={styles.boxRow}>
                    <View style={styles.uploadBox}>
                        <Image source={camLogo} style={styles.imageSize}></Image>
                    </View>
                    <View style={styles.uploadBox}>
                        <View style={styles.outlineButton}>
                            <Text style={styles.buttonText}>Send Request <Icon name="send" size={15} color={Color.blackRecColor}></Icon> </Text>
                        </View>
                        <View style={styles.statusView}>
                            <Text style={styles.statusText}>Status <Icon name="check-circle" size={15} color={Color.blackRecColor}></Icon></Text>
                        </View>
                    </View>
                </View>
                <View style={styles.remarkInputView}>
                    <View>
                        <Text style={{ marginLeft: 20, textAlign: 'center', color: 'blue', width: 100, borderBottomWidth: 1, borderBottomColor: 'blue', marginBottom: 10 }} onPress={() => Linking.openURL('https://google.com')}>Take Photo</Text>
                    </View>
                    <TextInput placeholder="Remarks" style={styles.remarkInput}></TextInput>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
    },
    statusView: {
        marginLeft: 'auto',
        marginRight: 40,
        marginTop: 40,
        height: 35,
        textAlign: 'center'
    },
    statusText: {
        color: Color.blackRecColor,
    },
    imageSize: {
        marginTop: 10,
        width: 150,
        height: 150
    },
    buttonText: {
        color: Color.blackRecColor,
        fontSize: 14,
        paddingTop: 6,
        textAlign: 'center',
    },
    outlineButton: {
        marginLeft: 'auto',
        marginTop: 10,
        height: 35,
        width: 130,
        borderWidth: 1,
        borderColor: Color.greenRecColor,
        textAlign: 'center'
    },
    boxRow: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        width: "100%",
        paddingHorizontal: 30,
    },
    uploadBox: {
        width: '50%',
    },
    inputView: {
        marginTop: 30,
        gap: 3,
        width: "100%",
        paddingHorizontal: 10,
        marginBottom: 5
    },
    input: {
        height: 40,
        paddingHorizontal: 20,
        borderColor: Color.blackRecColor,
        color: '#464646',
        borderBottomWidth: 1,
        borderRadius: 50
    },
    remarkInputView: {
        marginTop: 160,
        width: '100%',
        padding: 20,
    },
    remarkInput: {
        textAlign: 'justify',
        height: 137,
        justifyContent: 'flex-start',
        backgroundColor: Color.lightGreyRecColor
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
    },
    selectedTextStyle: {
        fontSize: 16,
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

export default FormScreen
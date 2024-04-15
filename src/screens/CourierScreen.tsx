"use strict"
import React, { useEffect, useState } from "react"
import { ActivityIndicator, Alert, Dimensions, FlatList, GestureResponderEvent, Image, Modal, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import Color from "../theme/Color"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { InfoFormProps, UserLDData, UserLoginLocation, UserPayload } from "../models/RecepModels";
import { CheckBox, ListItem } from "react-native-elements"
import { MiscStoreKeys } from "../constants/RecStorageKeys"
import AsyncStorage from "@react-native-async-storage/async-storage"

const CourierScreen = ({ route, navigation }: any) => {
    const [fromP, setFromPlace] = useState("")
    const [toPla, setToPlace] = useState("")
    const [doc, setDoc] = useState("")
    const [name, setName] = useState("")
    const [hadTo, setHandTo] = useState("")
    const [hadOn, setHandOn] = useState("")
    const [inout, setInOut] = useState(0)
    const [viewUser, setViewUser] = useState<UserLDData>()
    useEffect(() => {
        getUserData()
        navigation.setOptions({ headerTitle: data.appBarTitle })
    }, [])
    const data: InfoFormProps = route.params["propData"]
    const getUserData = async () => {
        setViewUser({ UserCode: '', UserDeviceToken: '', UserMobileNo: '', UserName: '', UserPassword: '', UserType: '', LocationPremise: '' })
        const data: any = await AsyncStorage.getItem(MiscStoreKeys.EZ_LOGIN)
        const vals = JSON.parse(data)
        console.log("data ", vals.Data[0][0])
        setViewUser(vals.Data[0][0])
    }

    const [query, setQuery] = useState('');
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);
    const [courName,setCourName] =  useState([])

    const handleInputChange = (text: any) => {
        AsyncStorage.setItem('CON_STATUS',JSON.stringify({EMP_STAT:'EMPTY'}))
        setQuery(text);
        filterSuggestions(text);
    };

    const filterSuggestions = (text: any) => {
        const filtered = courName.filter((item: any) =>
            item.VisitorMobileNo.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredSuggestions(filtered);
    };

    const handleSelectSuggestion = (item: any) => {
        setQuery(item.VisitorMobileNo);
        setFilteredSuggestions([]);
    };

    return (
        <SafeAreaView>
            <View>
                <View style={styles.container}>
                    <View style={{ marginTop: Dimensions.get('window').width > 756 ? 10 : 3.6, width: Dimensions.get('window').width > 756 ? '92%' : '85%', height: 20, alignItems: 'center', position: 'absolute', borderRadius: 5, backgroundColor: Color.blueRecColor, borderColor: Color.blueRecColor, borderWidth: 1 }}>
                        <Text style={{ color: Color.whiteRecColor, fontSize: 16, fontWeight: '500', textAlign: 'center' }}>{viewUser?.UserCode} - {viewUser?.LocationPremise}</Text>
                    </View>
                    <View style={{ marginTop: Dimensions.get('window').width > 756 ? 25 : 20, width: '100%', overflow: 'scroll' }}>
                        <View style={styles.inputView1}>
                            <View style={{ flex: 1, flexDirection: 'row', marginHorizontal: 12 }}>
                                <CheckBox
                                    title={'In'}
                                    checked={inout === 0}
                                    onPress={() => setInOut(0)}
                                    checkedIcon="dot-circle-o"
                                    uncheckedIcon="circle-o"
                                    containerStyle={{ backgroundColor: 'transparent' }}
                                />
                                <CheckBox
                                    title={'Out'}
                                    checked={inout === 1}
                                    onPress={() => setInOut(1)}
                                    checkedIcon="dot-circle-o"
                                    uncheckedIcon="circle-o"
                                    containerStyle={{ backgroundColor: 'transparent' }}
                                />
                            </View>
                            <TextInput
                                value={fromP}
                                onChangeText={name => setFromPlace(name)}
                                style={[styles.input, { borderBottomColor: fromP == '' ? Color.redRecColor : Color.darkRecGray }]} placeholderTextColor={Color.blackRecColor}
                                placeholder='From / Place' autoCapitalize='none' />
                            <TextInput
                                value={toPla}
                                onChangeText={name => setToPlace(name)}
                                style={[styles.input, { borderBottomColor: toPla == '' ? Color.redRecColor : Color.darkRecGray }]} placeholderTextColor={Color.blackRecColor}
                                placeholder='To Place' autoCapitalize='none' />
                            <TextInput
                                value={doc}
                                onChangeText={name => setDoc(name)}
                                style={[styles.input, { borderBottomColor: doc == '' ? Color.redRecColor : Color.darkRecGray }]} placeholderTextColor={Color.blackRecColor}
                                placeholder='Docket no' autoCapitalize='none' />
                            <TextInput
                                value={name}
                                onChangeText={name => setName(name)}
                                style={[styles.input, { borderBottomColor: name == '' ? Color.redRecColor : Color.darkRecGray }]} placeholderTextColor={Color.blackRecColor}
                                placeholder='Courier name' autoCapitalize='none' />
                            <TextInput
                                value={hadOn}
                                onChangeText={name => setHandOn(name)}
                                style={[styles.input, { borderBottomColor: hadOn == '' ? Color.redRecColor : Color.darkRecGray }]} placeholderTextColor={Color.blackRecColor}
                                placeholder='Handedover on' autoCapitalize='none' />
                            <TextInput
                                value={hadTo}
                                onChangeText={name => setHandTo(name)}
                                style={[styles.input, { borderBottomColor: hadTo == '' ? Color.redRecColor : Color.darkRecGray }]} placeholderTextColor={Color.blackRecColor}
                                placeholder='Handedover To' autoCapitalize='none' />
                            <Pressable android_ripple={{ color: Color.lightRecBlue }} style={styles.outlineButton}>
                                <Text style={styles.buttonText} >Send Request <Icon name="send" size={15} color={Color.blackRecColor}></Icon></Text>
                            </Pressable>
                            <View style={{ width: '100%',marginTop:3 }}>
                            <TextInput
                                style={[styles.input, { marginHorizontal: Dimensions.get('window').width > 756 ? 30 : 20 }]}
                                value={query}
                                keyboardType="numeric"
                                maxLength={10}
                                onPressIn={() => { }}
                                onChangeText={handleInputChange}
                                placeholder="Type Phone number..."
                                placeholderTextColor={Color.blackRecColor}
                            />
                            <FlatList
                                data={filteredSuggestions}
                                renderItem={({ item }: any) => (
                                    <Pressable onPress={() => handleSelectSuggestion(item)}>
                                        <Text style={{ padding: 15, width: '100%', color: Color.blackRecColor, borderBottomColor: Color.lightGreyRecColor, borderBottomWidth: 1 }}>{item.VisitorMobileNo}</Text>
                                    </Pressable>
                                )}
                                keyExtractor={(item, index) => index.toString()}
                                style={{
                                    maxHeight: 200, marginTop: 40, marginHorizontal: 20, position: 'absolute', zIndex: 1, backgroundColor: '#fff',
                                    width: Dimensions.get('window').width > 756 ? 754 : 350
                                }}
                            />
                        </View>
                            <ScrollView style={{height:Dimensions.get('window').width > 756 ? 550:250,marginHorizontal:Dimensions.get('window').width > 756? 28:15,marginTop:1}}>
                                <ListItem containerStyle={{ backgroundColor: Color.whiteRecColor }} bottomDivider>
                                    <ListItem.Content>
                                        <ListItem.Title>Courier Name: c1</ListItem.Title>
                                        <ListItem.Subtitle style={{ color: Color.blackRecColor, }}>Place: Hsr</ListItem.Subtitle>
                                        <ListItem.Subtitle style={{ color: Color.blackRecColor }}>Mobile No: 9656214124</ListItem.Subtitle>
                                        <ListItem.Subtitle style={{ color: Color.blackRecColor }}>item: i1</ListItem.Subtitle>
                                        <ListItem.Subtitle style={{ color: Color.blackRecColor }}>Date: {new Date().toDateString()}</ListItem.Subtitle>
                                    </ListItem.Content>
                                </ListItem>
                                <ListItem containerStyle={{ backgroundColor: Color.whiteRecColor }} bottomDivider>
                                    <ListItem.Content>
                                        <ListItem.Title>Courier Name: c1</ListItem.Title>
                                        <ListItem.Subtitle style={{ color: Color.blackRecColor, }}>Place: Hsr</ListItem.Subtitle>
                                        <ListItem.Subtitle style={{ color: Color.blackRecColor }}>Mobile No: 9656214124</ListItem.Subtitle>
                                        <ListItem.Subtitle style={{ color: Color.blackRecColor }}>item: i1</ListItem.Subtitle>
                                        <ListItem.Subtitle style={{ color: Color.blackRecColor }}>Date: {new Date().toDateString()}</ListItem.Subtitle>
                                    </ListItem.Content>
                                </ListItem>
                                <ListItem containerStyle={{ backgroundColor: Color.whiteRecColor }} bottomDivider>
                                    <ListItem.Content>
                                        <ListItem.Title>Courier Name: c1</ListItem.Title>
                                        <ListItem.Subtitle style={{ color: Color.blackRecColor, }}>Place: Hsr</ListItem.Subtitle>
                                        <ListItem.Subtitle style={{ color: Color.blackRecColor }}>Mobile No: 9656214124</ListItem.Subtitle>
                                        <ListItem.Subtitle style={{ color: Color.blackRecColor }}>item: i1</ListItem.Subtitle>
                                        <ListItem.Subtitle style={{ color: Color.blackRecColor }}>Date: {new Date().toDateString()}</ListItem.Subtitle>
                                    </ListItem.Content>
                                </ListItem>
                                <ListItem containerStyle={{ backgroundColor: Color.whiteRecColor }} bottomDivider>
                                    <ListItem.Content>
                                        <ListItem.Title>Courier Name: c1</ListItem.Title>
                                        <ListItem.Subtitle style={{ color: Color.blackRecColor, }}>Place: Hsr</ListItem.Subtitle>
                                        <ListItem.Subtitle style={{ color: Color.blackRecColor }}>Mobile No: 9656214124</ListItem.Subtitle>
                                        <ListItem.Subtitle style={{ color: Color.blackRecColor }}>item: i1</ListItem.Subtitle>
                                        <ListItem.Subtitle style={{ color: Color.blackRecColor }}>Date: {new Date().toDateString()}</ListItem.Subtitle>
                                    </ListItem.Content>
                                </ListItem>
                            </ScrollView>
                        </View>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
    },
    autocompleteContainer: {
        backgroundColor: '#ffffff',
        borderWidth: 0,
    },
    statusView: {
        marginLeft: 'auto',
        marginRight: 28,
        marginTop: 40,
        height: 35,
        textAlign: 'center'
    },
    statusText: {
        color: Color.blackRecColor,
        fontSize: 25,
    },
    statusRText: {
        color: Color.redRecColor,
        fontSize: 25,
    },
    statusSText: {
        color: Color.greenRecColor,
        fontSize: 25,
    },
    imageSize: {
        marginTop: 10,
        width: Dimensions.get('window').width > 756 ? 200 : 150,
        height: 150
    },
    buttonText: {
        color: Color.blackRecColor,
        fontSize: 14,
        paddingTop: 6,
        textAlign: 'center',
    },
    outlineButton: {
        marginHorizontal: Dimensions.get('window').height * 0.02,
        marginLeft: 'auto',
        marginTop: 10,
        height: 35,
        width: 130,
        textAlign: 'center',
        borderRadius: 2,
        backgroundColor: Color.blueRecColor,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        elevation: 9,
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
        marginBottom: 5,
    },
    inputView1: {
        marginTop: 0,
        gap: 3,
        width: "100%",
        paddingHorizontal: 10,
        marginBottom: 5,
    },
    input: {
        height: Dimensions.get('window').width > 756 ? 50 : 40,
        paddingHorizontal: 10,
        borderBottomWidth: 1.5,
        borderBottomColor: Color.darkRecGray,
        borderTopRightRadius: 11,
        borderTopLeftRadius: 11,
        color: Color.blackRecColor,
        backgroundColor: Color.lightNewGrey,
        marginHorizontal: 20,
        marginBottom: Dimensions.get('window').width > 756 ? 10 : 8
    },
    remarkInputView: {
        marginTop: Dimensions.get('window').width > 756 ? 160 : 150,
        width: '100%',
        padding: 20,
    },
    remarkInputView1: {
        width: '100%',
        padding: 20,
    },
    remarkInput: {
        backgroundColor: Color.lightNewGrey,
        borderBottomColor: Color.darkRecGray,
        borderBottomWidth: 1.5,
        borderTopRightRadius: 11,
        borderTopLeftRadius: 11,
        color: Color.blackRecColor,
        textAlignVertical: 'top',
        height: Dimensions.get('window').width > 756 ? 300 : 137,
    },
    dropdown: {
        height: Dimensions.get('window').width > 756 ? 50 : 40,
        borderBottomColor: Color.darkRecGray,
        borderBottomWidth: 1.5,
        marginHorizontal: 20,
        backgroundColor: Color.lightNewGrey,
        borderTopRightRadius: 11,
        borderTopLeftRadius: 11,
        marginBottom: Dimensions.get('window').width > 756 ? 5 : 8
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
        color: Color.blackRecColor
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    centeredViews: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
    },
    modalView: {
        margin: 10,
        width: '60%',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
    },
    buttoonIconSe: {
        borderRadius: 100, borderColor: Color.greenRecColor,
        shadowColor: Color.greenRecColor,
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 0.1
    },
    buttoonIconSe1: {
        borderRadius: 100, borderColor: Color.redRecColor,
        shadowColor: Color.redRecColor,
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 0.1
    },
    button: {
        borderRadius: 5,
        paddingHorizontal: 20,
        paddingVertical: 5,
    },
    buttonClose: {
        backgroundColor: Color.whiteRecColor,
    },
    textStyle: {
        color: Color.whiteRecColor,
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 20
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
        color: Color.blueRecColor,
        fontSize: Dimensions.get('window').fontScale * 20
    },
})

export default CourierScreen
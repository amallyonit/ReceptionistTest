import React, { useEffect, useState } from "react";
import { Alert, Button, Dimensions, Linking, PermissionsAndroid, Platform, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { CheckBox } from "react-native-elements";
import Color from "../theme/Color";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MiscStoreKeys } from "../constants/RecStorageKeys";
import { UserLDData } from "../models/RecepModels";
import { Dropdown } from "react-native-element-dropdown";
import DateTimePicker from "@react-native-community/datetimepicker";
import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';
import * as XLSX from 'xlsx';
import { Buffer } from 'buffer';
import { GETReports } from "../requests/recProdRequest";
import Snackbar from "react-native-snackbar";
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Pdf from 'react-native-pdf';

const ReportScreen = ({ route }: any) => {
    const { screenName } = route.params;
    console.log("propnames", screenName)
    const [inout, setInOut] = useState(0)
    const [viewUser, setViewUser] = useState<UserLDData>()
    const [pdfPath, setPdfPath] = useState('');
    const [usrType, setUsrType] = useState("")
    const [typelocs, setTypeLocs] = useState<{ cattype: string; catvalue: number }[]>([
        {
            cattype: 'MEETING',
            catvalue: 1
        },
        {
            cattype: 'VISIT',
            catvalue: 2
        },
        {
            cattype: 'SERVICE',
            catvalue: 3
        },
        {
            cattype: 'CONTRACTOR',
            catvalue: 4
        },
        {
            cattype: 'COURIER',
            catvalue: 5
        },
        {
            cattype: 'GATE_ENTRY',
            catvalue: 6
        },

    ])
    useEffect(() => {
        getUserData()
    }, []);

    const getUserData = async () => {
        setViewUser({ UserCode: '', UserDeviceToken: '', UserMobileNo: '', UserName: '', UserPassword: '', UserType: '', LocationPremise: '' })
        const data: any = await AsyncStorage.getItem(MiscStoreKeys.EZ_LOGIN)
        const vals = JSON.parse(data)
        console.log("data ", vals.Data[0][0])
        setViewUser(vals.Data[0][0])
    }

    const [fromDate, setFromDate] = useState(new Date());
    const [toDate, setToDate] = useState(new Date());
    const [showFromDatePicker, setShowFromDatePicker] = useState(false);
    const [showToDatePicker, setShowToDatePicker] = useState(false);

    const showFromDatepicker = () => {
        setShowFromDatePicker(true);
    };

    const showToDatepicker = () => {
        setShowToDatePicker(true);
    };

    const onChangeFromDate = (event: any, selectedDate: any) => {
        const currentDate = selectedDate || fromDate;
        setShowFromDatePicker(Platform.OS === 'ios' ? true : false);
        setFromDate(currentDate);
    };

    const onChangeToDate = (event: any, selectedDate: any) => {
        const currentDate = selectedDate || toDate;
        setShowToDatePicker(Platform.OS === 'ios' ? true : false);
        setToDate(currentDate);
    };
    const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        const milliseconds = String(date.getMilliseconds()).padStart(3, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
    };
    const [useExcelItems, setUseExcelItems] = useState<any[]>([])
    const getReportsItems = async (): Promise<any[]> => {
        try {
            console.log({
                FromDt: formatDate(fromDate),
                ToDt: formatDate(toDate),
                RptType: viewUser?.UserType,
                userCode: viewUser?.UserCode
            })
            const res = await GETReports({
                FromDt: formatDate(fromDate),
                ToDt: formatDate(toDate),
                RptType: viewUser?.UserType,
                userCode: viewUser?.UserCode
            });
            setUseExcelItems(res?.data?.Data);
            return res?.data?.Data;
        } catch (error) {
            console.log("error ", error);
            return [];
        }
    };
    const requestManageStoragePermission = async () => {
        if (Platform.OS === 'android' && Platform.Version >= 30) {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.MANAGE_EXTERNAL_STORAGE
                );

                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log('Manage storage permission granted');
                } else if (granted === PermissionsAndroid.RESULTS.DENIED) {
                    Alert.alert(
                        'Permission Denied',
                        'You need to enable Manage Storage permission in settings to proceed.',
                        [
                            {
                                text: 'Go to Settings',
                                onPress: () => Linking.openSettings(),
                            },
                            { text: 'Cancel' },
                        ]
                    );
                } else if (granted === null) {
                    console.warn('Permission result is null, user might have dismissed the permission dialog');
                    Alert.alert(
                        'Permission Unknown',
                        'Permission result is unknown, please ensure the app has necessary permissions.',
                        [
                            {
                                text: 'Go to Settings',
                                onPress: () => Linking.openSettings(),
                            },
                            { text: 'Cancel' },
                        ]
                    );
                }
            } catch (err) {
                console.warn('Error requesting MANAGE_EXTERNAL_STORAGE permission', err);
            }
        }
    };

    const requestPermissions = async () => {
        if (Platform.OS === 'android') {
            if (Platform.Version >= 30) {
                Alert.alert("Permission Required", "Please allow the storage permission to download the reports");
                await requestManageStoragePermission();
            } else {
                const granted = await PermissionsAndroid.requestMultiple([
                    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                ]);

                if (
                    granted['android.permission.READ_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED &&
                    granted['android.permission.WRITE_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED
                ) {
                    console.log('Storage permissions granted');
                } else {
                    console.log('Storage permissions denied');
                }
            }
        }
    };
    const requestStoragePermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.MANAGE_EXTERNAL_STORAGE,
                {
                    title: 'Storage Permission',
                    message: 'This app needs access to your storage to open Excel files.',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('Storage permission granted');
            } else {
                console.log('Storage permission denied');
            }
        } catch (err) {
            console.warn(err);
        }
    };
    const [urlTOOpen, setUrlTOOpen] = useState('')
    const exportTOExcel = async () => {
        try {
            let result: any[] = await getReportsItems()
            console.log(result)
            if (result.length !== 0) {
                result = result.map((item) => ({
                    "VehicleNo": item.ProdMovVehicleNo,
                    "Drivername": item.ProdMovDriverName,
                    "InTime": item.ProdMovInTime,
                    "Moventtype": item.ProdMovType,
                    "Partyname": item.ProdMovDetPartyName,
                    "Itemname": item.ProdMovDetItems,
                    "Itemqty": item.ProdMovDetItemQty,
                    "Billnumber": item.ProdMovDetBillNumber,
                    "MobileNo": item.ProdMovMobileNo,
                    "AuthorizedPerson": item.ProdMovAuthorizedPerson,
                    "Transporter": item.ProdMovTransporter,
                    "OutTime": item.ProdMovOutTime
                }));
            }
            // Step 2: Convert the JSON data to a worksheet
            const ws = XLSX.utils.json_to_sheet(result);

            // Step 3: Convert the worksheet to a workbook
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

            // Step 4: Write the workbook to a binary string (ArrayBuffer)
            const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

            const timestamp = new Date().toISOString().replace(/[-:.]/g, ""); // Remove characters that are not allowed in filenames
            const downloadPath = Platform.OS === 'android' ?
                RNFS.ExternalStorageDirectoryPath + `/Download/ezentrytest-report-${timestamp}.xlsx` :
                RNFS.DocumentDirectoryPath + `/ezentry-report-${timestamp}.xlsx`;

            console.log('Saving file at: ', downloadPath);

            const base64Data = Buffer.from(excelBuffer).toString('base64');
            await RNFS.writeFile(downloadPath, base64Data, 'base64');

            const fileCheck = await RNFS.exists(downloadPath);
            if (!fileCheck) {
                console.error('File does not exist at path: ', downloadPath);
                return;
            } else {
                console.log('File exists at path: ', downloadPath);
                setUrlTOOpen(downloadPath)
            }
            Snackbar.show({
                text: 'Reports Downloaded Successfully !',
                duration: Snackbar.LENGTH_LONG,
                backgroundColor: Color.whiteRecColor,
                textColor: Color.greenRecColor,
            })

        } catch (error: any) {
            console.error('Error downloading or opening Excel file:', error.message || error);
        } finally {
            console.log('downloaded the excel file');
        }
    }
    const exportTOPdf = async () => {
        let result: any[] = await getReportsItems()
        if (result.length !== 0) {
            result = result.map((item) => ({
                "VehicleNo": item.ProdMovVehicleNo,
                "Drivername": item.ProdMovDriverName,
                "InTime": item.ProdMovInTime,
                "Moventtype": item.ProdMovType,
                "Partyname": item.ProdMovDetPartyName,
                "Itemname": item.ProdMovDetItems,
                "Itemqty": item.ProdMovDetItemQty,
                "Billnumber": item.ProdMovDetBillNumber,
                "MobileNo": item.ProdMovMobileNo,
                "AuthorizedPerson": item.ProdMovAuthorizedPerson,
                "Transporter": item.ProdMovTransporter,
                "OutTime": item.ProdMovOutTime
            }));
        }

        const headers = Object.keys(result[0]);

        // Generate table rows dynamically based on content
        const tableRows = result.map(item => {
            return `
            <tr>
              ${headers.map(header => `<td>${item[header]}</td>`).join('')}
            </tr>
          `;
        }).join('');

        // Generate HTML content with dynamic table headers and rows
        const htmlContent = `
          <h1>${'Ezentry reports'}</h1>
          <table border="1" cellpadding="5" cellspacing="0" style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr>
                ${headers.map(header => `<th style="text-align: left;">${header}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
        `;

        try {
            const timestamp = new Date().toISOString().replace(/[-:.]/g, ''); // Remove characters that are not allowed in filenames
            const fileName = `ezentry-report-pdf-${timestamp}.pdf`;

            const directory =
                Platform.OS === 'android'
                    ? `${RNFS.ExternalStorageDirectoryPath}/Download/`
                    : RNFS.DocumentDirectoryPath;

            const filePath = directory + fileName;
            console.log('Saving PDF to:', filePath);

            const options = {
                html: htmlContent,
                fileName: fileName,
                directory: directory,
            };

            const file = await RNHTMLtoPDF.convert(options);
            // Check if the file has been successfully created
            if (file && file.filePath) {
                setPdfPath(filePath)
            } else {
                Alert.alert('Error', 'Failed to create PDF');
            }
            Alert.alert('PDF created successfully!', `Path: ${file.filePath}`);
        } catch (err) {
            console.error(err);
            Alert.alert('Error', 'Failed to create PDF');
        }

    }
    const handleExport = async () => {
        if (usrType !== "") {
            if (inout === 0) {
                let pdfExport = await exportTOPdf()
            } else {
                let excelExport = await exportTOExcel()
            }
        } else {
            Snackbar.show({
                text: 'Select the report type and date range !',
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: Color.whiteRecColor,
                textColor: Color.orangRecLight,
            })
        }


    };

    return (
        <SafeAreaView>
            <View>
                <View style={styles.container}>
                    {screenName !== "ADMIN" && <View style={{ marginTop: Dimensions.get('window').width > 756 ? 10 : 3.6, width: Dimensions.get('window').width > 756 ? '92%' : '85%', height: 20, alignItems: 'center', position: 'absolute', borderRadius: 5, backgroundColor: Color.blueRecColor, borderColor: Color.blueRecColor, borderWidth: 1 }}>
                        <Text style={{ color: Color.whiteRecColor, fontSize: 16, fontWeight: '500', textAlign: 'center' }}>{viewUser?.UserName} - {viewUser?.LocationPremise}</Text>
                    </View>}
                    <View style={{ marginTop: Dimensions.get('window').width > 756 ? 25 : 20, width: '100%', overflow: 'scroll' }}>
                        <View style={styles.inputView1}>
                            <View style={{ flex: 1, flexDirection: 'row', marginHorizontal: 12 }}>
                                <CheckBox
                                    title={'PDF'}
                                    checkedIcon="dot-circle-o"
                                    checked={inout === 0}
                                    onPress={() => setInOut(0)}
                                    uncheckedIcon="circle-o"
                                    containerStyle={{ backgroundColor: 'transparent' }}
                                />
                                <CheckBox
                                    title={'EXCEL'}
                                    checkedIcon="dot-circle-o"
                                    checked={inout === 1}
                                    onPress={() => setInOut(1)}
                                    uncheckedIcon="circle-o"
                                    containerStyle={{ backgroundColor: 'transparent' }}
                                />
                            </View>
                            <Dropdown
                                style={[styles.dropdown, { borderBottomColor: Color.blackRecColor }]}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                inputSearchStyle={styles.inputSearchStyle}
                                iconStyle={styles.iconStyle}
                                data={typelocs}
                                itemTextStyle={{ color: Color.blackRecColor }}
                                search
                                maxHeight={300}
                                labelField="cattype"
                                valueField="cattype"
                                placeholder="select report type"
                                searchPlaceholder="Search...types"
                                value={usrType}
                                onChange={(item) => {
                                    setUsrType(item.cattype)
                                }} />
                            <View style={{ flex: 1, justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 12 }}>
                                {/* From Date */}
                                <View style={{ flexDirection: 'row' }}>
                                    <TextInput placeholderTextColor={Color.blackRecColor}
                                        value={fromDate.toDateString()}
                                        onPressIn={showFromDatepicker} style={[styles.input, { width: '100%' }]} placeholder="From Date" />
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <TextInput placeholderTextColor={Color.blackRecColor}
                                        value={toDate.toDateString()}
                                        onPressIn={showToDatepicker} style={[styles.input, { width: '100%' }]}
                                        placeholder="To Date" />
                                </View>

                                {showFromDatePicker && (
                                    <DateTimePicker
                                        value={fromDate}
                                        mode="date"
                                        is24Hour={true}
                                        display="default"
                                        onChange={onChangeFromDate}
                                    />
                                )}

                                {showToDatePicker && (
                                    <DateTimePicker
                                        value={toDate}
                                        mode="date"
                                        is24Hour={true}
                                        display="default"
                                        onChange={onChangeToDate}
                                    />
                                )}
                            </View>
                            <View style={{ marginHorizontal: 10 }}>
                                <Button title="Submit" onPress={handleExport} />
                            </View>
                        </View>
                    </View>
                </View>
                {pdfPath && (
                    <Pdf
                        source={{ uri: pdfPath, cache: true }}  // Show the PDF using the file path
                        onLoadComplete={(numberOfPages, filePath) => {
                            console.log(`number of pages: ${numberOfPages}`);
                        }}
                        onPageChanged={(page, numberOfPages) => {
                            console.log(`current page: ${page}`);
                        }}
                        onError={(error) => {
                            console.log(error);
                        }}
                    />
                )}
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
    styleSnack: {
        position: 'absolute',
        top: 0,
        zIndex: 1000
    }
})

export default ReportScreen
import React, { useEffect, useState } from "react";
import { Alert, Button, Dimensions, FlatList, Linking, PermissionsAndroid, Platform, SafeAreaView, ScrollView, Share, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
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
// import RNHTMLtoPDF from 'react-native-html-to-pdf';
// import Pdf from 'react-native-pdf';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions'; // Import from react-native-permissions


const ReportScreen = ({ route }: any) => {
    const { screenName } = route.params;
    console.log("propnames", screenName)
    const [inout, setInOut] = useState(0)
    const [viewUser, setViewUser] = useState<UserLDData>()
    const [datset, setDataSet] = useState<any[]>([]);
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
            return res?.data?.Data;
        } catch (error) {
            console.log("error ", error);
            return [];
        }
    };

    const [urlTOOpen, setUrlTOOpen] = useState('')
    // State to keep track of the current page
    const [currentPage, setCurrentPage] = useState(0);
    const rowsPerPage = 12;

    // Calculate the data to be shown on the current page
    const currentRows = useExcelItems.slice(
        currentPage * rowsPerPage,
        (currentPage + 1) * rowsPerPage
    );

    // Calculate the total number of pages
    const totalPages = Math.ceil(useExcelItems.length / rowsPerPage);

    // Handle the "Next" button click
    const goToNextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(currentPage + 1);
        }
    };

    // Handle the "Previous" button click
    const goToPreviousPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    const requestStoragePermission = async () => {
        if (Platform.OS === 'android') {
          const permission = PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE;
      
          try {
            const status = await check(permission);
            if (status === RESULTS.GRANTED) {
              return true;
            } else if (status === RESULTS.DENIED) {
              const requestStatus = await request(permission);
              if (requestStatus === RESULTS.GRANTED) {
                return true;
              } else {
                Alert.alert('Storage permission denied');
                return false;
              }
            } else if (status === RESULTS.BLOCKED) {
              Alert.alert('Permission blocked. Please enable it from settings.');
              return false;
            }
          } catch (error) {
            console.error('Error checking or requesting permission:', error);
            return false;
          }
        }
        return true;  // For iOS or other platforms
      };
      

    const exportTOExcel = async () => {
        try {
            const hasPermission = await requestStoragePermission();
            console.log(Platform.Version,Platform.OS)
            if (!hasPermission) {
                console.error('Storage permission denied');
                Snackbar.show({
                  text: 'Storage permission denied!',
                  duration: Snackbar.LENGTH_LONG,
                  backgroundColor: Color.whiteRecColor,
                  textColor: Color.redRecColor,
                });
              }
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
            setUseExcelItems(result)
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
              try {
                await Share.share({
                  title:'EzEntry Report',
                  message: 'Here is the report you requested',
                  url: `file://${downloadPath}`, // The local file path to be share
                });
                Snackbar.show({
                  text: 'Report Shared Successfully!',
                  duration: Snackbar.LENGTH_LONG,
                  backgroundColor: Color.whiteRecColor,
                  textColor: Color.greenRecColor,
                });
              } catch (error) {
                console.error('Error while sharing the file: ', error);
                Snackbar.show({
                  text: 'Failed to share report!',
                  duration: Snackbar.LENGTH_LONG,
                  backgroundColor: Color.whiteRecColor,
                  textColor: Color.redRecColor,
                });
              }
        } catch (error: any) {
            console.error('Error downloading or opening Excel file:', error.message || error);
        } finally {
            console.log('downloaded the excel file');
        }
    }

    const handleExport = async () => {
        if (usrType !== "") {
            let excelExport = await exportTOExcel()
            console.log("excelExport", excelExport)
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
            <ScrollView>
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
                                {useExcelItems.length !== 0 &&
                                    <>
                                        <View style={styles.flatcontainer}>
                                            <Text style={styles.flatheader}>Reports</Text>
                                            <ScrollView horizontal style={styles.tableContainer}>
                                                <View style={styles.table}>
                                                    <View style={styles.tableRow}>
                                                        <Text style={[styles.tableHeader, { width: 120 }]}>Vehicle No</Text>
                                                        <Text style={[styles.tableHeader, { width: 150 }]}>Driver Name</Text>
                                                        <Text style={[styles.tableHeader, { width: 120 }]}>In Time</Text>
                                                        <Text style={[styles.tableHeader, { width: 150 }]}>Movement Type</Text>
                                                        <Text style={[styles.tableHeader, { width: 150 }]}>Party Name</Text>
                                                        <Text style={[styles.tableHeader, { width: 150 }]}>Item Name</Text>
                                                        <Text style={[styles.tableHeader, { width: 120 }]}>Item Quantity</Text>
                                                        <Text style={[styles.tableHeader, { width: 130 }]}>Bill Number</Text>
                                                        <Text style={[styles.tableHeader, { width: 120 }]}>Mobile No</Text>
                                                        <Text style={[styles.tableHeader, { width: 180 }]}>Authorized Person</Text>
                                                        <Text style={[styles.tableHeader, { width: 150 }]}>Transporter</Text>
                                                        <Text style={[styles.tableHeader, { width: 120 }]}>Out Time</Text>
                                                    </View>

                                                    {/* Table Rows */}
                                                    <FlatList
                                                        data={currentRows}
                                                        renderItem={({ item }) => (
                                                            <View style={styles.tableRow}>
                                                                <Text style={[styles.tableText, { width: 120 }]}>{item.VehicleNo}</Text>
                                                                <Text style={[styles.tableText, { width: 150 }]}>{item.Drivername}</Text>
                                                                <Text style={[styles.tableText, { width: 120 }]}>{item.InTime}</Text>
                                                                <Text style={[styles.tableText, { width: 150 }]}>{item.Moventtype}</Text>
                                                                <Text style={[styles.tableText, { width: 150 }]}>{item.Partyname}</Text>
                                                                <Text style={[styles.tableText, { width: 150 }]}>{item.Itemname}</Text>
                                                                <Text style={[styles.tableText, { width: 120 }]}>{item.Itemqty}</Text>
                                                                <Text style={[styles.tableText, { width: 130 }]}>{item.Billnumber}</Text>
                                                                <Text style={[styles.tableText, { width: 120 }]}>{item.MobileNo}</Text>
                                                                <Text style={[styles.tableText, { width: 180 }]}>{item.AuthorizedPerson}</Text>
                                                                <Text style={[styles.tableText, { width: 150 }]}>{item.Transporter}</Text>
                                                                <Text style={[styles.tableText, { width: 120 }]}>{item.OutTime}</Text>

                                                            </View>
                                                        )}
                                                        keyExtractor={(item, index) => index.toString()}
                                                    />
                                                </View>
                                            </ScrollView>
                                        </View>
                                        <View style={styles.paginationContainer}>
                                            <Button
                                                title="Previous"
                                                onPress={goToPreviousPage}
                                                disabled={currentPage === 0}
                                            />
                                            <Text style={[styles.pageText, { color: Color.blackRecColor }]} >
                                                Page {currentPage + 1} of {totalPages}
                                            </Text>
                                            <Button
                                                title="Next"
                                                onPress={goToNextPage}
                                                disabled={currentPage === totalPages - 1}
                                            />
                                        </View>
                                    </>
                                }
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
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
    },
    flatcontainer: {
        flex: 1,
        marginHorizontal: 10
    },
    flatheader: {
        fontSize: 24,
        fontWeight: 'bold',
        color:Color.blackRecColor,
        marginBottom: 16,
    },
    tableContainer: {
        flex: 1,
        marginBottom: 16,
    },
    table: {
        borderWidth: 1,
        borderColor: Color.blackRecColor,

        overflow: 'hidden',
    },
    tableRow: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    tableHeader: {
        fontWeight: 'bold',
        textAlign: 'center',
        flex: 1,
        padding: 8,
        color: Color.blackRecColor,
        backgroundColor: Color.whiteRecColor,
        borderRightWidth: 1,
        borderColor: Color.blackRecColor,
    },
    tableText: {
        flex: 1,
        color: Color.blackRecColor,
        textAlign: 'center',
        borderRightWidth: 1,
        borderColor: Color.blackRecColor,
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 16,
    },
    pageText: {
        marginHorizontal: 16,
        fontSize: 16,
    },
})

export default ReportScreen
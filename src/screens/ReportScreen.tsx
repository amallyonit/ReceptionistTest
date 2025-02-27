import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Button, Dimensions, FlatList, Linking, PermissionsAndroid, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { CheckBox, Icon, Overlay } from "react-native-elements";
import IconSet from 'react-native-vector-icons/MaterialCommunityIcons';
import Color from "../theme/Color";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MiscStoreKeys } from "../constants/RecStorageKeys";
import { UserLDData } from "../models/RecepModels";
import { Dropdown } from "react-native-element-dropdown";
import DateTimePicker from "@react-native-community/datetimepicker";
import RNFS from 'react-native-fs';
import * as XLSX from 'xlsx';
import Share from 'react-native-share';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import { Buffer } from 'buffer';
import { GETReports } from "../requests/recProdRequest";
import Snackbar from "react-native-snackbar";



const ReportScreen = ({ route }: any) => {
    const { screenName } = route.params;
    console.log("propnames", screenName)
    const [inout, setInOut] = useState(0)
    const [viewUser, setViewUser] = useState<UserLDData>()
    const [datset, setDataSet] = useState<any[]>([]);
    const [usrType, setUsrType] = useState("")
    const [pdfPath, setPdfPath] = useState('');
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
    const [isLoaderTrue, setisLoaderTrue] = useState(false)

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
            setisLoaderTrue(true)
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
        } finally {
            setisLoaderTrue(false)
        }
    };

    const [urlTOOpen, setUrlTOOpen] = useState('')

    const [currentPage, setCurrentPage] = useState(0);
    const rowsPerPage = 12;

    const currentRows = useExcelItems.slice(
        currentPage * rowsPerPage,
        (currentPage + 1) * rowsPerPage
    );

    const totalPages = Math.ceil(useExcelItems.length / rowsPerPage);


    const goToNextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(currentPage + 1);
        }
    };


    const goToPreviousPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };


    const exportTOExcel = async () => {
        try {
            console.log(Platform.Version, Platform.OS)
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
            Snackbar.show({
                text: 'Report Downloaded Successfully!',
                duration: Snackbar.LENGTH_LONG,
                backgroundColor: Color.greenRecColor,
                textColor: Color.whiteRecColor,
            });
        } catch (error: any) {
            console.error('Error downloading or opening Excel file:', error.message || error);
            Snackbar.show({
                text: 'Report Download Failed!',
                duration: Snackbar.LENGTH_LONG,
                backgroundColor: Color.redRecColor,
                textColor: Color.whiteRecColor,
            });
        } finally {
            console.log('downloaded the excel file');
        }
    }

    const exportToPdf = async () => {
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
            setUseExcelItems(result)
            const tableHeaders = Object.keys(result[0]);
            let tableHeader = '<thead><tr>';
            tableHeaders.forEach((header) => {
                tableHeader += `<th style="border: 1px solid black; padding: 8px; text-align: center; background-color: #f2f2f2;">${header}</th>`;
            });
            tableHeader += '</tr></thead>';
            let rows = '';
            result.forEach((rowData) => {
                rows += '<tr>';
                tableHeaders.forEach((header) => {
                    rows += `<td style="border: 1px solid black; padding: 8px; text-align: center;">${rowData[header]}</td>`;
                });
                rows += '</tr>';
            });

            const htmlContent = `
            <h1 style="text-align: center;">Ezentry pdf report</h1>
            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                ${tableHeader}
            <tbody>
                ${rows}
            </tbody>
            </table>
            `;
            // Generate the timestamp to use in the file name
            const timestamp = new Date().toISOString().replace(/[-:.]/g, ''); // Remove invalid characters from filename

            // Determine file path for PDF storage
            const downloadPath = Platform.OS === 'android' ?
                RNFS.ExternalStorageDirectoryPath + `/Download/ezentrytest-report-${timestamp}.pdf` :
                RNFS.DocumentDirectoryPath + `/ezentry-report-${timestamp}.pdf`;

            console.log('Saving file at: ', downloadPath);  // Log where the file is being saved

            // Generate PDF with the specified options
            const options = {
                html: htmlContent,
                fileName: `ezentry-report-${timestamp}`,
                directory: Platform.OS === 'android' ? 'Download' : 'Documents', // Specify the directory
            };

            const file = await RNHTMLtoPDF.convert(options);

            // Move the file to the desired download path
            if (file.filePath) {
                await RNFS.moveFile(file.filePath, downloadPath);  // Move the file from temp location to the target download path
            } else {
                throw new Error('File path is undefined');
            }
            Snackbar.show({
                text: 'Report Download Successfully!',
                duration: Snackbar.LENGTH_LONG,
                backgroundColor: Color.greenRecColor,
                textColor: Color.whiteRecColor,
            });
            // Set the generated PDF file path
            setPdfPath(downloadPath);

        } catch (error: any) {
            console.error('Error downloading or opening PDF file:', error.message || error);
            Snackbar.show({
                text: 'Report Download Failed!',
                duration: Snackbar.LENGTH_LONG,
                backgroundColor: Color.redRecColor,
                textColor: Color.whiteRecColor,
            });
        } finally {
            console.log("pdf downloaded");
        }
    }

    const handleExport = async () => {
        if (usrType !== "") {
            if (inout === 0) {
                let pdfExport = await exportToPdf()
            } else {
                let excelExport = await exportTOExcel()
            }
        } else {
            Snackbar.show({
                text: 'Select the report type and date range !',
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: Color.orangRecLight,
                textColor: Color.whiteRecColor,
            })
        }
    };

    const handleShareItems = async () => {
        if (inout === 0) {
            try {
                await Share.open({
                    title: 'EzEntry Report',
                    message: 'Here is the report you requested',
                    url: `file://${pdfPath}`,
                    type: 'application/pdf'
                });
                Snackbar.show({
                    text: 'Report Shared Successfully!',
                    duration: Snackbar.LENGTH_LONG,
                    backgroundColor: Color.greenRecColor,
                    textColor: Color.whiteRecColor,
                });
            } catch (error) {
                console.error('Error while sharing the file: ', error);
                Snackbar.show({
                    text: 'Failed to share report!',
                    duration: Snackbar.LENGTH_LONG,
                    backgroundColor: Color.whiteRecColor,
                    textColor: Color.redRecColor,
                });
            } finally{
                console.log("pdf execution block executed !")
            }
        } else {
            try {
                await Share.open({
                    title: 'EzEntry Report',
                    message: 'Here is the report you requested',
                    url: `file://${urlTOOpen}`,
                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                });
                Snackbar.show({
                    text: 'Report Shared Successfully!',
                    duration: Snackbar.LENGTH_LONG,
                    backgroundColor: Color.greenRecColor,
                    textColor: Color.whiteRecColor,
                });
            } catch (error) {
                console.error('Error while sharing the file: ', error);
                Snackbar.show({
                    text: 'Failed to share report!',
                    duration: Snackbar.LENGTH_LONG,
                    backgroundColor: Color.whiteRecColor,
                    textColor: Color.redRecColor,
                });
            } finally{
                console.log("excel execution block executed !")
            }
        }
    }

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
                                        onPress={() =>{ setInOut(0);setUseExcelItems([]);setUsrType("");}}
                                        uncheckedIcon="circle-o"
                                        containerStyle={{ backgroundColor: 'transparent' }}
                                    />
                                    <CheckBox
                                        title={'EXCEL'}
                                        checkedIcon="dot-circle-o"
                                        checked={inout === 1}
                                        onPress={() =>{ setInOut(1);setUseExcelItems([]);setUsrType("");}}
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
                                <View style={{ marginHorizontal: 10, flexDirection: 'row', alignItems: 'center' }}>
                                    <TouchableOpacity onPress={handleExport} style={{
                                        backgroundColor: Color.blueRecColor,
                                        padding: 8, borderRadius: 5,
                                        flexDirection: 'row', alignItems: 'center', marginHorizontal: 2
                                    }}>
                                        <Text style={{ marginRight: 5,color:Color.blackRecColor,fontWeight:'bold' }}>Download Report</Text>
                                        <IconSet color={Color.blackRecColor} name="cloud-download-outline" size={20} />
                                    </TouchableOpacity>
                                </View>
                                {useExcelItems.length !== 0 &&
                                    <>
                                        <View style={styles.flatcontainer}>
                                            <View style={{
                                                marginVertical: 5,
                                                flexDirection: 'row',
                                                justifyContent: 'flex-start',
                                                alignItems: 'center'
                                            }}>
                                                <Text style={styles.flatheader}>
                                                    Share Reports
                                                </Text>
                                                <IconSet
                                                    onPress={handleShareItems}
                                                    name="share-outline"
                                                    size={30}
                                                    color={Color.newBlueColor}
                                                >
                                                </IconSet>
                                            </View>
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
                    <Overlay isVisible={isLoaderTrue} statusBarTranslucent={true} overlayStyle={{ backgroundColor: 'white', borderRadius: 20 }}>
                        <ActivityIndicator style={{ backfaceVisibility: 'hidden' }} size={60} color={Color.blueRecColor}></ActivityIndicator>
                    </Overlay>
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
        borderBottomColor: Color.blackRecColor,
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
        borderBottomColor: Color.blackRecColor,
        borderBottomWidth: 1.5,
        marginHorizontal: 12,
        backgroundColor: Color.lightNewGrey,
        borderTopRightRadius: 11,
        borderTopLeftRadius: 11,
        marginBottom: Dimensions.get('window').width > 756 ? 5 : 8
    },
    icon: {
        marginRight: 5,
    },
    placeholderStyle: {
        paddingHorizontal: 10,
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
        fontSize: 20,
        fontWeight: 'bold',
        color: Color.newBlueColor,
        paddingRight: 10
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
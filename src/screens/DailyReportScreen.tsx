import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { View, Text, TextInput, Platform, Pressable, StatusBar, Image, BackHandler, TouchableOpacity, Alert, Modal, StyleSheet, Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { BarChart, PieChart } from 'react-native-gifted-charts';
import RNFetchBlob from 'rn-fetch-blob';
import { ActivityIndicator, ProgressBar } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { css, datepickerCSS } from '../theme/CSS';
import HeaderBar from '../components/HeaderBar';
import { COLORS } from '../theme/theme';
import LoadingAnimation from '../components/LoadingAnimation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Snackbar from 'react-native-snackbar';

const DailyReportPageScreen = ({ navigation }: { navigation: any }) => {
    const [todayDate, setTodayDate] = useState<string | "">(new Date().toISOString());
    const [data, setData] = useState<any[]>([]);
    const [DSBarData, setDSBarData] = useState<any[]>([]);
    const [processData, setProcessData] = useState(false);
    const [isready, setisready] = useState(false);

    // DatePicker
    const [showPicker, setShowPicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString());
    const [selectedIOSDate, setSelectedIOSDate] = useState(new Date());

    // IOS Date picker modal setup
    const [datePickerVisible, setDatePickerVisible] = useState(false);
    const hideIOSDatePicker = () => {
        setDatePickerVisible(false);
    };

    useEffect(()=> {
        (async()=> {
            await fetchedDataAPI(todayDate);
            setisready(true);
        })();
    }, []);
    
    const fetchedDataAPI = async(Datenow: string) => {
        setProcessData(true);
        setisready(false);
        setData([]);
        setDSBarData([]);
        const IPaddress = await AsyncStorage.getItem('IPAddress') ?? "";
        try {
            const res = await RNFetchBlob.config({ trusty: true })
            .fetch("POST", "https://"+IPaddress+"/Admin/DailySales", {
                "Content-Type": "application/json"
            }, JSON.stringify({ 
                "Date": Datenow 
            }));

            const responseData = await res.json();
            setData(responseData);
            // const barDataArray: BarData[] = Object.keys(responseData).map((key, index) => ({
            //     label: key.replace('total', 'Day ') + ' Sales',
            //     value: responseData[key],
            //     textFontSize: 16 // Set the font size as needed
            // }));

            // setDSBarData(barDataArray);

            setProcessData(false);   
            
        }catch (error: any) {
            setProcessData(false);
            Snackbar.show({
                text: error.message,
                duration: Snackbar.LENGTH_SHORT,
            });
        }
    };

    const GetRemainBarChart = () => {
        const dayKeys = Object.keys(data).filter(key => key.startsWith("totalDay"));
        const filtereddays = dayKeys.map((key: any) => data[key]);

        filtereddays.map((arr1) => {
            // const Day = arr1.getDate.split(' ')[0];
            // const Val = parseFloat(arr1.totalActive) / 1000;

            // console.log(Day)
            // console.log(Val)

            // const barData = {
            //     value: Math.abs(Val),
            //     label: (Day.split('-')[2]),
            //     spacing: 25,
            //     frontColor: '#357AF6',
            //     topLabelComponent: () => (
            //         <TouchableOpacity onPress={() => { navigation.navigate('StockDetail' as never, { DateToday: arr1.getDate, type: "Active" }) }}>
            //             <View style={{ width: 30, height: 30, left: 0 }}>
            //                 <Text style={{ color: 'black', fontSize: 6, textAlign: "center" }} >{(Val).toFixed(2)} MT</Text>
            //             </View>
            //         </TouchableOpacity>
            //     ),
            //     onPress: () => { navigation.navigate('StockDetail' as never, { DateToday: arr1.getDate, type: "Active" }) },
            // }

            // setDSBarData((prev) => [barData, ...prev])
        })
    }

    const onChangeDate = async ({ type }: any, selectedDate: any) => {
        setShowPicker(false);
        if (type == "set") {
            const currentDate = selectedDate.toISOString().split('T')[0];
            setSelectedIOSDate(selectedDate);
            if (Platform.OS === "android") {
                setSelectedDate(currentDate);
                setTodayDate(currentDate);
                await fetchedDataAPI(selectedDate);
                setisready(true);
            }
        }
    }

    const confirmIOSDate = async (date: any) => {
        const currentDate = date;

        setSelectedIOSDate(date);
        setTodayDate(currentDate.toISOString().split('T')[0]);
        setSelectedDate(currentDate.toISOString().split('T')[0]);
        setDatePickerVisible(false);
        await fetchedDataAPI(currentDate.toISOString());
        setisready(true);
    }

    const tonggleDatePicker = () => {
        if (Platform.OS === 'android') {
            setShowPicker(!showPicker);
        }
        else if (Platform.OS === 'ios') {
            setDatePickerVisible(true);
        }
    }

    useEffect(() => {
        if (isready == true) {
            GetRemainBarChart();
        }
    }, [isready]);

    return (
        <View style={css.ScreenContainer}>
            <StatusBar backgroundColor={COLORS.secondaryLightGreyHex} />
            <HeaderBar title="Daily Report" checkBackBttn={true} />
            <View style={css.LineContainer}></View>

            {processData==true ? (
                <View style={{alignSelf:"center",}}>
                    <LoadingAnimation />
                </View>
            ) : (
                <View style={{flex: 1}}>    
                    <View style={{ alignItems: "center", flex: 0.05 }}>
                        {showPicker && Platform.OS === 'android' && <DateTimePicker
                            mode="date"
                            display="calendar"
                            value={selectedIOSDate}
                            onChange={onChangeDate}
                            style={datepickerCSS.datePicker}
                        />}
                        <Pressable style={datepickerCSS.pressableCSS} onPress={tonggleDatePicker} >
                            <TextInput
                                style={datepickerCSS.textInput}
                                placeholder="Select Date"
                                value={selectedDate.toString().substring(0, 10)}
                                onChangeText={setTodayDate}
                                editable={false}
                                onPressIn={tonggleDatePicker}
                            />
                        </Pressable>
                    </View>

                    {
                        Platform.OS === "ios" && (<DateTimePickerModal
                            date={selectedIOSDate}
                            isVisible={datePickerVisible}
                            mode="date"
                            display='inline'
                            onConfirm={confirmIOSDate}
                            onCancel={hideIOSDatePicker}
                        />)
                    }

                    <View style={{ alignItems: "center", flex: 0.5, marginTop: 15, borderWidth: 1 }}>
                        <BarChart
                            width={200}
                            height={200}
                            xAxisLabelTextStyle={{ color: "black", bottom: 20, right: 5, width: 30 }}
                            yAxisTextStyle={{ color: "black", fontSize: 8 }}
                            yAxisLabelWidth={20}
                            xAxisTextNumberOfLines={2}
                            initialSpacing={10}
                            stackData={DSBarData}
                            hideRules
                            noOfSections={3}
                            barWidth={8}
                            spacing={25}
                            formatYLabel={(label) => {
                                const labelVal = Number(label);
                                // if (labelVal >= 1000000) return (labelVal / 1000000).toFixed(0) + 'M';
                                // if (labelVal >= 1000) return (labelVal / 1000).toFixed(0) + 'K';
                                return label;
                            }}
                        />
                    </View>
                </View>
            )}
        </View>
    )
}

export default DailyReportPageScreen;
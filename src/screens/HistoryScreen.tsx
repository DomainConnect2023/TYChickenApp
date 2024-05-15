import * as React from 'react';
import { useEffect, useState } from 'react';
import { View, StatusBar, Text, FlatList, TouchableOpacity, RefreshControl } from "react-native";
import Snackbar from 'react-native-snackbar';
import HeaderBar from '../components/HeaderBar';
import { COLORS, SPACING } from '../theme/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { css } from '../theme/CSS';
import { useFocusEffect } from '@react-navigation/native';
import { createTable, db } from '../data/SQLiteFile';
import DeliveryStatusAnimation from '../components/DeliveryStatusContainer';
import { HistoryData } from '../data/ChickenData';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import EmptyListAnimation from '../components/EmptyListAnimation';
import { HistoryCardProps } from '../components/Objects';
import HistoryCard from '../components/HistoryCard';
import LoadingAnimation from '../components/LoadingAnimation';

const HistoryPageScreen = ({navigation}: {navigation:any}) => {
    const [processData, setProcessData] = useState(false);
    const tabBarHeight = useBottomTabBarHeight();
    const [userID, setUserID] = useState('');
    const [showNoItemImg, setShowNoItemImg] = useState(false);
    const [countItem, setCountItem] = useState<number>(0);
    const [refreshing, setRefreshing] = useState(false);

    const [todayDate, setTodayDate] = useState(new Date().toISOString().split('T')[0]);
    const [limitedDate, setLimitedDate] = 
    useState(new Date(new Date().setDate(new Date().getDate()-1)).toISOString().split('T')[0]);

    const [fetchedData, setFetchedData] = useState<HistoryCardProps[]>([]);

    useEffect(()=> {
        (async()=> {
            await createTable();
            await checkCartNum();
            await fetchedDataAPI(HistoryData);
        })();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            createTable();
            checkCartNum();
        }, [])
    );
    
    const checkCartNum = async () => {
        try {
            let sql = "SELECT * FROM Carts GROUP BY id";
            db.transaction((tx) => {
                tx.executeSql(sql, [], async (tx, resultSet) => {
                    var length = resultSet.rows.length;
                    setCountItem(length);
                }, (error) => {
                    console.log("Error", error);
                })
            });
        }catch (error: any) {
            Snackbar.show({
                text: error.message,
                duration: Snackbar.LENGTH_SHORT,
            });
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        setProcessData(true);
        setTimeout(() => {
            setProcessData(false);
        }, 1000);
        setRefreshing(false);
    };

    const fetchedDataAPI = async(newData: { itemList: HistoryCardProps[] }) => {
        setProcessData(true);
        setUserID(await AsyncStorage.getItem('UserID') ?? "");
        setFetchedData([]);
        try {
            const { itemList } = newData;

            if(itemList.length == 0){
                setShowNoItemImg(true);
            }else{
                setShowNoItemImg(false);
                setFetchedData(itemList);
            }
        }catch (error: any) {
            Snackbar.show({
                text: error.message,
                duration: Snackbar.LENGTH_SHORT,
            });
        }
        setProcessData(false);
    };

    const showHistoryCard = ({ item }: { item: HistoryCardProps }) => {
        return (
            <TouchableOpacity onPress={() => {
                if(item.id == "1" || item.id == "2"){
                // if(item.date >= limitedDate){
                    navigation.navigate('HistoryReturn', {
                        id: item.id, 
                        DOnumber: item.DOnumber, 
                        customerName: item.customerName, 
                        date: item.date, 
                        totalWeight: item.totalWeight, 
                        totalPrice: item.totalPrice, 
                        currency: item.currency, 
                        status: item.status, 
                    });
                }else{
                    Snackbar.show({
                        text: "Only can choose today or yesterday.",
                        duration: Snackbar.LENGTH_SHORT,
                    });
                }
            }} >
                <HistoryCard 
                    id={item.id}
                    date={item.date}
                    DOnumber={item.DOnumber}
                    customerName={item.customerName}
                    currency={item.currency}
                    totalPrice={item.totalPrice}
                    totalWeight={item.totalWeight}
                    status={item.status}
                />
            </TouchableOpacity>
        );
    };

    return (
        <View style={css.ScreenContainer}>
            <StatusBar backgroundColor={COLORS.secondaryLightGreyHex} />
            {processData==true ? (
                <View style={{alignSelf:"center",}}>
                    <LoadingAnimation />
                </View>
            ) : (
            <View style={{flex: 1}}>
                {userID == "admin" ? (
                    <></>
                ) : (
                    <HeaderBar title="Order Status" badgeNumber={countItem} />
                )}
                <View style={css.LineContainer}></View>

                <Text style={[css.TextDeliveryStatus,{marginBottom: -SPACING.space_20,}]}> 
                    Delivery Status: 
                </Text>

                <DeliveryStatusAnimation process={"Pending"} />
                <View style={css.LineContainer}></View>
                
                <View style={{flex: 1}}>
                    <Text style={css.TextDeliveryStatus}> 
                        Previous Record: 
                    </Text>

                    {( showNoItemImg == false ) ? (
                        <FlatList
                            data={fetchedData}
                            renderItem={showHistoryCard}
                            keyExtractor={(item) => item.id}
                            removeClippedSubviews={false}
                            style={{marginBottom: tabBarHeight}}
                            refreshControl={<RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                            />}
                        />
                    ) : (
                        <View style={{alignSelf:"center",}}>
                            <EmptyListAnimation title={'Ops. No Record here.'} />
                        </View>
                    )}
                </View>
            </View>
            )}
        </View>
    );
}

export default HistoryPageScreen;
import * as React from 'react';
import { useEffect, useState } from 'react';
import { View, StatusBar, StyleSheet, Text, FlatList, TouchableOpacity } from "react-native";
import Snackbar from 'react-native-snackbar';
import { COLORS, FONTFAMILY, FONTSIZE } from '../theme/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { css } from '../theme/CSS';
import { useFocusEffect } from '@react-navigation/native';
import { createTable, db } from '../data/SQLiteFile';
import { HistoryData } from '../data/ChickenData';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { ActivityIndicator } from 'react-native-paper';
import EmptyListAnimation from '../components/EmptyListAnimation';
import HeaderDriverBar from '../components/HeaderDriverBar';
import { HistoryCardProps, currencyFormat } from '../components/Objects';
import DeliveryCard from '../components/DeliveryCard';

const HomeDriverScreen = ({navigation}: {navigation:any}) => {
    const [processData, setProcessData] = useState(false);
    const [showAnimation, setShowAnimation] = useState(false);
    const tabBarHeight = useBottomTabBarHeight();
    const [userID, setUserID] = useState('');
    const [showNoItemImg, setShowNoItemImg] = useState(false);
    const [countItem, setCountItem] = useState<number>(0);

    const [fetchedData, setFetchedData] = useState<HistoryCardProps[]>([]);

    useEffect(()=> {
        (async()=> {
            await createTable();
            await checkCartNum();
            await fetchedDataAPI(HistoryData);
            // console.log(userID);
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
              navigation.navigate('DoneDelivery');
            }} >
                <DeliveryCard 
                    id={item.id}
                    date={item.date}
                    DOnumber={item.DOnumber}
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
            {userID == "admin" ? (
                <></>
            ) : (
                <HeaderDriverBar title="Journay Today" />
            )}
            <View style={css.LineContainer}></View>

            {processData==true ? (
                <View style={{justifyContent: 'center', alignItems: 'center', marginVertical: 10, padding: 20,}}>
                    <ActivityIndicator size="large" />
                </View>
            ) : (
            <View style={{flex: 1, marginBottom: tabBarHeight}}>
                <Text style={[css.TextDeliveryStatus]}> 
                    Today Goods: 
                </Text>

                {( showNoItemImg == false ) ? (
                    <View style={{flex: 1}}>
                        <FlatList
                          data={fetchedData}
                          renderItem={showHistoryCard}
                          keyExtractor={(item) => item.id}
                          removeClippedSubviews={false}
                        />
                    </View>
                ) : (
                    <View style={{alignSelf:"center",}}>
                        <EmptyListAnimation title={'Ops. No Record here.'} />
                    </View>
                )}
            </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    CardTitle: {
        fontFamily: FONTFAMILY.poppins_medium,
        color: COLORS.primaryGreyHex,
        fontSize: FONTSIZE.size_20,
        fontWeight: "bold",
    },
    CardDate: {
        fontFamily: FONTFAMILY.poppins_regular,
        color: COLORS.primaryLightGreyHex,
        fontSize: FONTSIZE.size_12,
    },
    CardSubtitle: {
        fontFamily: FONTFAMILY.poppins_light,
        color: COLORS.primaryLightGreyHex,
        fontSize: FONTSIZE.size_12,
    },
    CardTextHightlight: {
        color: COLORS.primaryRedHex,
    },
});

export default HomeDriverScreen;
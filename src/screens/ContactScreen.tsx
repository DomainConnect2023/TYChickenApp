import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { View, ScrollView, StatusBar, TouchableOpacity } from "react-native";
import Snackbar from 'react-native-snackbar';
import HeaderBar from '../components/HeaderBar';
import { COLORS, FONTSIZE } from '../theme/theme';
import { HistoryCardProps } from '../components/ChickenCard';
import Icon from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { css } from '../theme/CSS';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { ActivityIndicator } from 'react-native-paper';
import { createTable, db } from '../data/SQLiteFile';
import { useFocusEffect } from '@react-navigation/native';
import LottieView from 'lottie-react-native';

const ContactPageScreen = ({navigation}: {navigation:any}) => {
    const tabBarHeight = useBottomTabBarHeight();
    const [processData, setProcessData] = useState(false);
    const [userID, setUserID] = useState('');
    const [countItem, setCountItem] = useState<number>(0);
    const [fetchedData, setFetchedData] = useState<HistoryCardProps[]>([]);
      
    useEffect(()=> {
        (async()=> {
            await createTable();
            await checkCartNum();
            await fetchedDataAPI();
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

    const fetchedDataAPI = async() => {
        setProcessData(true);
        setFetchedData([]);
        setUserID(await AsyncStorage.getItem('UserID') ?? "");
        try {
            
        }catch (error: any) {
            Snackbar.show({
                text: error.message,
                duration: Snackbar.LENGTH_SHORT,
            });
        }
        setProcessData(false);
    };

    return (
        <View style={css.ScreenContainer}>
            <StatusBar backgroundColor={COLORS.secondaryLightGreyHex} />

            {processData==true ? (
            <View style={{justifyContent: 'center', alignItems: 'center', marginVertical: 10, padding: 20,}}>
                <ActivityIndicator size="large" />
            </View>
            ): (
            <View style={{flex: 1, marginBottom: tabBarHeight}}>
                {userID == "admin" ? (
                    <></>
                ) : (
                    <HeaderBar title="Contact Us" badgeNumber={countItem} />
                )}

                <View style={css.ContactContainer}>
                    <TouchableOpacity onPress={()=>{
                        navigation.navigate('ContactAdd');
                    }}>
                        <View style={css.ContactIconButton}>
                            <Icon name={"send" ?? ""} size={FONTSIZE.size_20} color={COLORS.primaryWhiteHex} />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
            )}
        </View>
    );
}

export default ContactPageScreen;
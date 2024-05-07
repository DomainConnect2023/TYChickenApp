import * as React from 'react';
import { useEffect, useState } from 'react';
import { View, Alert, ScrollView, StatusBar, StyleSheet } from "react-native";
import Snackbar from 'react-native-snackbar';
import HeaderBar from '../components/HeaderBar';
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme';
import { HistoryCardProps } from '../components/ChickenCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { css } from '../theme/CSS';

const HistoryPageScreen = ({navigation}: {navigation:any}) => {
    const [processData, setProcessData] = useState(false);
    const [userID, setUserID] = useState('');
    const [fetchedData, setFetchedData] = useState<HistoryCardProps[]>([]);

    useEffect(()=> {
        (async()=> {
            await fetchedDataAPI();
            // console.log(userID);
        })();
    }, []);

    const fetchedDataAPI = async() => {
        setProcessData(true);
        setUserID(await AsyncStorage.getItem('UserID') ?? "");
        setFetchedData([]);
        try {
            
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
            <View></View>
        );
    };

    return (
        <View style={css.ScreenContainer}>
            <StatusBar backgroundColor={COLORS.secondaryLightGreyHex} />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={css.ScrollViewFlex}>
                {userID == "admin" ? (
                    <></>
                ) : (
                    <HeaderBar title="Order Status" />
                )}
            </ScrollView>
        </View>
    );
}

export default HistoryPageScreen;
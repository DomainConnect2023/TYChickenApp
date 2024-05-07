import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { View, ScrollView, StatusBar, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import Snackbar from 'react-native-snackbar';
import HeaderBar from '../components/HeaderBar';
import { COLORS, FONTSIZE } from '../theme/theme';
import { HistoryCardProps } from '../components/ChickenCard';
import Icon from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { css } from '../theme/CSS';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

const ContactPageScreen = ({navigation}: {navigation:any}) => {
    const tabBarHeight = useBottomTabBarHeight();
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
            <View style={{marginBottom: tabBarHeight}}>
                {userID == "admin" ? (
                    <></>
                ) : (
                    <HeaderBar title="Contact Us" />
                )}
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={css.ScrollViewFlex}>

                    <TouchableOpacity onPress={()=>{
                        Snackbar.show({
                            text: "Pop up to send message",
                            duration: Snackbar.LENGTH_SHORT,
                        });
                    }}>
                        <View style={css.ContactIconButton}>
                            <Icon name={"send" ?? ""} size={FONTSIZE.size_20} color={COLORS.primaryWhiteHex} />
                        </View>
                    </TouchableOpacity>
                </ScrollView>
            </View>
            )}
        </View>
    );
}

export default ContactPageScreen;
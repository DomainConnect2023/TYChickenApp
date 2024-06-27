import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StatusBar, Image, Dimensions, FlatList, ActivityIndicator } from 'react-native';
import { TextInput, Searchbar, ListItemProps } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { css } from '../theme/CSS';
import { BORDERRADIUS, COLORS, FONTSIZE, SPACING } from '../theme/theme';
import HeaderBar from '../components/HeaderBar';
import LoadingAnimation from '../components/LoadingAnimation';


const AccessListScreen = ({navigation}: {navigation:any}) => {
    const [processData, setProcessData] = useState(false);
    const [userID, setUserID] = useState('');

    const list = [
        {
            id: 1,
            title: "Debtor List",
            navigate: ""
        },
        {
            id: 2,
            title: "Admin List",
            navigate: ""
        },
    ];

    useEffect(()=> {
        (async()=> {
            await fetchedDataAPI();
            // console.log(userID);
        })();
    }, []);

    const fetchedDataAPI = async() => {
        setProcessData(true);
        setUserID(await AsyncStorage.getItem('UserID') ?? "");
        setProcessData(false);
    };

    return (
        <View style={css.ScreenContainer}>
            <StatusBar backgroundColor={COLORS.secondaryLightGreyHex} />
            <HeaderBar title="General Report" checkBackBttn={true} />
            <View style={css.LineContainer}></View>

            {processData==true ? (
                <View style={{alignSelf:"center",}}>
                    <LoadingAnimation />
                </View>
            ) : (
                <View style={{flex: 1}}>    
                    <FlatList
                        data={list}
                        renderItem={({ item }) => (
                            <TouchableOpacity 
                            style={{ backgroundColor: "#ECE6F0", width: "95%", height: SPACING.space_50, margin: SPACING.space_5, borderRadius: BORDERRADIUS.radius_20 }} 
                            onPress={() => { 
                                // navigation.navigate(item.navigate);
                            }}>
                                <Text style={{ fontSize: FONTSIZE.size_16, fontWeight: "bold", color: COLORS.primaryGreyHex, padding: SPACING.space_12 }}>{item.title}</Text>
                            </TouchableOpacity>)}
                        keyExtractor={(item) => item.id.toString()}
                    />
                </View>
            )}
        </View>
    )
}

export default AccessListScreen;
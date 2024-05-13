import * as React from 'react';
import { useEffect, useState } from 'react';
import { View, StatusBar, StyleSheet, Text, FlatList, TouchableOpacity } from "react-native";
import Snackbar from 'react-native-snackbar';
import { COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { css } from '../theme/CSS';
import { HistoryData } from '../data/ChickenData';
import { ActivityIndicator } from 'react-native-paper';
import EmptyListAnimation from '../components/EmptyListAnimation';
import HeaderDriverBar from '../components/HeaderDriverBar';
import { HistoryCardProps } from '../components/Objects';
import DeliveryCard from '../components/DeliveryCard';
import Icon from 'react-native-vector-icons/Ionicons';

const DeliveryPageScreen = ({navigation}: {navigation:any}) => {
    const [processData, setProcessData] = useState(false);
    const [showAnimation, setShowAnimation] = useState(false);
    const [userID, setUserID] = useState('');
    const [showNoItemImg, setShowNoItemImg] = useState(false);
    const [itemFinish, setItemFinish] = useState(false);

    const [fetchedData, setFetchedData] = useState<HistoryCardProps[]>([]);

    useEffect(()=> {
        (async()=> {
            await fetchedDataAPI(HistoryData);
        })();
    }, []);

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
                setItemFinish(true);
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
              navigation.navigate('DeliveryDetail');
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
            <HeaderDriverBar title="Delivery Part" checkBackBttn={true} />
            <View style={css.LineContainer}></View>

            {processData==true ? (
                <View style={{justifyContent: 'center', alignItems: 'center', marginVertical: 10, padding: 20,}}>
                    <ActivityIndicator size="large" />
                </View>
            ) : (
            <View style={{flex: 1}}>
                <View style={{flexDirection: "row", 
                justifyContent: "space-between", 
                padding: SPACING.space_5,}}>
                    <Text style={css.TextDeliveryStatus}>Today Goods: </Text>
                    <TouchableOpacity onPress={() => {
                        navigation.navigate('SearchDO');      
                    }} >
                        <Icon
                            style={[css.InputIcon, ]}
                            name="search"
                            size={FONTSIZE.size_24}
                            color={
                                COLORS.primaryLightGreyHex
                            }
                        />
                    </TouchableOpacity>
                </View>

                {( showNoItemImg == false ) ? (
                    <View style={{flex: 1}}>
                        <FlatList
                            data={fetchedData}
                            renderItem={showHistoryCard}
                            keyExtractor={(item) => item.id}
                            removeClippedSubviews={false}
                            ListFooterComponent={() => itemFinish && (
                                <TouchableOpacity onPress={() => {
                                    
                                }} >
                                    <View style={css.HistoryCardContainer}>
                                        <View style={css.HistoryTitleContainer}>
                                            <Text style={[styles.CardTitle, {color: COLORS.secondaryLightGreyHex}]}>Show Previous Data {">>>"}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )}
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

export default DeliveryPageScreen;
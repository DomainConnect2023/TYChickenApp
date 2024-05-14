import * as React from 'react';
import { useEffect, useState } from 'react';
import { View, StatusBar, StyleSheet, Text, FlatList, TouchableOpacity, ScrollView, Animated, RefreshControl, TextInput, Dimensions } from "react-native";
import Snackbar from 'react-native-snackbar';
import { COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HIDE_HEIGHT, css } from '../theme/CSS';
import { HistoryData } from '../data/ChickenData';
import { ActivityIndicator } from 'react-native-paper';
import EmptyListAnimation from '../components/EmptyListAnimation';
import HeaderDriverBar from '../components/HeaderDriverBar';
import { HistoryCardProps } from '../components/Objects';
import DeliveryCard from '../components/DeliveryCard';
import Icon from 'react-native-vector-icons/Ionicons';
import LoadingAnimation from '../components/LoadingAnimation';

const DeliveryPageScreen = ({navigation}: {navigation:any}) => {
    const [processData, setProcessData] = useState(false);
    const [showAnimation, setShowAnimation] = useState(false);
    const [userID, setUserID] = useState('');
    const [showNoItemImg, setShowNoItemImg] = useState(false);
    const [itemFinish, setItemFinish] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [searchText, setSearchText] = useState('');

    const [scrollY] = useState(new Animated.Value(0));
    const [showHeader, setShowHeader] = useState(true);

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

    const handleScroll = Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        {
            useNativeDriver: false,
            listener: (event: any) => {
                const offsetY = event.nativeEvent.contentOffset.y;
                if (offsetY > HIDE_HEIGHT) {
                    setShowHeader(false);
                } else {
                    setShowHeader(true);
                }
            }
        }
    );

    const onRefresh = async () => {
        setRefreshing(true);
        setProcessData(true);
        setTimeout(() => {
            setProcessData(false);
        }, 1000);
        setRefreshing(false);
    };

    const showHistoryCard = ({ item }: { item: HistoryCardProps }) => {
        return (
            <TouchableOpacity onPress={() => {
                navigation.navigate('DeliveryDetail', {
                    id: item.id, 
                    DOnumber: item.DOnumber, 
                    customerName: item.customerName, 
                    date: item.date, 
                    totalWeight: item.totalWeight, 
                    totalPrice: item.totalPrice, 
                    currency: item.currency, 
                    status: item.status, 
                });
            }} >
                <DeliveryCard 
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
                <HeaderDriverBar title="Today Delivery" checkBackBttn={true} />
                <View style={css.LineContainer}></View>
                
                {showHeader && (                     
                    <View style={[css.InputContainerComponent, {backgroundColor: COLORS.secondaryVeryLightGreyHex, borderWidth: 1, marginTop: -SPACING.space_5, marginBottom: 0}]}>
                        <TouchableOpacity
                            onPress={async () => {
                                // setSearchText(textValue);
                                await fetchedDataAPI(HistoryData);
                            }}>
                            <Icon
                            style={css.InputIcon}
                            name="search"
                            size={FONTSIZE.size_18}
                            color={
                                searchText.length > 0
                                ? COLORS.primaryOrangeHex
                                : COLORS.primaryLightGreyHex
                            }
                            />
                        </TouchableOpacity>
                        <TextInput
                            placeholder="Search DO...."
                            value={searchText}
                            onChangeText={async text => {
                                setSearchText(text);
                            }}
                            placeholderTextColor={COLORS.primaryLightGreyHex}
                            style={[css.TextInputContainer, {height: SPACING.space_20 * 2,}]}
                            onEndEditing={async () => {
                                fetchedDataAPI(HistoryData);
                            }}
                        />
                        {searchText.length > 0 ? (
                            <TouchableOpacity
                            onPress={async () => {
                                setSearchText("");
                                fetchedDataAPI(HistoryData);
                            }}>
                            <Icon
                                style={css.InputIcon}
                                name="close"
                                size={FONTSIZE.size_16}
                                color={COLORS.primaryLightGreyHex}
                            />
                            </TouchableOpacity>
                        ) : (
                            <></>
                        )}
                    </View>
                )}

                {( showNoItemImg == false ) ? (
                    <View style={{flex: 1}}>
                        <FlatList
                            data={fetchedData}
                            renderItem={showHistoryCard}
                            keyExtractor={(item) => item.id}
                            onScroll={handleScroll}
                            removeClippedSubviews={false}
                            refreshControl={<RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                            />}
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
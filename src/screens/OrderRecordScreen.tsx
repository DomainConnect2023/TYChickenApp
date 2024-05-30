import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { View, ScrollView, StatusBar, TouchableOpacity, Animated, TextInput, FlatList, RefreshControl, Text, StyleSheet } from "react-native";
import Snackbar from 'react-native-snackbar';
import HeaderBar from '../components/HeaderBar';
import { COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HIDE_HEIGHT, css } from '../theme/CSS';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { ActivityIndicator } from 'react-native-paper';
import { createTable, db } from '../data/SQLiteFile';
import { useFocusEffect } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import { HistoryCardProps } from '../components/Objects';
import LoadingAnimation from '../components/LoadingAnimation';
import EmptyListAnimation from '../components/EmptyListAnimation';
import DeliveryCard from '../components/DeliveryCard';
import { HistoryData } from '../data/ChickenData';

const OrderRecordPageScreen = ({navigation}: {navigation:any}) => {
    const tabBarHeight = useBottomTabBarHeight();
    const [processData, setProcessData] = useState(false);
    const [userID, setUserID] = useState('');
    const [showNoItemImg, setShowNoItemImg] = useState(false);
    const [itemFinish, setItemFinish] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [countItem, setCountItem] = useState<number>(0);
    const [fetchedData, setFetchedData] = useState<HistoryCardProps[]>([]);

    const [scrollY] = useState(new Animated.Value(0));
    const [showHeader, setShowHeader] = useState(true);
      
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
        setFetchedData([]);
        setUserID(await AsyncStorage.getItem('UserID') ?? "");
        try {
            setShowNoItemImg(true);
            // const { itemList } = newData;

            // if(itemList.length == 0){
            //     setShowNoItemImg(true);
            // }else{
            //     setShowNoItemImg(false);
            //     setFetchedData(itemList);
            //     setItemFinish(true);
            // }
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
            ): (
            <View style={{flex: 1, marginBottom: tabBarHeight}}>
                {userID == "admin" ? (
                    <></>
                ) : (
                    <HeaderBar title="Order History" badgeNumber={countItem} />
                )}
                <View style={css.LineContainer}></View>

                {( showNoItemImg == false ) ? (
                    <View style={{flex: 1}}>
                        {showHeader && (                     
                            <View style={[css.InputContainerComponent, {backgroundColor: COLORS.secondaryVeryLightGreyHex, borderWidth: 1, marginTop: -SPACING.space_5, marginBottom: 0}]}>
                                <TouchableOpacity
                                    onPress={async () => {
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
                                    placeholder="Search Order...."
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
                                    <View style={css.HistoryCardContainer}>
                                        <View style={css.HistoryTitleContainer}>
                                            <Text style={[styles.CardTitle, {color: COLORS.secondaryLightGreyHex, fontSize: FONTSIZE.size_16}]}>No More Data</Text>
                                        </View>
                                    </View>
                                )}
                            />
                        </View>
                    </View>
                ) : (
                    <View style={{alignSelf:"center",}}>
                        <EmptyListAnimation title={'Cluck!!! Take Order Now!!'} />
                    </View>
                )}

                <View style={css.ContactContainer}>
                    <View style={css.ContactIconButton}>
                    <TouchableOpacity 
                        onPress={() => {
                            Snackbar.show({
                                text: "Link to Whatsapp or other functions",
                                duration: Snackbar.LENGTH_SHORT,
                            });
                        }} >
                            <Icon name={"send" ?? ""} size={FONTSIZE.size_20} color={COLORS.primaryWhiteHex} />
                        </TouchableOpacity>
                    </View>
                </View>
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

export default OrderRecordPageScreen;
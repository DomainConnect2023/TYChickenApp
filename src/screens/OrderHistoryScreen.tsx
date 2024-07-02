import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { View, StatusBar, TouchableOpacity, Animated, TextInput, FlatList, RefreshControl, Text, StyleSheet, Linking, Dimensions, Image } from "react-native";
import Snackbar from 'react-native-snackbar';
import HeaderBar from '../components/HeaderBar';
import { COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HIDE_HEIGHT, css } from '../theme/CSS';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { createTable, db } from '../data/SQLiteFile';
import { useFocusEffect } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import { OrderHistoryCardProps, PendingListCardProps } from '../components/Objects';
import LoadingAnimation from '../components/LoadingAnimation';
import EmptyListAnimation from '../components/EmptyListAnimation';
import RNFetchBlob from 'rn-fetch-blob';
import OrderHistoryCard from '../components/OrderHistoryCard';

const OrderHistoryPageScreen = ({ navigation }: { navigation: any }) => {
    const [tabBarHeight, setTabBarHeight] = useState<number>(0);
    const [processData, setProcessData] = useState(false);
    const [userLabel, setUserLabel] = useState('');
    const [showNoItemImg, setShowNoItemImg] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [countItem, setCountItem] = useState<number>(0);
    const [itemIndex, setItemIndex] = useState<number>(0);
    const [fetchedData, setFetchedData] = useState<PendingListCardProps[]>([]);

    const [scrollY] = useState(new Animated.Value(0));
    const [showHeader, setShowHeader] = useState(true);

    // Pagination Part
    const [itemFinish, setItemFinish] = useState(false);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [itemPerPage, setItemPerPage] = useState<number>(10);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        (async () => {
            setProcessData(true);
            setFetchedData([]);
            await createTable();
            await checkCartNum();
            await fetchedDataAPI(currentPage);
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
        } catch (error: any) {
            Snackbar.show({
                text: error.message,
                duration: Snackbar.LENGTH_SHORT,
            });
        }
    };

    const fetchedDataAPI = async (page: number) => {

        const userCode = await AsyncStorage.getItem('UserID') ?? "";
        const IPaddress = await AsyncStorage.getItem('IPAddress') ?? "";
        const userLabel = await AsyncStorage.getItem('label') ?? "";

        setUserLabel(userLabel);

        if (await AsyncStorage.getItem('label') == "admin") {
            setTabBarHeight(0);
        } else {
            setTabBarHeight(65);
        }

        // setFetchedData([]);
        try {

            RNFetchBlob.config({ trusty: true })
                .fetch("GET", "https://"+IPaddress+"/api/GetHistory?page="+page+"&debtor="+userCode,
                    // .fetch("GET", "https://" + IPaddress + "/admin/GetPendingList?page=" + page,
                ).then(async (res) => {

                    const responseData = await res.json();
                    if (responseData.isSuccess == true) {
                        let formattedMessages;

                        if(userLabel=="admin"){
                            // Admin Part
                            formattedMessages = responseData.pendingList.map((item: any) => {
                                return {
                                    doRef: item.refNo,
                                    created_At: item.createDate.split('T')[0],
                                    debtor:item.debtor,
                                    area:item.area,
                                    currency:item.currency,
                                    vehicle:item.vehicle,
                                    isApprove:item.isApprove,
                                    debtorName:item.debtorName
                                };
                            });
                        }else{
                            // Customer Part
                            formattedMessages = responseData.doRef.map((item: any) => {
                                return {
                                    doRef: item.doRef,
                                    created_At: item.created_At.split('T')[0],
                                    isApprove: item.status
                                    // debtor:item.debtor,
                                    // area:item.area,
                                    // currency:item.currency,
                                    // vehicle:item.vehicle,
                                    // isApprove:item.isApprove,
                                    // debtorName:item.debtorName
                                };
                            });
                        }
                        
                        if(formattedMessages.length == 0){
                            if(page==0){
                                setShowNoItemImg(true);
                                setItemFinish(false);
                            }else{
                                setShowNoItemImg(false);
                                setItemFinish(true);
                            }
                            setProcessData(false);

                        }else{
                            setShowNoItemImg(false);
                            setFetchedData((prevData) => [...prevData, ...formattedMessages]);
                            // setFetchedData(formattedMessages);
                            setItemFinish(false);
                            setProcessData(false);

                        }
                    } else {
                        console.log("Something Error");
                        Snackbar.show({
                            text: "Something Error",
                            duration: Snackbar.LENGTH_SHORT,
                        });
                    }

                }).catch(err => {
                    Snackbar.show({
                        text: err.message,
                        duration: Snackbar.LENGTH_LONG
                    });
                })

            // setShowNoItemImg(true);

        } catch (error: any) {
            Snackbar.show({
                text: error.message,
                duration: Snackbar.LENGTH_SHORT,
            });
        }
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
        setFetchedData([]);
        setItemIndex(0);
        setCurrentPage(0);
        await fetchedDataAPI(0);
        setTimeout(() => {
            setProcessData(false);
        }, 1000);
        setRefreshing(false);
    };

    const loadMore = async () => {
        const passPage = currentPage + 1;
        setCurrentPage(passPage);
        await fetchedDataAPI(passPage);
    }

    const showHistoryCard = ({ item }: { item: PendingListCardProps }) => {
        return (
            <TouchableOpacity onPress={() => {
                // navigation.navigate('OrderHistoryDetail', {
                //     id: item.doRef, 
                //     createdDate: item.created_At, 
                // });
            }} >
                <OrderHistoryCard 
                    position={userLabel}
                    doRef={item.doRef} 
                    created_At={item.created_At} 
                    debtor={item.debtor} 
                    area={item.area} 
                    currency={item.currency} 
                    vehicle={item.vehicle} 
                    isApprove={item.isApprove} 
                    debtorName={item.debtorName}                    
                />
            </TouchableOpacity>
        );
    };

    return (
        <View style={css.ScreenContainer}>
            <StatusBar backgroundColor={COLORS.secondaryLightGreyHex} />

            {processData == true ? (
                <View style={{ alignSelf: "center", }}>
                    <LoadingAnimation />
                </View>
            ) : (
                <View style={{ flex: 1, marginBottom: tabBarHeight }}>
                    {userLabel == "admin" ? (
                        <HeaderBar title="Order History" checkBackBttn={true} />
                    ) : (
                        <HeaderBar title="Order History" badgeNumber={countItem} />
                    )}
                    <View style={css.LineContainer}></View>

                    {(showNoItemImg == false) ? (
                        <View style={{ flex: 1 }}>
                            {/* <View style={{
                            flex: 0.2,
                            alignSelf: "flex-start",
                            // alignSelf: "center",
                            flexDirection: "row",
                            width: Dimensions.get("screen").width*80/100,
                            // borderWidth: 1, 
                        }}>
                            <LottieView
                                style={{height: 100,width: 100,}}
                                source={require('../animationPart/CustomerService.json')}
                                autoPlay
                                loop
                            />
                            <Image 
                            source={require('../assets/chicken_assets/CustomerService.png')} 
                            // source={require('../assets/chicken_assets/logo2.png')} 
                            style={{ 
                                height: 100, 
                                width: 100, 
                                resizeMode: "contain", 
                                alignSelf: "flex-start",
                            }} />
                            <View style={{
                                flexDirection: "column",
                                padding: SPACING.space_5,
                                alignSelf: "center",
                                width: "70%",
                                // borderWidth: 1, 
                            }}>
                                <Text style={[{
                                    color: COLORS.secondaryGreyHex,
                                    // color: COLORS.primaryOrangeHex,
                                    fontSize: FONTSIZE.size_14,
                                    fontFamily: FONTFAMILY.poppins_light,
                                    fontWeight: "bold",
                                    textAlign: "left",
                                }]}>
                                    You may add on other PO before 9pm.
                                </Text>
                                <Text style={[{
                                    // color: COLORS.secondaryGreyHex,
                                    color: COLORS.primaryOrangeHex,
                                    fontSize: FONTSIZE.size_14,
                                    fontFamily: FONTFAMILY.poppins_light,
                                    fontWeight: "bold",
                                    textAlign: "left",
                                }]}>
                                    WhatsApp us if any questions about PO.
                                </Text>
                            </View>
                        </View> */}
                            <View style={{ flex: 1 }}>
                                {/* {showHeader && (
                                    <View style={[css.InputContainerComponent, { backgroundColor: COLORS.secondaryVeryLightGreyHex, borderWidth: 1, marginTop: -SPACING.space_5, marginBottom: 0 }]}>
                                        <TouchableOpacity
                                            onPress={async () => {
                                                await fetchedDataAPI(currentPage);
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
                                            style={[css.TextInputContainer, { height: SPACING.space_20 * 2, }]}
                                            onEndEditing={async () => {
                                                fetchedDataAPI(currentPage);
                                            }}
                                        />
                                        {searchText.length > 0 ? (
                                            <TouchableOpacity
                                                onPress={async () => {
                                                    setSearchText("");
                                                    fetchedDataAPI(currentPage);
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
                                )} */}
                                <View style={{ flex: 1 }}>
                                    <FlatList
                                        data={fetchedData}
                                        renderItem={showHistoryCard}
                                        keyExtractor={(item) => item.doRef}
                                        onScroll={handleScroll}
                                        removeClippedSubviews={false}
                                        onEndReached={loadMore}
                                        refreshControl={<RefreshControl
                                            refreshing={refreshing}
                                            onRefresh={onRefresh}
                                        />}
                                        ListFooterComponent={() => itemFinish && (
                                            <View style={css.HistoryCardContainer}>
                                                <View style={css.HistoryTitleContainer}>
                                                    <Text style={[styles.CardTitle, { color: COLORS.secondaryLightGreyHex, fontSize: FONTSIZE.size_16 }]}>No More Data</Text>
                                                </View>
                                            </View>
                                        )}
                                    />
                                </View>
                            </View>
                        </View>
                    ) : (
                        <View style={{ alignSelf: "center", }}>
                            <EmptyListAnimation title={'Cluck!!! Take Order Now!!'} />
                        </View>
                    )}

                    <View style={css.ContactContainer}>
                        <View style={css.ContactIconButton}>
                            <TouchableOpacity
                                onPress={async () => {
                                    await Linking.openURL('whatsapp://send?text=halo&phone=601110803983');
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
    CardStatus:{
        backgroundColor:COLORS.CardGoodStatusColorRGBA,
        width:100,
        height:100,
        justifyContent:"center",
        alignItems:"center"
    },
    CardStatusImage:{
        resizeMode:'contain',
        width:100,
        height:100
    }
});

export default OrderHistoryPageScreen;
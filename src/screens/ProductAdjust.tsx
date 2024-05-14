import * as React from 'react';
import { useEffect, useState } from 'react';
import { View, Text, Dimensions, FlatList, TouchableOpacity, Alert, StatusBar, StyleSheet, ImageBackground, Image, Pressable, ScrollView, TextInput, Animated, RefreshControl } from "react-native";
import Snackbar from 'react-native-snackbar';
import HeaderBar from '../components/HeaderBar';
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme';
import Icon from 'react-native-vector-icons/Ionicons';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChickenData3 } from '../data/ChickenData';
import { ActivityIndicator, Switch } from 'react-native-paper';
import { HIDE_HEIGHT, css } from '../theme/CSS';
import { useFocusEffect } from '@react-navigation/native';
import { addData, createTable, db, selectData, updateData } from '../data/SQLiteFile';
import EmptyListAnimation from '../components/EmptyListAnimation';
import PopUpAnimation from '../components/PopUpAnimation';
import { ChickenCardProps, currencyFormat } from '../components/Objects';
import LoadingAnimation from '../components/LoadingAnimation';

const CARD_WIDTH = Dimensions.get('window').width * 0.36;

const ProductAdjustPageScreen = ({navigation}: {navigation:any}) => {
    const [processData, setProcessData] = useState(false);
    const [userID, setUserID] = useState('');
    const [showNoItemImg, setShowNoItemImg] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [refreshing, setRefreshing] = useState(false);

    const [scrollY] = useState(new Animated.Value(0));
    const [showSearchInput, setShowSearchInput] = useState(true);

    const [fetchedData, setFetchedData] = useState<ChickenCardProps[]>([]);

    const [isDarkMode, setIsDarkMode] = useState(true);

    useEffect(()=> {
        (async()=> {
            await createTable();
            await fetchedDataAPI(ChickenData3);
            // console.log(userID);
        })();
    }, []);

    const fetchedDataAPI = async(newData: { itemList: ChickenCardProps[] }) => {
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

    const onToggleSwitch = (id: string, status: boolean) => {
        console.log(id+" "+status);
        setIsDarkMode(!isDarkMode);
    };

    const handleScroll = Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        {
            useNativeDriver: false,
            listener: (event: any) => {
                const offsetY = event.nativeEvent.contentOffset.y;
                if (offsetY > HIDE_HEIGHT) {
                    setShowSearchInput(false);
                } else {
                    setShowSearchInput(true);
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

    const showChickenCard = ({ item }: { item: ChickenCardProps }) => {
        return (
            <TouchableOpacity onPress={() => {
                onToggleSwitch(item.id, item.status);
            }} >
                <View style={{flexDirection: "row", width: Dimensions.get("screen").width*95/100, backgroundColor: COLORS.secondaryVeryLightGreyHex, margin: 5, borderRadius: 20}}>
                    <ImageBackground
                    source={item.imagelink_square}
                    style={[css.CardImageBG, {width: CARD_WIDTH*1.15, height: CARD_WIDTH*1.15,margin: 10}]}
                    resizeMode="cover">
                        <View style={css.CardRatingContainer}>
                            <Icon
                            name={'star'}
                            color={COLORS.primaryOrangeHex}
                            size={FONTSIZE.size_16}
                            />
                            <Text style={[styles.CardRatingText,{color:COLORS.primaryGreyHex}]}>{item.average_rating}</Text>
                        </View>
                    </ImageBackground>

                    <View style={{flexDirection: "column", justifyContent: "flex-start", margin: 20}}>
                        <Text style={styles.CardTitle}>{item.name}</Text>
                        <Text style={styles.CardSubtitle}>RM {currencyFormat(parseInt(item.price.find((price: { size: string; }) => price.size === 'M').price))}</Text>
                        
                        <View style={{ flex: 1, flexDirection: 'row', width: CARD_WIDTH, justifyContent: "flex-end", alignItems: "flex-end"}}>
                            <Switch 
                                style={styles.switch} 
                                value={item.status} 
                                onValueChange={()=>{onToggleSwitch(item.id, item.status)}} 
                                trackColor={{false: COLORS.primaryVeryLightGreyHex, true: "#7CB778"}}
                                color={COLORS.primaryVeryLightGreyHex}
                            />
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={[css.ScreenContainer, {backgroundColor: COLORS.primaryVeryLightGreyHex}]}>
            <StatusBar backgroundColor={COLORS.secondaryLightGreyHex} />
            
            {processData==true ? (
                <View style={{alignSelf:"center",}}>
                    <LoadingAnimation />
                </View>
            ) : (
            <View style={{flex: 1}}>
                <HeaderBar title="Product Control" checkBackBttn={true} />

                <View style={css.LineContainer}></View>

                {showSearchInput && (
                    <View style={[css.InputContainerComponent, {backgroundColor: COLORS.secondaryVeryLightGreyHex, borderWidth: 1, marginTop: -SPACING.space_5}]}>
                        <TouchableOpacity
                            onPress={() => {
                                // setSearchText(textValue);
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
                            placeholder="Find Your Chicken...."
                            value={searchText}
                            onChangeText={text => {
                                setSearchText(text);
                            }}
                            placeholderTextColor={COLORS.primaryLightGreyHex}
                            style={[css.TextInputContainer, {height: SPACING.space_20 * 2,}]}
                        />
                        {searchText.length > 0 ? (
                            <TouchableOpacity
                            onPress={() => {
                                // resetSearchCoffee();
                                // setTexValue("");
                                setSearchText("");
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
                            renderItem={showChickenCard}
                            keyExtractor={(item) => item.id}
                            onScroll={handleScroll}
                            removeClippedSubviews={false}
                            refreshControl={<RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                            />}
                        />
                    </View>
                ) : (
                    <View style={{alignSelf:"center",}}>
                        <EmptyListAnimation title={'Ops. No item here.'} />
                    </View>
                )}
            </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    CardRatingText: {
        fontFamily: FONTFAMILY.poppins_medium,
        color: COLORS.primaryGreyHex,
        lineHeight: SPACING.space_22,
        fontSize: FONTSIZE.size_14,
    },
    CardTitle: {
        fontFamily: FONTFAMILY.poppins_medium,
        color: COLORS.primaryGreyHex,
        fontSize: FONTSIZE.size_20,
        fontWeight: "bold",
    },
    CardSubtitle: {
        fontFamily: FONTFAMILY.poppins_light,
        color: COLORS.primaryRedHex,
        fontSize: FONTSIZE.size_18,
        fontWeight: "bold",
    },
    switch: {
        transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }],
    },
});

export default ProductAdjustPageScreen;
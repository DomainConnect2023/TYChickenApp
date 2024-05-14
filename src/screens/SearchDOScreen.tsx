import * as React from 'react';
import { useEffect, useState } from 'react';
import { View, Text, Dimensions, FlatList, TouchableOpacity, StatusBar, Image, ImageBackground, StyleSheet, Pressable, TextInput, Animated } from "react-native";
import HeaderBar from '../components/HeaderBar';
import { COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme';
import Icon from 'react-native-vector-icons/Ionicons';
import { HIDE_HEIGHT, css } from '../theme/CSS';
import { ActivityIndicator, TextInput as TextPaperInput } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Snackbar from 'react-native-snackbar';
import { ChickenData3, HistoryData } from '../data/ChickenData';
import { addData, createTable, selectData, updateData } from '../data/SQLiteFile';
import { ChickenCardProps, HistoryCardProps, currencyFormat } from '../components/Objects';
import DeliveryCard from '../components/DeliveryCard';
import EmptyListAnimation from '../components/EmptyListAnimation';
import LoadingAnimation from '../components/LoadingAnimation';

const CARD_WIDTH = Dimensions.get('window').width * 0.36;

const Item = ({ title }: { title: any }) => (
    <View style={[css.CategoryScrollViewContainer, {marginVertical: SPACING.space_10}]}>
        <TouchableOpacity onPress={() => { }}>
            <View style={[css.CategoryContainer, {backgroundColor: COLORS.primaryVeryLightGreyHex, borderWidth: 2}]}>
                <Text style={[css.CategoryText, {color: COLORS.primaryGreyHex,}]}>{title}</Text>
            </View>
        </TouchableOpacity>
    </View>
);

const SearchDOPageScreen = ({navigation}: {navigation:any}) => {
    const [processData, setProcessData] = useState(false);
    const [userID, setUserID] = useState('');
    const [searchText, setSearchText] = useState('');
    const [showNoItemImg, setShowNoItemImg] = useState(false);
    const [itemFinish, setItemFinish] = useState(false);

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
        <View style={[css.ScreenContainer, {backgroundColor: COLORS.primaryVeryLightGreyHex,}]}>
            <StatusBar backgroundColor={COLORS.secondaryLightGreyHex} />
            <HeaderBar title="Search Here..." checkBackBttn={true} />

            {showHeader && ( 
                <View style={[css.InputContainerComponent, {backgroundColor: COLORS.secondaryVeryLightGreyHex, borderWidth: 2,}]}>
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
                        placeholder="Find Your DO...."
                        value={searchText}
                        onChangeText={text => {
                            setSearchText(text);
                        }}
                        placeholderTextColor={COLORS.primaryLightGreyHex}
                        style={css.TextInputContainer}
                        onEndEditing={()=> {
                            // console.log("try");
                        }}
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

            {processData==true ? (
                <View style={{alignSelf:"center",}}>
                    <LoadingAnimation />
                </View>
            ) : (
                ( showNoItemImg == false ) ? (
                    (searchText.length>0) ? (
                        <View style={{flex: 1}}>
                            <FlatList
                                data={fetchedData}
                                renderItem={showHistoryCard}
                                keyExtractor={(item) => item.id}
                                onScroll={handleScroll}
                                removeClippedSubviews={false}
                                // ListFooterComponent={() => itemFinish && (
                                //     <TouchableOpacity onPress={() => {
                                        
                                //     }} >
                                //         <View style={css.HistoryCardContainer}>
                                //             <View style={css.HistoryTitleContainer}>
                                //                 <Text style={[styles.CardTitle, {color: COLORS.secondaryLightGreyHex}]}>Show Previous Data {">>>"}</Text>
                                //             </View>
                                //         </View>
                                //     </TouchableOpacity>
                                // )}
                            />
                        </View>
                    ) : (
                        <></>
                    )
                ) : (
                    <View style={{alignSelf:"center",}}>
                        <EmptyListAnimation title={'Ops. No Record here.'} />
                    </View>
                )
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
});

export default SearchDOPageScreen;
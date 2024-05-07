import * as React from 'react';
import { useEffect, useState } from 'react';
import { View, Text, Dimensions, FlatList, TouchableOpacity, Alert, StatusBar, StyleSheet, ImageBackground } from "react-native";
import Snackbar from 'react-native-snackbar';
import HeaderBar from '../components/HeaderBar';
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme';
import { ChickenCardProps } from '../components/ChickenCard';
import Icon from 'react-native-vector-icons/Ionicons';
import BGIcon from '../components/BGIcon';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChickenData3 } from '../data/ChickenData';
import { ActivityIndicator } from 'react-native-paper';
import { css } from '../theme/CSS';

const ProductPageScreen = ({navigation}: {navigation:any}) => {
    const [processData, setProcessData] = useState(false);
    const tabBarHeight = useBottomTabBarHeight();
    const [userID, setUserID] = useState('');
    const [showNoItemImg, setShowNoItemImg] = useState(false);

    const [fetchedData, setFetchedData] = useState<ChickenCardProps[]>([]);

    useEffect(()=> {
        (async()=> {
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

            // Set the new state with itemList
            setFetchedData(itemList);
        }catch (error: any) {
            Snackbar.show({
                text: error.message,
                duration: Snackbar.LENGTH_SHORT,
            });
        }
        setProcessData(false);
    };

    const showChickenCard = ({ item }: { item: ChickenCardProps }) => {
        return (
            <TouchableOpacity onPress={() => {navigation.navigate("ProductDetail")}} >
                <View style={{flexDirection: "row", width: Dimensions.get("screen").width*95/100, backgroundColor: COLORS.secondaryVeryLightGreyHex, margin: 5, borderRadius: 20}}>
                    <ImageBackground
                    source={item.imagelink_square}
                    style={[css.CardImageBG, {margin: 10}]}
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
                        <Text style={styles.CardSubtitle}>RM {item.price.find((price: { size: string; }) => price.size === 'M').price}</Text>

                        <View style={css.CardFooterRow}>
                            <Text style={css.CardPriceCurrency}>
                                {">>"} View Detail
                            </Text>
                            <TouchableOpacity onPress={() => {}}>
                                <View style={{alignSelf: "flex-end",}}>
                                    <BGIcon
                                        color={COLORS.primaryWhiteHex}
                                        name={'add'}
                                        BGColor={COLORS.primaryOrangeHex}
                                        size={FONTSIZE.size_18}
                                    />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    const swipeoutSetting = (item: any) => ({
        autoClose: true,
        right: [{
            onPress: () => {
                Alert.alert(
                    `Delete this item: ${item.name}?`,
                    '',
                    [
                        {
                            text: 'No',
                            onPress: () => {},
                            style: 'cancel'
                        },
                        { text: 'Yes', onPress: () => { 
                            
                        } }
                    ],
                    { cancelable: false }
                );
            },
            text: "Delete",
            backgroundColor: "red",
        }]
    });

    return (
        <View style={[css.ScreenContainer, {backgroundColor: COLORS.primaryVeryLightGreyHex}]}>
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
                    <HeaderBar title="Shopping List" />
                )}

                <View style={css.LineContainer}></View>

                <FlatList
                    data={fetchedData}
                    renderItem={showChickenCard}
                    keyExtractor={(item) => item.id}
                    style={{marginBottom: tabBarHeight}}
                />
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
});

export default ProductPageScreen;
import * as React from 'react';
import { useEffect, useState } from 'react';
import { View, Text, Dimensions, FlatList, TouchableOpacity, Alert, StatusBar, StyleSheet, ImageBackground, Image, Pressable, ScrollView, RefreshControl } from "react-native";
import Snackbar from 'react-native-snackbar';
import HeaderBar from '../components/HeaderBar';
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme';
import Icon from 'react-native-vector-icons/Ionicons';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChickenData3 } from '../data/ChickenData';
import { ActivityIndicator, TextInput } from 'react-native-paper';
import { css } from '../theme/CSS';
import { useFocusEffect } from '@react-navigation/native';
import { addData, createTable, db, selectData, updateData } from '../data/SQLiteFile';
import EmptyListAnimation from '../components/EmptyListAnimation';
import PopUpAnimation from '../components/PopUpAnimation';
import { ChickenCardProps, currencyFormat } from '../components/Objects';
import LoadingAnimation from '../components/LoadingAnimation';
import ShoppingListCard from '../components/ShoppingList';

const CARD_WIDTH = Dimensions.get('window').width * 0.36;

const ProductPageScreen = ({navigation}: {navigation:any}) => {
    const [processData, setProcessData] = useState(false);
    const [showAnimation, setShowAnimation] = useState(false);
    const tabBarHeight = useBottomTabBarHeight();
    const [userID, setUserID] = useState('');
    const [showNoItemImg, setShowNoItemImg] = useState(false);
    const [countItem, setCountItem] = useState<number>(0);
    const [refreshing, setRefreshing] = useState(false);

    const [fetchedData, setFetchedData] = useState<ChickenCardProps[]>([]);

    useEffect(()=> {
        (async()=> {
            await createTable();
            await checkCartNum();
            await fetchedDataAPI(ChickenData3);
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

    const onRefresh = async () => {
        setRefreshing(true);
        setProcessData(true);
        setTimeout(() => {
            setProcessData(false);
        }, 1000);
        setRefreshing(false);
    };

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

    const addQuantity = async ({index, quantity}: any) => {
        
        let newVar = quantity+1;
        const updatedData = fetchedData.map((data) => {
            if (data.index === index) {
                return { ...data, quantity: newVar };
            }
            return data;
        });
        setFetchedData(updatedData);
    }

    const lessQuantity = async ({index, quantity}: any) => {
        if (quantity>1) {
            let newVar = quantity-1;
            const updatedData = fetchedData.map((data) => {
                if (data.index === index) {
                    return { ...data, quantity: newVar };
                }
                return data;
            });
            setFetchedData(updatedData);
        }
    }

    const adjustQuantity = async ({index, text}: any) => {
        if(parseInt(text)>0){
            const updatedData = fetchedData.map((data) => {
                if (data.index === index) {
                    return { ...data, quantity: parseInt(text) };
                }
                return data;
            });
            setFetchedData(updatedData);
        }
    }

    // const addToCartApi = async(originid: number, name: string, type: string, picture: any, price: number, quantity: number) => {
        const addToCartApi = async({index, name, type, picture, price, quantity}: any) => {
        if(Number.isNaN(quantity) || quantity<=0){
            Snackbar.show({
                text: "Your item quantity can't be empty. ",
                duration: Snackbar.LENGTH_SHORT,
            });
        }else{
            try {
                const { checkLength, numberOfQuantity } = await selectData(index);
                if(checkLength>0){
                    let submitTotal = numberOfQuantity+quantity;
                    await updateData(index, submitTotal);
                    setShowAnimation(true);
                    setTimeout(() => {
                        setShowAnimation(false);
                    }, 800);
                }else{
                    await addData(index, name, type, picture, price, quantity);
                    setShowAnimation(true);
                    setTimeout(() => {
                        setShowAnimation(false);
                    }, 800);
                }
            } catch (error) {
                console.error("Error:", error);
            }
            await checkCartNum();
        }
    }

    const showChickenCard = ({ item }: { item: ChickenCardProps }) => {
        return (
            <TouchableOpacity onPress={() => {
                if(item.status==true){
                    navigation.navigate('ProductDetail', {
                        key: item.index, 
                        name: item.name, 
                        type: item.type, 
                        price: parseInt(item.price[1].price),
                        picture: item.imagelink_square, 
                        description: item.special_ingredient
                    });
                }
            }} >
                <ShoppingListCard 
                    id={item.id} 
                    index={item.index} 
                    type={item.type} 
                    roasted={item.type} 
                    imagelink_square={item.imagelink_square} 
                    name={item.name} 
                    special_ingredient={item.special_ingredient} 
                    average_rating={item.average_rating} 
                    price={item.price[1].price} 
                    quantity={item.quantity} 
                    status={item.status} 
                    buttonAddPressHandler={addQuantity} 
                    buttonLessPressHandler={lessQuantity} 
                    adjustQuantityHandler={adjustQuantity}
                    buttonaddtoCartPressHandler={addToCartApi} 
                />
            </TouchableOpacity>
        );
    };

    return (
        <View style={[css.ScreenContainer, {backgroundColor: COLORS.primaryVeryLightGreyHex}]}>
            <StatusBar backgroundColor={COLORS.secondaryLightGreyHex} />

            {showAnimation ? (
                <PopUpAnimation
                    style={{flex: 1}}
                    source={require('../animationPart/AddSuccess.json')}
                />
            ) : (
                <></>
            )}
            
            {processData==true ? (
                <View style={{alignSelf:"center",}}>
                    <LoadingAnimation />
                </View>
            ) : (
            <View style={{flex: 1, marginBottom: tabBarHeight}}>
                {userID == "admin" ? (
                    <></>
                ) : (
                    <HeaderBar title="Shopping List"  badgeNumber={countItem} />
                )}

                <View style={css.LineContainer}></View>

                {( showNoItemImg == false ) ? (
                    <View style={{flex: 1}}>
                        <FlatList
                            data={fetchedData}
                            renderItem={showChickenCard}
                            keyExtractor={(item) => item.id}
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
});

export default ProductPageScreen;
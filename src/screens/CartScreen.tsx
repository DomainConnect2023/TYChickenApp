import * as React from 'react';
import { useEffect, useState } from 'react';
import { View, Text, Dimensions, FlatList, TouchableOpacity, Pressable, Alert, StatusBar, StyleSheet, ImageBackground, Image, RefreshControl } from "react-native";
import Snackbar from 'react-native-snackbar';
import HeaderBar from '../components/HeaderBar';
import { COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme';
import { ChickenData3 } from '../data/ChickenData';
import { css } from '../theme/CSS';
import Icon from 'react-native-vector-icons/Ionicons';
import { ActivityIndicator, TextInput } from 'react-native-paper';
import { createTable, db, deleteAllData, deleteDB, updateData } from '../data/SQLiteFile';
import PopUpAnimation from '../components/PopUpAnimation';
import EmptyListAnimation from '../components/EmptyListAnimation';
import { CartItem, currencyFormat } from '../components/Objects';
import LoadingAnimation from '../components/LoadingAnimation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomDialog from '../components/ConfirmCheckoutDialog';

const CARD_WIDTH = Dimensions.get('window').width * 0.36;

const CartPageScreen = ({navigation}: {navigation:any}) => {
    const [processData, setProcessData] = useState(false);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [userID, setUserID] = useState('');
    const [showAnimation, setShowAnimation] = useState(false);
    const [showNoItemImg, setShowNoItemImg] = useState(false);
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [fetchedData, setFetchedData] = useState<CartItem[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(()=> {
        (async()=> {
            await createTable();
            await fetchedDataAPI();
            // await fetchedDataAPI(ChickenData3);
        })();
    }, []);

    // newData: { itemList: ChickenCardProps[] }
    const fetchedDataAPI = async() => {
        setProcessData(true);
        setUserID(await AsyncStorage.getItem('UserID') ?? "");
        setFetchedData([]);
        try {
            let sql = "SELECT * FROM Carts";
            db.transaction((tx) => {
                tx.executeSql(sql, [], async (tx, resultSet) => {
                    var length = resultSet.rows.length;
                    let finalTotal = 0;
                    let savedata: CartItem[] = [];
                    for (var i = 0; i < length; i++) {
                        finalTotal = finalTotal + (resultSet.rows.item(i).price*resultSet.rows.item(i).quantity);
                        const newData: CartItem = {
                            id: resultSet.rows.item(i).id,
                            originid: resultSet.rows.item(i).originid,
                            name: resultSet.rows.item(i).name,
                            category: resultSet.rows.item(i).category,
                            type: resultSet.rows.item(i).unit,
                            picture: resultSet.rows.item(i).picture,
                            price: resultSet.rows.item(i).price,
                            quantity: resultSet.rows.item(i).quantity,
                        };
                        savedata.push(newData);
                    }

                    if(length == 0){
                        setShowNoItemImg(true);
                    }else{
                        setShowNoItemImg(false);
                    }

                    setTotalPrice(finalTotal);
                    setFetchedData(savedata);
                }, (error) => {
                    console.log("List error", error);
                })
            });
            // setFetchedData(newData.itemList);

        }catch (error: any) {
            Snackbar.show({
                text: error.message,
                duration: Snackbar.LENGTH_SHORT,
            });
        }
        setProcessData(false);
    };

    const onToggleDialog = () => {
        setDialogVisible(!dialogVisible);
    };

    const CheckOutProcess = () => {
        setShowAnimation(true);
        setFetchedData([]);
        deleteAllData();
        setTimeout(() => {
            setShowAnimation(false);
            if(userID=="admin"){
                navigation.navigate('User Page' as never);
            }else{
                navigation.navigate('Tab' as never);
            }
        }, 2000);
    };

    const onRefresh = async () => {
        setRefreshing(true);
        setProcessData(true);
        setTimeout(() => {
            setProcessData(false);
        }, 1000);
        setRefreshing(false);
    };

    const showChickenCard = ({ item }: { item: CartItem }) => {
        return (
            <TouchableOpacity onPress={() => {
                // navigation.navigate('ProductDetail', {
                //     key: item.id, 
                //     name: item.name, 
                //     type: item.type, 
                //     price: item.price,
                //     picture: require("../assets/chicken_assets/logo3.png"), 
                //     description: "aaaaaa",
                // });
            }} >
                <View style={css.CardContainer}>
                    <ImageBackground
                        source={require("../assets/chicken_assets/noItem.jpg")}
                        // source={require("../assets/chicken_assets/logo3.png")}
                        style={[css.CardImageBG, {margin: SPACING.space_10}]}
                        resizeMode="cover">
                    </ImageBackground>

                    <View style={{flexDirection: "column", justifyContent: "flex-start", margin: SPACING.space_10}}>
                        <View style={{flexDirection: "row",justifyContent: 'space-between',}}>
                            <Text style={styles.CardTitle}>{item.name}</Text>
                            <TouchableOpacity onPress={async ()=>{
                                const newData = fetchedData.filter(data => data.originid !== item.originid);
                                setFetchedData(newData);
                                await deleteDB(item.originid, item.category);
                                if(newData.length==0){
                                    setShowNoItemImg(true);
                                }
                            }}>
                                <Icon
                                    name="close-circle-outline"
                                    color={COLORS.primaryOrangeHex}
                                    size={FONTSIZE.size_30}
                                    style={{fontWeight: "bold",}}
                                />
                            </TouchableOpacity>
                        </View>
                        <Text style={[styles.CardTitle, {fontSize: FONTSIZE.size_16}]}>{item.category}</Text>
                        <Text style={[styles.CardSubtitle, {color: COLORS.primaryOrangeHex}]}>RM {item.price.toFixed(2)} x {item.quantity}</Text>
                        <Text style={[styles.CardSubtitle, {color: COLORS.primaryOrangeHex}]}>{item.type}</Text>
                        <View style={{flexDirection: "row", justifyContent: 'space-between',}}>
                            <Pressable
                                style={css.miniPlusButton}
                                onPress={async () => {
                                    if (item.quantity>1) {

                                        let newVar = item.quantity-1;
                                        const updatedData = fetchedData.map((data) => {
                                            if (data.id === item.id) {
                                                return { ...data, quantity: newVar };
                                            }
                                            return data;
                                        });
                                        setFetchedData(updatedData);
                                        updateData(item.originid, item.category, newVar);
                                        let newTotalPrice = totalPrice-item.price;
                                        setTotalPrice(newTotalPrice);
                                    }else{
                                        const newData = fetchedData.filter(data => data.originid !== item.originid);
                                        setFetchedData(newData);
                                        await deleteDB(item.originid, item.category);
                                        if(newData.length==0){
                                            setShowNoItemImg(true);
                                        }
                                    }
                                }}
                            >
                                <Text style={css.buttonText}>-</Text>
                            </Pressable>
                            <TextInput
                                style={css.miniNumberOfOrder}
                                mode="outlined"
                                keyboardType = 'numeric'
                                value={item.quantity.toString()}
                                onChangeText={(text)=>{
                                    if(parseInt(text)>0){
                                        const updatedData = fetchedData.map((data) => {
                                            if (data.id === item.id) {
                                                return { ...data, quantity: parseInt(text) };
                                            }
                                            return data;
                                        });
                                        setFetchedData(updatedData);
                                        updateData(item.originid, item.category, parseInt(text));
                                        if(parseInt(text)>item.quantity){
                                            let newTotalPrice = totalPrice+(item.price*(parseInt(text)-item.quantity));
                                            setTotalPrice(newTotalPrice);
                                        }else if(item.quantity>parseInt(text)){
                                            let newTotalPrice = totalPrice-(item.price*(item.quantity-parseInt(text)));
                                            setTotalPrice(newTotalPrice);
                                        }
                                    }
                                }}
                            />
                            <Pressable
                                style={css.miniPlusButton}
                                onPress={async () => {
                                    let newVar = item.quantity+1;
                                    const updatedData = fetchedData.map((data) => {
                                        if (data.id === item.id) {
                                            return { ...data, quantity: newVar };
                                        }
                                        return data;
                                    });
                                    setFetchedData(updatedData);
                                    updateData(item.originid, item.category, newVar);
                                    let newTotalPrice = totalPrice+item.price;
                                    setTotalPrice(newTotalPrice);
                                }}
                            >
                                <Text style={css.buttonText}>+</Text>
                            </Pressable>
                        </View>

                        <View style={styles.CardFooterRow}>
                            <Text style={styles.CardPriceCurrency}>
                                RM {(item.quantity*item.price).toFixed(2)}
                            </Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={[css.ScreenContainer, {backgroundColor: COLORS.primaryVeryLightGreyHex}]}>
            <StatusBar backgroundColor={COLORS.secondaryLightGreyHex} />

            {showAnimation ? (
                <PopUpAnimation
                    style={{flex: 1}}
                    source={require('../animationPart/Successful.json')}
                />
            ) : (
                <></>
            )}

            {processData==true ? (
                <View style={{alignSelf:"center",}}>
                    <LoadingAnimation />
                </View>
            ): (
            <View style={{flex: 1}}>
                <HeaderBar title="Cart" checkBackBttn={true} />
                <View style={css.LineContainer}></View>

                {( showNoItemImg == false ) ? (
                    <View style={{flex: 1}}>
                        <FlatList
                            data={fetchedData}
                            renderItem={showChickenCard}
                            keyExtractor={(item) => item.id.toString()}
                            style={{marginBottom: Dimensions.get("screen").height/100*12}}
                            removeClippedSubviews={false}
                            refreshControl={<RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                            />}
                        />

                        <View style={css.CheckOutContainer}>
                            <View style={css.CheckOutPressable}>
                                <View style={{flexDirection:"row", width: Dimensions.get("screen").width, justifyContent: 'space-between',paddingHorizontal: SPACING.space_30,}}>
                                    <Text style={css.CartTotalPriceText}>Total</Text>
                                    <Text style={css.CartTotalPriceText}>RM {totalPrice.toFixed(2)}</Text>
                                </View>
                                <View style={{height: 0.2, width: '100%', backgroundColor: COLORS.primaryLightGreyHex, marginTop: 5}}></View>
                                <Pressable style={css.CheckOutButton} onPress={async () => {
                                    // CheckOutProcess();
                                    onToggleDialog();
                                }}>
                                    <Text style={css.CheckOutText}>Process to Check Out</Text>
                                </Pressable>
                                <CustomDialog visible={dialogVisible} onClose={onToggleDialog} DoneFunction={CheckOutProcess} />
                            </View>
                        </View>
                    </View>
                ) : (
                    <View style={{alignSelf:"center",}}>
                        <EmptyListAnimation title={`Ops, empty here.`} />
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
      CardSubtitle: {
        fontFamily: FONTFAMILY.poppins_light,
        color: COLORS.normalLightGreyHex,
        fontSize: FONTSIZE.size_16,
        fontWeight: "bold",
      },
      CardFooterRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        marginTop: SPACING.space_15,
        width: CARD_WIDTH * 1.15,
        height: SPACING.space_20 * 2,
      },
      CardPriceCurrency: {
        fontFamily: FONTFAMILY.poppins_semibold,
        color: COLORS.primaryRedHex,
        fontSize: FONTSIZE.size_16,
        fontWeight: "bold",
      },
      CardPrice: {
        color: COLORS.primaryGreyHex,
      },
});

export default CartPageScreen;
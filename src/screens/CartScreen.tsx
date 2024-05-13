import * as React from 'react';
import { useEffect, useState } from 'react';
import { View, Text, Dimensions, FlatList, TouchableOpacity, Pressable, Alert, StatusBar, StyleSheet, ImageBackground, Image } from "react-native";
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

const CARD_WIDTH = Dimensions.get('window').width * 0.36;

const CartPageScreen = ({navigation}: {navigation:any}) => {
    const [processData, setProcessData] = useState(false);
    const [showAnimation, setShowAnimation] = useState(false);
    const [showNoItemImg, setShowNoItemImg] = useState(false);
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [fetchedData, setFetchedData] = useState<CartItem[]>([]);

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
        setFetchedData([]);
        try {
            let sql = "SELECT *, SUM(quantity) as totalQuantity FROM Carts GROUP BY originid";
            db.transaction((tx) => {
                tx.executeSql(sql, [], async (tx, resultSet) => {
                    var length = resultSet.rows.length;
                    let finalTotal = 0;
                    let savedata: CartItem[] = [];
                    for (var i = 0; i < length; i++) {
                        finalTotal = finalTotal + (resultSet.rows.item(i).price*resultSet.rows.item(i).totalQuantity);
                        const newData: CartItem = {
                            id: resultSet.rows.item(i).id,
                            originid: resultSet.rows.item(i).originid,
                            name: resultSet.rows.item(i).name,
                            type: resultSet.rows.item(i).type,
                            picture: resultSet.rows.item(i).picture,
                            price: resultSet.rows.item(i).price,
                            quantity: resultSet.rows.item(i).totalQuantity,
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
                    console.log("List user error", error);
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

    const CheckOutProcess = () => {
        setShowAnimation(true);
        setFetchedData([]);
        deleteAllData();
        setTimeout(() => {
            setShowAnimation(false);
            // navigation.navigate('Home');
        }, 2000);
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
                        source={require("../assets/chicken_assets/logo3.png")}
                        style={[css.CardImageBG, {margin: SPACING.space_10}]}
                        resizeMode="cover">
                    </ImageBackground>

                    <View style={{flexDirection: "column", justifyContent: "flex-start", margin: SPACING.space_10}}>
                        <View style={{flexDirection: "row",justifyContent: 'space-between',}}>
                            <Text style={styles.CardTitle}>{item.name}</Text>
                            <TouchableOpacity onPress={async ()=>{
                                const newData = fetchedData.filter(data => data.originid !== item.originid);
                                setFetchedData(newData);
                                await deleteDB(item.originid);
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
                        <Text style={styles.CardSubtitle}>RM {currencyFormat(item.price)} x {item.quantity}</Text>
                        <Text style={styles.CardSubtitle}>{item.type} KG</Text>
                        <View style={{flexDirection: "row", justifyContent: 'space-between',}}>
                            <Pressable
                                style={css.miniPlusButton}
                                onPress={async () => {
                                    if (item.quantity>1) {

                                        let newVar = item.quantity-1;
                                        const updatedData = fetchedData.map((data) => {
                                            if (data.originid === item.originid) {
                                                return { ...data, quantity: newVar };
                                            }
                                            return data;
                                        });
                                        setFetchedData(updatedData);
                                        updateData(item.originid, newVar);
                                        let newTotalPrice = totalPrice-item.price;
                                        setTotalPrice(newTotalPrice);
                                    }else{
                                        const newData = fetchedData.filter(data => data.originid !== item.originid);
                                        setFetchedData(newData);
                                        await deleteDB(item.originid);
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
                                            if (data.originid === item.originid) {
                                                return { ...data, quantity: parseInt(text) };
                                            }
                                            return data;
                                        });
                                        setFetchedData(updatedData);
                                        updateData(item.originid, parseInt(text));
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
                                        if (data.originid === item.originid) {
                                            return { ...data, quantity: newVar };
                                        }
                                        return data;
                                    });
                                    setFetchedData(updatedData);
                                    updateData(item.originid, newVar);
                                    let newTotalPrice = totalPrice+item.price;
                                    setTotalPrice(newTotalPrice);
                                }}
                            >
                                <Text style={css.buttonText}>+</Text>
                            </Pressable>
                        </View>

                        <View style={styles.CardFooterRow}>
                            <Text style={styles.CardPriceCurrency}>
                                RM {currencyFormat(item.quantity*item.price)}
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
            <View style={{justifyContent: 'center', alignItems: 'center', marginVertical: 10, padding: 20,}}>
                <ActivityIndicator size="large" />
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
                        />

                        <View style={css.CheckOutContainer}>
                            <View style={css.CheckOutPressable}>
                                <View style={{flexDirection:"row", width: Dimensions.get("screen").width, justifyContent: 'space-between',paddingHorizontal: SPACING.space_30,}}>
                                    <Text style={css.CartTotalPriceText}>Total</Text>
                                    <Text style={css.CartTotalPriceText}>RM {currencyFormat(totalPrice)}</Text>
                                </View>
                                <View style={{height: 0.2, width: '100%', backgroundColor: COLORS.primaryLightGreyHex, marginTop: 5}}></View>
                                <Pressable style={css.CheckOutButton} onPress={async () => {
                                    CheckOutProcess();
                                }}>
                                    <Text style={css.CheckOutText}>Check Out</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                ) : (
                    <View style={{alignSelf:"center",}}>
                        <EmptyListAnimation title={'Please add something to cart.'} />
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
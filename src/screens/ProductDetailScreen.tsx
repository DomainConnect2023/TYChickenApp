import React, { useEffect, useRef, useState } from 'react';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { Dimensions, Image, Pressable, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ActivityIndicator, TextInput } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Snackbar from 'react-native-snackbar';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme';
import HeaderBar from '../components/HeaderBar';
import {FlatList} from 'react-native';
import { css } from '../theme/CSS';
import { addData, createTable, db, selectData, updateData } from '../data/SQLiteFile';
import PopUpAnimation from '../components/PopUpAnimation';
import { CategoryProps, ProductData, currencyFormat } from '../components/Objects';
import LoadingAnimation from '../components/LoadingAnimation';
import { CategoryList } from '../data/ChickenData';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProductDetailPageScreen = ({navigation}: {navigation:any}) => {
    const route = useRoute();
    const { key, name, price, type, picture, description } = route.params as ProductData;
    const [processData, setProcessData] = useState(false);
    const [userID, setUserID] = useState('');
    const [showAnimation, setShowAnimation] = useState(false);
    const [countItem, setCountItem] = useState<number>(0);

    const [fetchedData, setFetchedData] = useState<CategoryProps[]>([]);

    useEffect(()=> {
        (async()=> {
            await createTable();
            await checkCartNum();
            await fetchedDataAPI(CategoryList);
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
    
    const fetchedDataAPI = async(newData: { itemList: CategoryProps[] }) => {
        setProcessData(true);
        setUserID(await AsyncStorage.getItem('UserID') ?? "");
        setFetchedData([]);
        try {
            const { itemList } = newData;
            setFetchedData(itemList);
          
        }catch (error: any) {
            Snackbar.show({
              text: error.message,
              duration: Snackbar.LENGTH_SHORT,
            });
        }
        setProcessData(false);
    };

    const addToCartApi = async(originid: number, name: string, type: string, picture: any, price: number, quantity: number) => {
        if(Number.isNaN(quantity) || quantity<=0){
            Snackbar.show({
                text: "Your item quantity can't be empty. ",
                duration: Snackbar.LENGTH_SHORT,
            });
        }else{
            try {
                const { checkLength, numberOfQuantity } = await selectData(originid);
                if(checkLength>0){
                    let submitTotal = numberOfQuantity+quantity;
                    await updateData(originid, submitTotal);
                    setShowAnimation(true);
                    setTimeout(() => {
                        setShowAnimation(false);
                    }, 800);
                }else{
                    await addData(originid,name, type, picture, price, quantity);
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
    

    return (
        <View style={css.ScreenContainer}>
            <StatusBar backgroundColor={COLORS.secondaryLightGreyHex} />
            <HeaderBar title="" checkBackBttn={true} badgeNumber={countItem} />
            <View style={css.LineContainer}></View>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={css.ScrollViewFlex}>

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
            ): (
                <View style={{flex: 1}}>
                    <Image
                        style={css.DetailImage}
                        source={picture}
                    />

                    <View style={[css.cardContainer, {marginBottom: 60}]}>
                        <View style={{marginTop: 10}}>
                            <Text style={css.ScreenTitle}>
                                {name}
                            </Text>
                        </View>
                        <View style={{flexDirection: "row", alignItems: 'center', justifyContent: 'space-between', marginBottom: SPACING.space_10}}>
                            <View>
                                <Text style={[css.ScreenTitle, {color: COLORS.primaryRedHex}]}>
                                    RM {currencyFormat(price)}
                                </Text>
                            </View>
                        </View>
                        <View>
                            {/* <Text style={css.DetailTitle}>
                                Select Category
                            </Text> */}
                            <View style={[css.CategoryScrollViewContainer, {alignSelf: "flex-start"}]}>
                                {fetchedData.map((item) => (
                                    <View style={styles.CategoryContainer} key={item.id}>
                                        <Text style={styles.CategoryText}>{item.value}</Text>
                                        <View style={{ flexDirection: "row", marginHorizontal: SPACING.space_10, alignSelf: "center" }}>
                                            <Pressable
                                                style={css.plusButton}
                                                onPress={() => {
                                                    if (item.quantity > 0) {
                                                        let newQuantity = item.quantity-1;
                                                        const updatedData = fetchedData.map((data) => {
                                                            if (data.id === item.id) {
                                                                return { ...data, quantity: newQuantity };
                                                            }
                                                            return data;
                                                        });
                                                        setFetchedData(updatedData);
                                                    }
                                                }}
                                            >
                                                <Text style={css.buttonText}>-</Text>
                                            </Pressable>
                                            <TextInput
                                                style={css.NumberOfOrder}
                                                mode="outlined"
                                                keyboardType='numeric'
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
                                                    }
                                                }}
                                            />
                                            <Pressable
                                                style={css.plusButton}
                                                onPress={() => {
                                                    let newQuantity = item.quantity+1;
                                                    const updatedData = fetchedData.map((data) => {
                                                        if (data.id === item.id) {
                                                            return { ...data, quantity: newQuantity };
                                                        }
                                                        return data;
                                                    });
                                                    setFetchedData(updatedData);
                                                }}
                                            >
                                                <Text style={css.buttonText}>+</Text>
                                            </Pressable>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </View>

                        <View style={css.LineContainer}></View>
                        
                        <View>
                            <Text style={css.DetailTitle}>
                                Description
                            </Text>
                            <Text style={css.DescriptionText}>
                                {description} asdA fasd asdf asdA fasd asdf asdasdA fasd asdf asdA fasd A fasd aA fasd asdf sdA fasdsdA fasd asdf asdA fasd asdf asdA fasd asdf asdA fasd asdf a asdf aasd asdf a
                            </Text>
                        </View>
                    </View>
                    <View style={css.CartFooter}>
                        <Pressable
                            style={css.AddtoCartButton}
                            onPress={async () => {
                                console.log(fetchedData);

                                // let categorySelected;
                                // categoryIndex.index === 1 ? (
                                //     categorySelected="10"
                                // ) : (
                                //     categoryIndex.index === 2 ? (
                                //         categorySelected="50"
                                //     ) : (
                                //         categorySelected="100"
                                //     )
                                // );

                                // addToCartApi(
                                //     key, 
                                //     name, 
                                //     categorySelected, 
                                //     '../assets/chicken_assets/cartPic.png', 
                                //     price, 
                                //     parseInt(quantity)
                                // );
                            }}
                        >
                            <Text style={css.AddtoCartText}>Add to Cart</Text>
                        </Pressable>
                    </View>
                </View>
            )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    CategoryContainer: {
        backgroundColor: COLORS.standardGreyHex,
        flexDirection: "row",
        justifyContent:"space-between",
        width: Dimensions.get("screen").width*90/100, 
        marginHorizontal: SPACING.space_10,
        marginVertical: SPACING.space_5,
        padding: SPACING.space_5,
        borderRadius: BORDERRADIUS.radius_20,
    },
    CategoryText: {
        textAlignVertical: 'center',
        height: SPACING.space_50,
        fontSize: FONTSIZE.size_16,
        fontFamily: FONTFAMILY.poppins_semibold,
        fontWeight: "bold",
        color: COLORS.primaryLightGreyHex,
        marginHorizontal: SPACING.space_20,
    },
});

export default ProductDetailPageScreen;
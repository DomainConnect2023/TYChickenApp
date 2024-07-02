import React, { useEffect, useState } from 'react';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { Dimensions, Image, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import Snackbar from 'react-native-snackbar';
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme';
import HeaderBar from '../components/HeaderBar';
import { css } from '../theme/CSS';
import { addData, createTable, db, selectData, updateData } from '../data/SQLiteFile';
import PopUpAnimation from '../components/PopUpAnimation';
import { CategoryProps, ProductData } from '../components/Objects';
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
    const [remark, setRemark] = useState('');

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
            let sql = "SELECT * FROM Carts";
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

    const addToCartApi = async() => {
        fetchedData.forEach(async (item) => {
            if(item.quantity>0){
                try {
                    const { checkLength, numberOfQuantity } = await selectData(key, item.value);
                    if(checkLength>0){
                        let submitTotal = numberOfQuantity+item.quantity;
                        await updateData(key, item.value, submitTotal);
                    }else{
                        await addData(key, name, item.value, type, picture, price, item.quantity, remark);
                        await checkCartNum();
                    }
                } catch (error) {
                    console.error("Error:", error);
                }
            }
        });

        setShowAnimation(true);
        setTimeout(() => {
            setShowAnimation(false);
        }, 800);
    }
    

    return (
        <View style={css.ScreenContainer}>
            <StatusBar backgroundColor={COLORS.secondaryLightGreyHex} />
            {processData==true ? (
                <View style={{alignSelf:"center",}}>
                    <LoadingAnimation />
                </View>
            ): (
            <View style={{flex: 1}}>   
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
            
                <Image
                    style={css.DetailImage}
                    source={picture}
                />

                <View style={[css.cardContainer, {marginBottom: 60}]}>
                    <View style={css.CardContainerTitle}>
                        <Text style={css.ScreenTitle}>
                            {name} - {type} 
                        </Text>
                        <View>
                            <Text style={[css.ScreenTitle, {color: COLORS.primaryRedHex}]}>
                                RM {price.toFixed(2)}
                            </Text>
                        </View>
                        
                    </View>
                    <View>
                        <View style={[css.CategoryScrollViewContainer, {alignSelf: "center"}]}>

                            {/* showing category list in here */}
                            {fetchedData.map((item) => (
                                <View style={styles.CategoryContainer} key={item.id}>
                                    <Text style={styles.CategoryText}>{item.value}</Text>
                                    <View style={{ flexDirection: "row", marginHorizontal: SPACING.space_4, alignSelf: "center" }}>
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
                                            <Text style={styles.buttonText}>-</Text>
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
                                            // onSubmitEditing={async (event) => {
                                            //     const text = event.nativeEvent.text;
                                            //     if(parseInt(text)>0){
                                            //         const updatedData = fetchedData.map((data) => {
                                            //             if (data.id === item.id) {
                                            //                 return { ...data, quantity: parseInt(text) };
                                            //             }
                                            //             return data;
                                            //         });
                                            //         setFetchedData(updatedData);
                                            //     }
                                            // }}
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
                                            <Text style={styles.buttonText}>+</Text>
                                        </Pressable>
                                    </View>
                                </View>
                            ))}
                            {/* end showing category list */}

                        </View>
                    </View>

                    <View style={css.LineContainer}></View>
                    
                    <View>
                        <Text style={css.DetailTitle}>
                            Remark
                        </Text>
                        <TextInput
                            style={{alignSelf:"center",width: "90%", height: 80}}
                            mode="outlined"
                            label="Additional Remark"
                            value={remark}
                            onChangeText={setRemark}
                        />
                        {/* <Text style={css.DescriptionText}>
                            {description} asdA fasd asdf asdA fasd asdf asdasdA fasd asdf asdA fasd A fasd aA fasd asdf sdA fasdsdA fasd asdf asdA fasd asdf asdA fasd asdf asdA fasd asdf a asdf aasd asdf a
                        </Text> */}
                    </View>
                </View>
                <View style={css.CartFooter}>
                    <Pressable
                        style={css.AddtoCartButton}
                        onPress={async () => {
                            addToCartApi();
                        }}
                    >
                        <Text style={css.AddtoCartText}>Add to Cart</Text>
                    </Pressable>
                </View>
            
                </ScrollView>
            </View>
            )}
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
        // padding: SPACING.space_5,
        borderRadius: BORDERRADIUS.radius_10,
    },
    CategoryText: {
        textAlignVertical: 'center',
        height: SPACING.space_50,
        fontSize: FONTSIZE.size_14,
        fontFamily: FONTFAMILY.poppins_semibold,
        fontWeight: "bold",
        color: COLORS.primaryLightGreyHex,
        marginHorizontal: SPACING.space_20,
    },
    buttonText: {
        fontSize: FONTSIZE.size_14,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: COLORS.primaryBlackHex,
        textAlign: "center",

    },
});

export default ProductDetailPageScreen;
import * as React from 'react';
import { useEffect, useState } from 'react';
import { View, Text, Dimensions, FlatList, TouchableOpacity, StatusBar, Image, ImageBackground, StyleSheet, Pressable, TextInput } from "react-native";
import HeaderBar from '../components/HeaderBar';
import { COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme';
import Icon from 'react-native-vector-icons/Ionicons';
import { css } from '../theme/CSS';
import { ActivityIndicator, TextInput as TextPaperInput } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Snackbar from 'react-native-snackbar';
import { ChickenData3 } from '../data/ChickenData';
import { addData, createTable, selectData, updateData } from '../data/SQLiteFile';
import { ChickenCardProps, currencyFormat } from '../components/Objects';

const CategoryList = [
    { id: '1', title: 'Frozen' },
    { id: '2', title: 'Fresh' },
    { id: '3', title: 'Part' },
    { id: '4', title: 'Box' },
    { id: '5', title: 'Bag' },
    { id: '6', title: 'Piece' },
];

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

const SearchPageScreen = ({navigation}: {navigation:any}) => {
    const [processData, setProcessData] = useState(false);
    const [userID, setUserID] = useState('');
    const [showNoItemImg, setShowNoItemImg] = useState(false);
    
    // const [textValue, setTexValue] = useState('');
    const [searchText, setSearchText] = useState('');
    const [fetchedData, setFetchedData] = useState<ChickenCardProps[]>([]);

    useEffect(()=> {
        (async()=> {
            await createTable();
            // setFetchedData([]);
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
                    Snackbar.show({
                        text: "Add to Cart Successfully.",
                        duration: Snackbar.LENGTH_SHORT,
                    });
                }else{
                    await addData(originid,name, type, picture, price, quantity);
                }
            } catch (error) {
                console.error("Error:", error);
            }
        }
    }

    const showGridFlatlist = ({ item }: { item: any }) => (
        <Item title={item.title} />
    );

    const showChickenCard = ({ item }: { item: ChickenCardProps }) => {
        return (
            <TouchableOpacity onPress={() => {
                navigation.navigate('ProductDetail', {
                    key: item.index, 
                    name: item.name, 
                    type: item.type, 
                    price: parseInt(item.price[1].price),
                    picture: item.imagelink_square, 
                    description: item.special_ingredient
                });
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

                        <View style={{flexDirection: "row", justifyContent: 'space-between',}}>
                            <Pressable
                                style={css.miniPlusButton}
                                onPress={async () => {
                                    if (item.quantity>1) {
                                        let newVar = item.quantity-1;
                                        const updatedData = fetchedData.map((data) => {
                                            if (data.index === item.index) {
                                                return { ...data, quantity: newVar };
                                            }
                                            return data;
                                        });
                                        setFetchedData(updatedData);
                                    }
                                }}
                            >
                                <Text style={css.buttonText}>-</Text>
                            </Pressable>
                            <TextPaperInput
                                style={css.miniNumberOfOrder}
                                mode="outlined"
                                keyboardType = 'numeric'
                                value={item.quantity.toString()}
                                onChangeText={(text)=>{
                                    if(parseInt(text)>0){
                                        const updatedData = fetchedData.map((data) => {
                                            if (data.index === item.index) {
                                                return { ...data, quantity: parseInt(text) };
                                            }
                                            return data;
                                        });
                                        setFetchedData(updatedData);
                                    }
                                }}
                            />
                            <Pressable
                                style={css.miniPlusButton}
                                onPress={async () => {
                                    let newVar = item.quantity+1;
                                    const updatedData = fetchedData.map((data) => {
                                        if (data.index === item.index) {
                                            return { ...data, quantity: newVar };
                                        }
                                        return data;
                                    });
                                    setFetchedData(updatedData);
                                }}
                            >
                                <Text style={css.buttonText}>+</Text>
                            </Pressable>
                        </View>

                        <View style={css.CardFooterRow}>
                            <Text style={css.CardPriceCurrency}>
                                Add to Cart
                            </Text>
                            <TouchableOpacity onPress={() => {
                                addToCartApi(
                                    item.index, 
                                    item.name, 
                                    item.type, 
                                    '../assets/chicken_assets/cartPic.png', 
                                    parseInt(item.price[1].price), 
                                    item.quantity,
                                )
                            }}>
                                <Icon
                                    color={COLORS.primaryWhiteHex}
                                    name={'add'}
                                    size={FONTSIZE.size_28}
                                    style={{backgroundColor: COLORS.primaryOrangeHex}}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={[css.ScreenContainer, {backgroundColor: COLORS.primaryVeryLightGreyHex,}]}>
            <StatusBar backgroundColor={COLORS.secondaryLightGreyHex} />
            <HeaderBar title="Search Here..." checkBackBttn={true} />
                
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
                    placeholder="Find Your Chicken...."
                    value={searchText}
                    onChangeText={text => {
                        setSearchText(text);
                    }}
                    placeholderTextColor={COLORS.primaryLightGreyHex}
                    style={css.TextInputContainer}
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

            {processData==true ? (
                <View style={{justifyContent: 'center', alignItems: 'center', marginVertical: 10, padding: 20,}}>
                    <ActivityIndicator size="large" />
                </View>
            ) : (
                ( showNoItemImg == false ) ? (
                    (searchText.length>0) ? (
                    // (fetchedData.length>0) ? (
                        <View style={{flex: 1}}>
                            <FlatList
                                data={fetchedData}
                                renderItem={showChickenCard}
                                keyExtractor={(item) => item.id}
                                removeClippedSubviews={false}
                            />
                        </View>
                    ) : (
                        <View style={{width: Dimensions.get("screen").width/100*95, alignSelf:"center", marginTop: 20}}>
                            <Text style={css.ScreenTitle}>
                                Filter
                            </Text>
                            <FlatList
                                data={CategoryList}
                                renderItem={showGridFlatlist}
                                keyExtractor={item => item.id}
                                numColumns={3}
                            />
                        </View>
                    )
                ) : (
                    <View style={{alignSelf:"center",}}>
                        <Image
                            source={require('../assets/chicken_assets/noData.png')}
                            style={{width: Dimensions.get("window").width/100*90, height: 300}}
                        />
                        <Text style={[css.DetailTitle, {alignSelf:"center",marginTop: SPACING.space_50}]}>Please add something to cart.</Text>
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

export default SearchPageScreen;
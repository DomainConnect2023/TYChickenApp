import * as React from 'react';
import { useEffect, useState } from 'react';
import { View, Text, Dimensions, FlatList, TouchableOpacity, StatusBar, Image, ImageBackground, StyleSheet, Pressable, TextInput, Animated, RefreshControl } from "react-native";
import HeaderBar from '../components/HeaderBar';
import { COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme';
import Icon from 'react-native-vector-icons/Ionicons';
import { HIDE_HEIGHT, css } from '../theme/CSS';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Snackbar from 'react-native-snackbar';
import { addData, createTable, selectData, updateData } from '../data/SQLiteFile';
import { ChickenProductProps, currencyFormat } from '../components/Objects';
import LoadingAnimation from '../components/LoadingAnimation';
import { useRoute } from '@react-navigation/native';
import ShoppingListCard from '../components/ShoppingList';
import PopUpAnimation from '../components/PopUpAnimation';
import RNFetchBlob from 'rn-fetch-blob';

const CategoryList = [
    { id: '1', title: 'Frozen' },
    { id: '2', title: 'Fresh' },
    { id: '3', title: 'Leg' },
];

const CARD_WIDTH = Dimensions.get('window').width * 0.36;

const SearchPageScreen = ({navigation}: {navigation:any}) => {
    const route = useRoute();
    const { filterValue } = route.params as { filterValue: string };
    const [processData, setProcessData] = useState(false);
    const [showAnimation, setShowAnimation] = useState(false);
    const [userID, setUserID] = useState('');
    const [showNoItemImg, setShowNoItemImg] = useState(false);

    const [searchText, setSearchText] = useState(filterValue);
    const [fetchedData, setFetchedData] = useState<ChickenProductProps[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    const [scrollY] = useState(new Animated.Value(0));
    const [showSearchInput, setShowSearchInput] = useState(true);

    useEffect(()=> {
        (async()=> {
            await createTable();
            // await fetchedDataAPI("");
            // console.log(userID);
        })();
    }, []);

    const fetchedDataAPI = async(searchValue: any) => {
        setProcessData(true);
        const userCode = await AsyncStorage.getItem('UserID') ?? "";
        const IPaddress = await AsyncStorage.getItem('IPAddress') ?? "";
        setFetchedData([]);

        try {
            const res = await RNFetchBlob.config({ trusty: true })
            .fetch("POST", "https://"+IPaddress+"/api/SearchProduct", {
                "Content-Type": "application/json"
            }, JSON.stringify({ 
                "Code": userCode, 
                "Query": searchValue 
            }));

            const responseData = await res.json();
            if(responseData.status==1){
                const formattedMessages = responseData.data.map((item: any) => {
                    return {
                        code: item.code,
                        item: item.item,
                        itemName: item.itemName, 
                        active: item.active,
                        category: item.category,
                        price: item.price,
                        unit: item.unit,
                    };
                });
                
                if(formattedMessages.length == 0){
                    setShowNoItemImg(true);
                }else{
                    setShowNoItemImg(false);
                    setFetchedData(formattedMessages);
                }
            }else{
                console.log("Something Error");
                Snackbar.show({
                    text: "Something Error",
                    duration: Snackbar.LENGTH_SHORT,
                });
            }

        }catch (error: any) {
            Snackbar.show({
                text: error.message,
                duration: Snackbar.LENGTH_SHORT,
            });
        }
        setProcessData(false);
    };

    const onRefresh = async () => {
        setRefreshing(true);
        setProcessData(true);
        setTimeout(() => {
            setProcessData(false);
        }, 1000);
        setRefreshing(false);
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

    const showGridFlatlist = ({ item }: { item: any }) => (
        <Item title={item.title} />
    );

    const Item = ({ title }: { title: any }) => (
        <View style={[css.CategoryScrollViewContainer, {marginVertical: SPACING.space_10}]}>
            <TouchableOpacity onPress={async () => { 
                setSearchText(title);
                fetchedDataAPI(title);
            }}>
                <View style={[css.CategoryContainer, {backgroundColor: COLORS.primaryVeryLightGreyHex, borderWidth: 2, margin: SPACING.space_5}]}>
                    <Text style={[css.CategoryText, {color: COLORS.primaryGreyHex,}]}>{title}</Text>
                </View>
            </TouchableOpacity>
        </View>
    );

    const showChickenCard = ({ item }: { item: ChickenProductProps }) => {
        return (
            <TouchableOpacity onPress={() => {
                navigation.navigate('ProductDetail', {
                    key: item.code, 
                    name: item.itemName, 
                    type: item.category, 
                    price: item.price,
                    picture: require('../assets/chicken_assets/noItem.jpg'),
                    description: ""
                });
            }} >
                <ShoppingListCard 
                    code={item.code}
                    item={item.item}
                    itemName={item.itemName}
                    category={item.category}
                    active={item.active}
                    price={item.price}
                    unit={item.unit} 
                    picture={""} 
                    quantity={0}                    
                />
            </TouchableOpacity>
        );
    };

    return (
        <View style={[css.ScreenContainer, {backgroundColor: COLORS.primaryVeryLightGreyHex,}]}>
            <StatusBar backgroundColor={COLORS.secondaryLightGreyHex} />
            <HeaderBar title="Search Here..." checkBackBttn={true} />
                
            {showSearchInput && (
                <View style={[css.InputContainerComponent, {backgroundColor: COLORS.secondaryVeryLightGreyHex, borderWidth: 2,}]}>
                    <TouchableOpacity
                        onPress={async () => {
                            await fetchedDataAPI(searchText);
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
                        onSubmitEditing={async () => {
                            await fetchedDataAPI(searchText);
                        }}
                    />
                    {searchText.length > 0 ? (
                        <TouchableOpacity
                        onPress={() => {[
                            setSearchText(""),
                            setShowNoItemImg(false),
                            setFetchedData([])
                        ]}}>
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
                ( showNoItemImg == false ) ? (
                    (fetchedData.length>0) ? (
                        <View style={{flex: 1}}>
                            <FlatList
                                data={fetchedData}
                                renderItem={showChickenCard}
                                keyExtractor={(item) => item.code}
                                onScroll={handleScroll}
                                removeClippedSubviews={false}
                                refreshControl={<RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={onRefresh}
                                />}
                                style={{marginBottom: SPACING.space_30}}
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
                                numColumns={2}
                            />
                        </View>
                    )
                ) : (
                    // <View style={{alignSelf:"center",}}>
                    //     <EmptyListAnimation title={'Search Another Words.'} />
                    // </View>
                    <View style={{alignSelf:"center",}}>
                        <Image
                            source={require('../assets/chicken_assets/noChicken.png')}
                            style={{width: Dimensions.get("window").width/100*90, height: 300}}
                        />
                        <Text style={[css.DetailTitle, {alignSelf:"center",marginTop: SPACING.space_50}]}>
                            Search other keywords.
                        </Text>
                    </View>
                )
            )}
        </View>
    );
}

export default SearchPageScreen;
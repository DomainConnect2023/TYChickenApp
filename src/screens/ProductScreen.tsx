import * as React from 'react';
import { useEffect, useState } from 'react';
import { View, FlatList, TouchableOpacity, StatusBar, RefreshControl } from "react-native";
import Snackbar from 'react-native-snackbar';
import HeaderBar from '../components/HeaderBar';
import { COLORS } from '../theme/theme';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChickenData3 } from '../data/ChickenData';
import { css } from '../theme/CSS';
import { useFocusEffect } from '@react-navigation/native';
import { addData, createTable, db, selectData, updateData } from '../data/SQLiteFile';
import EmptyListAnimation from '../components/EmptyListAnimation';
import PopUpAnimation from '../components/PopUpAnimation';
import { ChickenCardProps, ChickenProductProps } from '../components/Objects';
import LoadingAnimation from '../components/LoadingAnimation';
import ShoppingListCard from '../components/ShoppingList';
import RNFetchBlob from 'rn-fetch-blob';


const ProductPageScreen = ({navigation}: {navigation:any}) => {
    const [processData, setProcessData] = useState(false);
    // const [showAnimation, setShowAnimation] = useState(false);
    const tabBarHeight = useBottomTabBarHeight();
    const [userLabel, setUserLabel] = useState('');
    const [showNoItemImg, setShowNoItemImg] = useState(false);
    const [countItem, setCountItem] = useState<number>(0);
    const [refreshing, setRefreshing] = useState(false);

    const [fetchedData, setFetchedData] = useState<ChickenProductProps[]>([]);

    useEffect(()=> {
        (async()=> {
            await createTable();
            await checkCartNum();
            await fetchedDataAPI();
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

    const fetchedDataAPI = async() => {
        setProcessData(true);
        setUserLabel(await AsyncStorage.getItem('label') ?? "");
        const userCode = await AsyncStorage.getItem('UserID') ?? "";
        const IPaddress = await AsyncStorage.getItem('IPAddress') ?? "";

        setFetchedData([]);
        try {
            const res = await RNFetchBlob.config({ trusty: true })
            .fetch("POST", "https://"+IPaddress+"/api/GetProduct", {
                "Content-Type": "application/json"
            }, JSON.stringify({ 
                "Code": userCode 
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
    
                // setFetchedData((prevData) => [...prevData, ...JSON.parse(res.data)]);
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

    const showChickenCard = ({ item }: { item: ChickenProductProps }) => {
        return (
            <TouchableOpacity onPress={() => {
                if(item.active=="Y"){
                    navigation.navigate('ProductDetail', {
                        key: item.item, 
                        name: item.itemName, 
                        type: item.unit, 
                        price: item.price,
                        picture: require('../assets/chicken_assets/noItem.jpg'),
                        description: ""
                    });
                }
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
        <View style={[css.ScreenContainer, {backgroundColor: COLORS.primaryVeryLightGreyHex}]}>
            <StatusBar backgroundColor={COLORS.secondaryLightGreyHex} />

            {/* {showAnimation ? (
                <PopUpAnimation
                    style={{flex: 1}}
                    source={require('../animationPart/AddSuccess.json')}
                />
            ) : (
                <></>
            )} */}
            
            {processData==true ? (
                <View style={{alignSelf:"center",}}>
                    <LoadingAnimation />
                </View>
            ) : (
            <View style={{flex: 1, marginBottom: tabBarHeight}}>
                {userLabel == "admin" ? (
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


export default ProductPageScreen;
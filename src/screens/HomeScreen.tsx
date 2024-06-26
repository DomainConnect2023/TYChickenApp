import React, {useEffect, useState} from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View, ImageBackground, Image, ImageProps, BackHandler,} from 'react-native';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import { COLORS, FONTSIZE, SPACING,} from '../theme/theme';
import HeaderBar from '../components/HeaderBar';
import {FlatList} from 'react-native';
import {Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { ChickenCard, HomeChickenCard, } from '../components/ChickenCard';
import Snackbar from 'react-native-snackbar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from 'react-native-paper';
import { ChickenData2 } from '../data/ChickenData';
import { css } from '../theme/CSS';
import { useFocusEffect } from '@react-navigation/native';
import { createTable, db } from '../data/SQLiteFile';
import { ChickenCardProps, currencyFormat } from '../components/Objects';
import LoadingAnimation from '../components/LoadingAnimation';

const HomeScreen = ({navigation}: any) => {
  const tabBarHeight = useBottomTabBarHeight();
  const [userID, setUserID] = useState('');
  const [processData, setProcessData] = useState(false);
  const [countItem, setCountItem] = useState<number>(0);

  const [fetchedData, setFetchedData] = useState<ChickenCardProps[]>([]);

  useEffect(()=> {
    (async()=> {
      await createTable();
      await checkCartNum();
      await fetchedDataAPI(ChickenData2);
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

  const fetchedDataAPI = async(newData: { itemList: ChickenCardProps[] }) => {
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
        <HomeChickenCard 
          id={item.id}
          index={item.index}
          type={item.type}
          roasted={item.roasted}
          imagelink_square={item.imagelink_square}
          name={item.name}
          special_ingredient={item.special_ingredient}
          average_rating={item.average_rating}
          price={item.price[1].price}
          quantity={item.quantity}
          status={item.status}
          buttonAddPressHandler={{}} 
          buttonLessPressHandler={{}} 
          adjustQuantityHandler={{}}
          buttonaddtoCartPressHandler={{}}   
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={css.ScreenContainer}>
      <StatusBar backgroundColor={COLORS.secondaryLightGreyHex} />
      {processData==true ? (
        <View style={{alignSelf:"center",}}>
          <LoadingAnimation />
        </View>
      ): (
        <View style={{marginBottom: tabBarHeight}}>
          {userID == "admin" ? (
            <></>
          ) : (
            <HeaderBar title="TY CHICKEN" badgeNumber={countItem} />
          )}
          <View style={css.LineContainer}></View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={css.ScrollViewFlex}>

            <Image
              style={{width: Dimensions.get("screen").width/100*95, height: 200, borderRadius: 30, alignSelf: "center"}}
              source={require('../assets/chicken_assets/discount.jpg')}
            />

            {/* Chicken Flatlist */}
            <View style={css.DashboardTitle}>
              <Text style={[css.ScreenTitle,{flex: 2}]}>
                Chicken Type
              </Text>
              <TouchableOpacity onPress={() => {navigation.navigate("Product")}}>
                <Text style={[css.ViewMoreText, {flex: 1,}]}>
                  ---View More---
                </Text>
              </TouchableOpacity>
            </View>

            <View style={[css.FlatListContainer,{flexDirection: "row", width: Dimensions.get("screen").width/100*95, marginBottom: SPACING.space_18}]}>
              <TouchableOpacity onPress={() => {
                navigation.navigate('Search', {
                  filterValue: "Frozen", 
                });
              }} >
                <ChickenCard
                  id={"1"}
                  index={1}
                  type={""}
                  roasted={""}
                  imagelink_square={require('../assets/chicken_assets/FrozenChicken.jpg')}
                  name={"Frozen Chicken"}
                  special_ingredient={""}
                  average_rating={5.0}
                  price={{size: 'M', price: '', currency: ''}}
                  quantity={0}
                  status={true}
                  buttonAddPressHandler={{}} 
                  buttonLessPressHandler={{}} 
                  adjustQuantityHandler={{}}
                  buttonaddtoCartPressHandler={{}}   
                />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => {
                navigation.navigate('Search', {
                  filterValue: "Fresh", 
                });
              }}>
                <ChickenCard
                  id={"2"}
                  index={2}
                  type={""}
                  roasted={""}
                  imagelink_square={require('../assets/chicken_assets/FullChicken.jpg')}
                  name={"Fresh Chicken"}
                  special_ingredient={""}
                  average_rating={5.0}
                  price={{ size: 'M', price: '', currency: '' }}
                  quantity={0}
                  status={true} 
                  buttonAddPressHandler={{}} 
                  buttonLessPressHandler={{}} 
                  adjustQuantityHandler={{}}
                  buttonaddtoCartPressHandler={{}}                  
                />
              </TouchableOpacity>
            </View>

            <View style={css.LineContainer}></View>

            <View style={[css.DashboardTitle, {marginTop: 0}]}>
              <Text style={[css.ScreenTitle,{flex: 2}]}>
                Top 5 Sales
              </Text>
              <TouchableOpacity onPress={() => {navigation.navigate("Product")}}>
                <Text style={[css.ViewMoreText, {flex: 1,}]}>
                  ---View More---
                </Text>
              </TouchableOpacity>
            </View>

            <View style={[
              css.FlatListContainer, 
              userID != "admin" ? {marginBottom: tabBarHeight} : {}, 
              {flexDirection: "row", }
            ]}>
              <FlatList
                data={fetchedData}
                renderItem={showChickenCard}
                keyExtractor={(item) => item.id}
                horizontal
              />
            </View>
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default HomeScreen;

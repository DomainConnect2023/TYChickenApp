import React, {useEffect, useRef, useState} from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View, ImageBackground, Image,} from 'react-native';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING,} from '../theme/theme';
import HeaderBar from '../components/HeaderBar';
import CustomIcon from '../components/CustomIcon';
import {FlatList} from 'react-native';
import {Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import BGIcon from '../components/BGIcon';
import { ChickenCard, ChickenCardProps } from '../components/ChickenCard';
import Snackbar from 'react-native-snackbar';
import CartPageScreen from './CartScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from 'react-native-paper';
import { ChickenData2 } from '../data/ChickenData';
import { css, tabBarHeight } from '../theme/CSS';

const HomeScreen = ({navigation}: any) => {
  const [userID, setUserID] = useState('');
  const [processData, setProcessData] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [categoryIndex, setCategoryIndex] = useState({ index: 1 });

  const ListRef: any = useRef<FlatList>();
  

  const [fetchedData, setFetchedData] = useState<ChickenCardProps[]>([]);

  useEffect(()=> {
    (async()=> {
      await fetchedDataAPI(ChickenData2);
      // console.log(userID);
    })();
  }, []);

  // useFocusEffect(
  //   React.useCallback(() => {
  //     fetchedDataAPI(ChickenData2);
  //   }, [])
  // );

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
      <TouchableOpacity onPress={() => {navigation.navigate("ProductDetail")}} >
        <LinearGradient
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={[css.CardLinearGradientContainer, {margin: SPACING.space_10}]}
          colors={[COLORS.primaryGreyHex, COLORS.primaryGreyHex]}>
          {/* colors={[COLORS.primaryGreyHex, COLORS.primaryVeryLightGreyHex]}> */}
          <ImageBackground
            source={item.imagelink_square}
            style={css.CardImageBG}
            resizeMode="cover">
            <View style={css.CardRatingContainer}>
              <Icon
                name={'star'}
                color={COLORS.primaryOrangeHex}
                size={FONTSIZE.size_16}
              />
              <Text style={css.CardRatingText}>{item.average_rating}</Text>
            </View>
          </ImageBackground>
          <Text style={css.CardTitle}>{item.name}</Text>
          <Text style={css.CardSubtitle}>{item.special_ingredient}</Text>
          <View style={css.CardFooterRow}>
            <Text style={css.CardPriceCurrency}>
              RM <Text style={css.CardPrice}>{item.price[1].price}</Text>
            </Text>
            <TouchableOpacity
              onPress={() => {navigation.navigate("ProductDetail")}}>
              <BGIcon
                color={COLORS.primaryWhiteHex}
                name={'add'}
                BGColor={COLORS.primaryOrangeHex}
                size={FONTSIZE.size_10}
              />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <View style={css.ScreenContainer}>
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
            <HeaderBar title="TY CHICKEN" />
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
              <TouchableOpacity onPress={() => {navigation.navigate("ProductDetail")}} >
                <ChickenCard
                  id={"1"}
                  index={1}
                  type={""}
                  roasted={""}
                  imagelink_square={require('../assets/chicken_assets/FrozenChicken.jpg')}
                  name={"Frozen chicken"}
                  special_ingredient={"Can keep between 3 to 5 months."}
                  average_rating={5.0}
                  price={{size: 'M', price: '1500', currency: 'RM'}}
                  buttonPressHandler={{}}
                />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => {navigation.navigate("ProductDetail")}}>
                <ChickenCard
                  id={"2"}
                  index={2}
                  type={""}
                  roasted={""}
                  imagelink_square={require('../assets/chicken_assets/FullChicken.jpg')}
                  name={"Fresh Chicken"}
                  special_ingredient={"Can Keep between 3 to 5 Days."}
                  average_rating={5.0}
                  price={{size: 'M', price: '1400', currency: 'RM'}}
                  buttonPressHandler={{}}
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

            <View style={[css.FlatListContainer,{flexDirection: "row"}]}>
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

const styles = StyleSheet.create({


});

export default HomeScreen;

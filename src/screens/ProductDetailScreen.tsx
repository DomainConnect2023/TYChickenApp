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

const ChickenSampleData = {
        index: 0,
        id: 'C1',
        name: 'Chicken Wing',
        roasted: 'Medium Roasted',
        imagelink_square: require('../assets/chicken_assets/wing.jpg'),
        special_ingredient: 'With Wing',
        price: [
            {size: 'S', price: '1000', currency: '$'},
            {size: 'M', price: '1150', currency: '$'},
            {size: 'L', price: '1400', currency: '$'},
        ],
        average_rating: 5.0,
        type: 'Part',
        buttonPressHandler: {}
}

const ProductDetailPageScreen = ({navigation}: {navigation:any}) => {
    const route = useRoute();
    const [processData, setProcessData] = useState(false);
    // const { key, name, price, type } = route.params as ProductData;
    const [lootData, setLootData] = useState(false);
    const priceItem = ChickenSampleData.price.find(price => price.size === 'M');
    const [quantity, setQuantity] = useState("10");
    const [countItem, setCountItem] = useState<number>(0);

    const ListRef: any = useRef<FlatList>();
    const [categoryIndex, setCategoryIndex] = useState({ index: 1 });

    useEffect(()=> {
        (async()=> {
            await fetchedDataAPI();
        })();
    }, []);
    
      const fetchedDataAPI = async() => {
        setProcessData(true);
        try {
          
        }catch (error: any) {
            Snackbar.show({
              text: error.message,
              duration: Snackbar.LENGTH_SHORT,
            });
        }
        setProcessData(false);
    };
    

    return (
        <View style={css.ScreenContainer}>
            <StatusBar backgroundColor={COLORS.secondaryLightGreyHex} />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={css.ScrollViewFlex}>
                {/* App Header */}
                <HeaderBar title="" checkBackBttn={true} />
                <View style={css.LineContainer}></View>
            
            {processData==true ? (
                <View style={{justifyContent: 'center', alignItems: 'center', marginVertical: 10, padding: 20,}}>
                    <ActivityIndicator size="large" />
                </View>
            ): (
                <View style={{flex: 1}}>
                    <Image
                        style={css.DetailImage}
                        source={ChickenSampleData.imagelink_square}
                    />

                    <View style={css.cardContainer}>
                        <View style={{marginTop: 10}}>
                            <Text style={css.ScreenTitle}>
                                {ChickenSampleData.name}
                            </Text>
                        </View>
                        <View style={{flexDirection: "row", alignItems: 'center', justifyContent: 'space-between', marginBottom: SPACING.space_30}}>
                            <View>
                                <Text style={[css.ScreenTitle, {color: COLORS.primaryRedHex}]}>
                                    RM {ChickenSampleData.price.find(price => price.size === 'M')?.price || ''}
                                </Text>
                            </View>
                            <View style={{flexDirection: "row", marginHorizontal: SPACING.space_10}}>
                                <Pressable
                                    style={css.plusButton}
                                    onPress={async () => {
                                        if(parseInt(quantity)>10){
                                            let newVar = parseInt(quantity)-10;
                                            setQuantity(newVar.toString());
                                        }
                                    }}
                                >
                                    <Text style={css.buttonText}>-</Text>
                                </Pressable>
                                <TextInput
                                    style={css.NumberOfOrder}
                                    mode="outlined"
                                    keyboardType = 'numeric'
                                    value={quantity}
                                    onChangeText={setQuantity}
                                />
                                <Pressable
                                    style={css.plusButton}
                                    onPress={async () => {
                                        let newVar = parseInt(quantity)+10;
                                        setQuantity(newVar.toString());
                                    }}
                                >
                                    <Text style={css.buttonText}>+</Text>
                                </Pressable>
                            </View>
                        </View>
                        <View>
                            <Text style={css.DetailTitle}>
                                Select Category
                            </Text>
                            <ScrollView horizontal 
                                showsHorizontalScrollIndicator={false} 
                                contentContainerStyle={css.CategoryScrollViewStyle}>
                                <View
                                    key={1}
                                    style={css.CategoryScrollViewContainer}
                                    >
                                    <TouchableOpacity
                                    style={css.CategoryScrollViewItem}
                                    onPress={() => {
                                        ListRef?.current?.scrollToOffset({
                                        animated: true,
                                        offset: 0,
                                        });
                                        setCategoryIndex({ index: 1 });
                                    }}>
                                    {categoryIndex.index === 1 ? (
                                        <View style={[css.CategoryContainer, {backgroundColor: COLORS.primaryRedHex,}]}>
                                            <Text style={[css.CategoryText, {color: COLORS.primaryWhiteHex,}]}>10 KG</Text>
                                        </View>
                                    ) : (
                                        <View style={[css.CategoryContainer, {backgroundColor: COLORS.primaryVeryLightGreyHex,}]}>
                                    
                                            <Text style={[css.CategoryText, {color: COLORS.primaryGreyHex,}]}>10 KG</Text>
                                        </View>
                                    )}
                                    </TouchableOpacity>
                                </View>

                                <View
                                    key={2}
                                    style={css.CategoryScrollViewContainer}>
                                    <TouchableOpacity
                                    style={css.CategoryScrollViewItem}
                                    onPress={() => {
                                        ListRef?.current?.scrollToOffset({
                                        animated: true,
                                        offset: 0,
                                        });
                                        setCategoryIndex({ index: 2 });
                                    }}>
                                    {categoryIndex.index === 2 ? (
                                        <View style={[css.CategoryContainer, {backgroundColor: COLORS.primaryRedHex,}]}>
                                            <Text style={[css.CategoryText, {color: COLORS.primaryWhiteHex,}]}>50 KG</Text>
                                        </View>
                                    ) : (
                                        <View style={[css.CategoryContainer, {backgroundColor: COLORS.primaryVeryLightGreyHex,}]}>
                                            <Text style={[css.CategoryText, {color: COLORS.primaryGreyHex,}]}>50 KG</Text>
                                        </View>
                                    )}
                                    </TouchableOpacity>
                                </View>

                                <View
                                    key={3}
                                    style={css.CategoryScrollViewContainer}>
                                    <TouchableOpacity
                                    style={css.CategoryScrollViewItem}
                                    onPress={() => {
                                        ListRef?.current?.scrollToOffset({
                                        animated: true,
                                        offset: 0,
                                        });
                                        setCategoryIndex({ index: 3 });
                                    }}>
                                    {categoryIndex.index === 3 ? (
                                        <View style={[css.CategoryContainer, {backgroundColor: COLORS.primaryRedHex,}]}>
                                            <Text style={[css.CategoryText, {color: COLORS.primaryWhiteHex,}]}>100 KG</Text>
                                        </View>
                                    ) : (
                                        <View style={[css.CategoryContainer, {backgroundColor: COLORS.primaryVeryLightGreyHex,}]}>
                                            <Text style={[css.CategoryText, {color: COLORS.primaryGreyHex,}]}>100 KG</Text>
                                        </View>
                                    )}
                                    </TouchableOpacity>
                                </View>
                            </ScrollView>
                        </View>

                        <View style={css.LineContainer}></View>
                        
                        <View>
                            <Text style={css.DetailTitle}>
                                Description
                            </Text>
                            <Text style={css.DescriptionText}>
                                {ChickenSampleData.special_ingredient} asdA fasd asdf asdA fasd asdf asdasdA fasd asdf asdA fasd A fasd aA fasd asdf sdA fasdsdA fasd asdf asdA fasd asdf asdA fasd asdf asdA fasd asdf a asdf aasd asdf a
                            </Text>
                        </View>
                    </View>
                    <View style={css.CartFooter}>
                        <Pressable
                            style={css.AddtoCartButton}
                            onPress={async () => {}}
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

export default ProductDetailPageScreen;
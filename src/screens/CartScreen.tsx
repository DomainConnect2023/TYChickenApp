import * as React from 'react';
import { useEffect, useState } from 'react';
import { View, Text, Dimensions, FlatList, TouchableOpacity, Pressable, Alert, StatusBar, StyleSheet, ImageBackground } from "react-native";
import Snackbar from 'react-native-snackbar';
import HeaderBar from '../components/HeaderBar';
import { COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme';
import { ChickenCardProps } from '../components/ChickenCard';
import { ChickenData3 } from '../data/ChickenData';
import { CARD_WIDTH, css } from '../theme/CSS';
import Icon from 'react-native-vector-icons/Ionicons';

const CartPageScreen = ({navigation}: {navigation:any}) => {
    const [dataProcess, setDataProcess] = useState(false);
    const [showNoItemImg, setShowNoItemImg] = useState(false);
    const [totalPrice, setTotalPrice] = useState<number>(0);

    const [fetchedData, setFetchedData] = useState<ChickenCardProps[]>([]);

    useEffect(()=> {
        (async()=> {
            await fetchedDataAPI(ChickenData3);
        })();
    }, []);

    const fetchedDataAPI = async(newData: { itemList: ChickenCardProps[] }) => {
        setFetchedData([]);
        try {
            setFetchedData(newData.itemList);

        }catch (error: any) {
            Snackbar.show({
                text: error.message,
                duration: Snackbar.LENGTH_SHORT,
            });
        }
    };

    const showChickenCard = ({ item }: { item: ChickenCardProps }) => {
        return (
            <TouchableOpacity onPress={() => {navigation.navigate("ProductDetail")}} >
                <View style={css.CardContainer}>
                    <ImageBackground
                        source={item.imagelink_square}
                        style={[css.CardImageBG, {margin: SPACING.space_10}]}
                        resizeMode="cover">
                    </ImageBackground>

                    <View style={{flexDirection: "column", justifyContent: "flex-start", margin: SPACING.space_10}}>
                        <View style={{flexDirection: "row",justifyContent: 'space-between',}}>
                            <Text style={styles.CardTitle}>{item.name}</Text>
                            <TouchableOpacity onPress={()=>{
                                Snackbar.show({
                                    text: `Delete ${item.name}`,
                                    duration: Snackbar.LENGTH_SHORT,
                                });
                            }}>
                                <Icon
                                    name="close-circle-outline"
                                    color={COLORS.primaryOrangeHex}
                                    size={FONTSIZE.size_30}
                                    style={{fontWeight: "bold",}}
                                />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.CardSubtitle}>100 KG x 1</Text>
                        <Text style={styles.CardSubtitle}>Whole</Text>

                        <View style={styles.CardFooterRow}>
                            <Text style={styles.CardPriceCurrency}>
                                Total: RM {item.price.find((price: { size: string; }) => price.size === 'M').price}
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

            {/* App Header */}
            <HeaderBar title="Cart" checkBackBttn={true} />
            <View style={css.LineContainer}></View>

            <FlatList
                data={fetchedData}
                renderItem={showChickenCard}
                keyExtractor={(item) => item.id}
                style={{marginBottom: Dimensions.get("screen").height/100*14}}
            />

            <View style={css.CheckOutContainer}>
                <View style={css.CheckOutPressable}>
                    <View style={{flexDirection:"row", width: Dimensions.get("screen").width, justifyContent: 'space-between',paddingHorizontal: SPACING.space_30,}}>
                        <Text style={css.CartTotalPriceText}>Total</Text>
                        <Text style={css.CartTotalPriceText}>RM {totalPrice}</Text>
                    </View>
                    <View style={{height: 0.2, width: '100%', backgroundColor: COLORS.primaryLightGreyHex, marginTop: 5}}></View>
                    <Pressable style={css.CheckOutButton} onPress={async () => {}}>
                        <Text style={css.CheckOutText}>Check Out</Text>
                    </Pressable>
                </View>
            </View>
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
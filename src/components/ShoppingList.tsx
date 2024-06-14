import {Dimensions, ImageBackground, Pressable, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, { useState } from 'react';
import {BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING} from '../theme/theme';
import { css } from '../theme/CSS';
import Icon from 'react-native-vector-icons/Ionicons';
import { ChickenCardProps, ChickenProductProps, currencyFormat } from './Objects';
import { ActivityIndicator, TextInput, TextInput as TextPaperInput } from 'react-native-paper';

const CARD_WIDTH = Dimensions.get('window').width * 0.36;


const ShoppingListCard: React.FC<ChickenProductProps> = ({
    code,
    item,
    itemName,
    active,
    category,
    price,
    unit,
    picture,
    quantity
}) => {
    return (
        <View style={{
            flexDirection: "row", 
            width: Dimensions.get("screen").width*95/100, 
            backgroundColor: COLORS.secondaryVeryLightGreyHex, 
            margin: 5, 
            borderRadius: 20,
        }}>
            <ImageBackground
            source={require('../assets/chicken_assets/noItem.jpg')}
            style={[css.CardImageBG, {width: CARD_WIDTH*1.15, height: CARD_WIDTH*1.15,margin: SPACING.space_10}]}
            blurRadius={active=="Y" ? 0 : 20}
            resizeMode="cover">
            {active=="Y" ? (
                <></>
            ) : (
                <View style={css.CardRatingContainer}>
                    <Text style={{color:COLORS.primaryRedHex,fontSize: 18,fontWeight: 'bold',}}>Sold Out</Text>
                </View>
            )}
            </ImageBackground>

            {active=="Y"==true ? (
                <View style={{flexDirection: "column", justifyContent: "flex-start", margin: 20}}>
                <Text style={styles.CardTitle}>{itemName}</Text>
                <Text style={styles.CardSubtitle}>By {unit}</Text>
                <Text style={styles.CardPrice}>RM {currencyFormat(parseInt(price))}</Text>

                <View style={[css.CardFooterRow,{marginTop: SPACING.space_50}]}>
                    <Text style={css.CardPriceCurrency}>
                        Click to view more
                    </Text>
                </View>
            </View>
            ) : (
                <></>
            )}
        </View>
    );
};

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
        fontFamily: FONTFAMILY.poppins_medium,
        color: COLORS.primaryLightGreyHex,
        fontSize: FONTSIZE.size_14,
        fontWeight: "bold",
    },
    CardPrice: {
        fontFamily: FONTFAMILY.poppins_light,
        color: COLORS.primaryRedHex,
        fontSize: FONTSIZE.size_18,
        fontWeight: "bold",
    },
});

export default ShoppingListCard;

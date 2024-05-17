import {Dimensions, ImageBackground, Pressable, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, { useState } from 'react';
import {BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING} from '../theme/theme';
import { css } from '../theme/CSS';
import Icon from 'react-native-vector-icons/Ionicons';
import { ChickenCardProps, currencyFormat } from './Objects';
import { ActivityIndicator, TextInput as TextPaperInput } from 'react-native-paper';

const CARD_WIDTH = Dimensions.get('window').width * 0.36;

const image = "../assets/chicken_assets/cartPic.png";
const add = "add";
const less = "less";

const ShoppingListCard: React.FC<ChickenCardProps> = ({
    id,
    index,
    name,
    type,
    imagelink_square,
    price,
    average_rating,
    quantity,
    buttonPressHandler,
}) => {
    return (
        <View style={{flexDirection: "row", width: Dimensions.get("screen").width*95/100, backgroundColor: COLORS.secondaryVeryLightGreyHex, margin: 5, borderRadius: 20}}>
            <ImageBackground
                source={imagelink_square}
                style={[css.CardImageBG, {width: CARD_WIDTH*1.15, height: CARD_WIDTH*1.15,margin: 10}]}
                resizeMode="cover">
                <View style={css.CardRatingContainer}>
                    <Icon
                    name={'star'}
                    color={COLORS.primaryOrangeHex}
                    size={FONTSIZE.size_16}
                    />
                    <Text style={[styles.CardRatingText,{color:COLORS.primaryGreyHex}]}>{average_rating}</Text>
                </View>
            </ImageBackground>

            <View style={{flexDirection: "column", justifyContent: "flex-start", margin: 20}}>
                <Text style={styles.CardTitle}>{name}</Text>
                <Text style={styles.CardSubtitle}>RM {currencyFormat(parseInt(price))}</Text>

                <View style={{flexDirection: "row", justifyContent: 'space-between',}}>
                    <Pressable
                        style={css.miniPlusButton}
                        onPress={async () => {
                            buttonPressHandler({
                                index,
                                add,
                                quantity,
                            });
                        }}
                    >
                        <Text style={css.buttonText}>-</Text>
                    </Pressable>
                    <TextPaperInput
                        style={css.miniNumberOfOrder}
                        mode="outlined"
                        keyboardType = 'numeric'
                        value={quantity.toString()}
                        onChangeText={(text)=>{
                            
                        }}
                    />
                    <Pressable
                        style={css.miniPlusButton}
                        onPress={async () => {
                            buttonPressHandler({
                                index,
                                less,
                                quantity,
                            });
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
                        
                    }}>
                        <Icon
                            color={COLORS.primaryWhiteHex}
                            name={'add'}
                            size={FONTSIZE.size_28}
                            style={{backgroundColor: COLORS.primaryOrangeHex, borderRadius: BORDERRADIUS.radius_8}}
                        />
                    </TouchableOpacity>
                </View>
            </View>
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
        fontFamily: FONTFAMILY.poppins_light,
        color: COLORS.primaryRedHex,
        fontSize: FONTSIZE.size_18,
        fontWeight: "bold",
    },
});

export default ShoppingListCard;

import {Dimensions, ImageBackground, Pressable, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, { useState } from 'react';
import {BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING} from '../theme/theme';
import { css } from '../theme/CSS';
import Icon from 'react-native-vector-icons/Ionicons';
import { ChickenCardProps, currencyFormat } from './Objects';
import { ActivityIndicator, TextInput, TextInput as TextPaperInput } from 'react-native-paper';

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
    status,
    buttonAddPressHandler,
    buttonLessPressHandler,
    adjustQuantityHandler,
    buttonaddtoCartPressHandler,
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
            source={imagelink_square}
            style={[css.CardImageBG, {width: CARD_WIDTH*1.15, height: CARD_WIDTH*1.15,margin: SPACING.space_10}]}
            blurRadius={status ? 0 : 20}
            resizeMode="cover">
            {status ? (
                <View style={css.CardRatingContainer}>
                    <Icon
                    name={'star'}
                    color={COLORS.primaryOrangeHex}
                    size={FONTSIZE.size_16}
                    />
                    <Text style={[styles.CardRatingText,{color:COLORS.primaryGreyHex}]}>{average_rating}</Text>
                </View>
            ) : (
                <View style={css.CardRatingContainer}>
                    <Text style={{color:COLORS.primaryRedHex,fontSize: 24,fontWeight: 'bold',}}>Sold Out</Text>
                </View>
            )}
            </ImageBackground>

            {status==true ? (
                <View style={{flexDirection: "column", justifyContent: "flex-start", margin: 20}}>
                <Text style={styles.CardTitle}>{name}</Text>
                <Text style={styles.CardSubtitle}>RM {currencyFormat(parseInt(price))}</Text>

                <View style={{
                    flexDirection: "row", 
                    justifyContent: 'space-between',
                }}>
                    <Pressable
                        style={css.miniPlusButton}
                        onPress={async () => {
                            buttonLessPressHandler({
                                index,
                                quantity,
                            });
                        }}
                    >
                        <Text style={css.buttonText}>-</Text>
                    </Pressable>
                    <TextInput
                        style={css.miniNumberOfOrder}
                        mode="outlined"
                        keyboardType = 'numeric'
                        value={quantity.toString()}
                        onChangeText={(text)=>{
                            adjustQuantityHandler({
                                index,
                                text,
                            });
                        }}
                    />
                    <Pressable
                        style={css.miniPlusButton}
                        onPress={async () => {
                            buttonAddPressHandler({
                                index,
                                quantity,
                            });
                        }}
                    >
                        <Text style={css.buttonText}>+</Text>
                    </Pressable>
                </View>

                <View style={css.CardFooterRow}>
                    <Text style={[css.CardPriceCurrency, {marginHorizontal: SPACING.space_10}]}>
                        Add to Cart
                    </Text>
                    <TouchableOpacity 
                        onPress={() => {
                            buttonaddtoCartPressHandler({
                                index, 
                                name, 
                                type, 
                                '../assets/chicken_assets/cartPic.png': String, 
                                price, 
                                quantity,
                            });
                        }}>
                        <Icon
                            color={COLORS.primaryWhiteHex}
                            name={'add'}
                            size={FONTSIZE.size_24}
                            style={{backgroundColor: COLORS.primaryOrangeHex, borderRadius: BORDERRADIUS.radius_8}}
                        />
                    </TouchableOpacity>
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
        fontFamily: FONTFAMILY.poppins_light,
        color: COLORS.primaryRedHex,
        fontSize: FONTSIZE.size_18,
        fontWeight: "bold",
    },
});

export default ShoppingListCard;

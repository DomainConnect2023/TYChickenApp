import React from 'react';
import { ImageBackground, Text, TouchableOpacity, View, } from 'react-native';
import { COLORS, FONTSIZE, SPACING, } from '../theme/theme';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { css } from '../theme/CSS';
import { ChickenCardProps, currencyFormat } from './Objects';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

export const ChickenCard: React.FC<ChickenCardProps> = ({
  id,
  index,
  type,
  roasted,
  imagelink_square,
  name,
  special_ingredient,
  average_rating,
  price,
  buttonPressHandler,
}) => {
  return (
    <LinearGradient
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      style={css.CardLinearGradientContainer}
      colors={[COLORS.primaryGreyHex, COLORS.primaryGreyHex]}>
      <ImageBackground
        source={imagelink_square}
        style={[css.CardImageBG]}
        resizeMode="cover">
        <View style={css.CardRatingContainer}>
          <Icon
            name={'star'}
            color={COLORS.primaryOrangeHex}
            size={FONTSIZE.size_16}
          />
          <Text style={css.CardRatingText}>{average_rating}</Text>
        </View>
      </ImageBackground>
      <Text style={css.CardTitle}>{name}</Text>
      <Text style={css.CardSubtitle}>{special_ingredient}</Text>
      <View style={css.CardFooterRow}>
        <Text style={css.CardPriceCurrency}>
          {price.currency} <Text style={css.CardPrice}>{price.price==""? "" : currencyFormat(parseInt(price.price))}</Text>
        </Text>
        <TouchableOpacity
          onPress={() => {
            buttonPressHandler({
              id,
              index,
              type,
              roasted,
              imagelink_square,
              name,
              special_ingredient,
              prices: [{...price, quantity: 1}],
            });
          }}>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};


export const HomeChickenCard: React.FC<ChickenCardProps> = ({
  imagelink_square,
  name,
  special_ingredient,
  average_rating,
  price,
}) => {
  return (
    <LinearGradient
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      style={[css.CardLinearGradientContainer, {margin: SPACING.space_10}]}
      colors={[COLORS.primaryGreyHex, COLORS.primaryGreyHex]}>
      {/* colors={[COLORS.primaryGreyHex, COLORS.primaryVeryLightGreyHex]}> */}
      <ImageBackground
        source={imagelink_square}
        style={css.CardImageBG}
        resizeMode="cover">
        <View style={css.CardRatingContainer}>
          <Icon
            name={'star'}
            color={COLORS.primaryOrangeHex}
            size={FONTSIZE.size_16}
          />
          <Text style={css.CardRatingText}>{average_rating}</Text>
        </View>
      </ImageBackground>
      <Text style={css.CardTitle}>{name}</Text>
      <Text style={css.CardSubtitle}>{special_ingredient}</Text>
      <View style={css.CardFooterRow}>
        <Text style={css.CardPriceCurrency}>
          RM <Text style={css.CardPrice}>{currencyFormat(parseInt(price))}</Text>
        </Text>
      </View>
    </LinearGradient>
  );
};

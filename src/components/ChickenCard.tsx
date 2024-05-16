import React from 'react';
import { ImageBackground, Text, TouchableOpacity, View, } from 'react-native';
import { COLORS, FONTSIZE, } from '../theme/theme';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { css } from '../theme/CSS';
import { ChickenCardProps, currencyFormat } from './Objects';

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



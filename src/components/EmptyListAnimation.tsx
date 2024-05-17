import {Dimensions, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import LottieView from 'lottie-react-native';
import {COLORS, FONTFAMILY, FONTSIZE, SPACING} from '../theme/theme';

interface EmptyListAnimationProps {
  title: string;
}

const EmptyListAnimation: React.FC<EmptyListAnimationProps> = ({title}) => {
  return (
    <View style={styles.EmptyCartContainer}>
      <LottieView
        style={styles.LottieStyle}
        source={require('../animationPart/CartEmpty.json')}
        autoPlay
        loop
      />
      <Text style={styles.LottieText}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  EmptyCartContainer: {
    flex: 1,
    alignSelf: "center",
    marginVertical: SPACING.space_30,
  },
  LottieStyle: {
    height: 300,
    width: 300,
  },
  LottieText: {
    fontSize: FONTSIZE.size_18,
    fontFamily: FONTFAMILY.poppins_light,
    color: COLORS.secondaryGreyHex,
    padding: SPACING.space_15,
    fontWeight: "bold",
    textAlign: 'center',
  },
});

export default EmptyListAnimation;

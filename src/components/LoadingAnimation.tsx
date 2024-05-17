import {Dimensions, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import LottieView from 'lottie-react-native';
import {COLORS, FONTFAMILY, FONTSIZE, SPACING} from '../theme/theme';

interface LoadingAnimationProps {}

const LoadingAnimation: React.FC<LoadingAnimationProps> = () => {
  return (
    <View style={styles.EmptyCartContainer}>
      <LottieView
        style={styles.LottieStyle}
        source={require('../animationPart/Loading.json')}
        autoPlay
        loop
      />
      <Text style={styles.LottieText}>{"Loading..."}</Text>
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
    height: 250,
    width: 250,
  },
  LottieText: {
    fontSize: FONTSIZE.size_20,
    fontFamily: FONTFAMILY.poppins_light,
    color: COLORS.secondaryGreyHex,
    fontWeight: "bold",
    textAlign: 'center',
  },
});

export default LoadingAnimation;

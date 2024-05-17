import {Dimensions, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import LottieView from 'lottie-react-native';
import {COLORS, FONTFAMILY, FONTSIZE, SPACING} from '../theme/theme';
import { css } from '../theme/CSS';

interface DeliveryStatusAnimationProps {
  process: string;
}

const DeliveryStatusAnimation: React.FC<DeliveryStatusAnimationProps> = ({process}) => {
    return (
        <View style={styles.DeliveryStepContainer}>
            {process=="Pending" ? (
            <View style={styles.DeliveryContainer}>
                <LottieView
                    style={styles.LottieStyle}
                    source={require('../animationPart/DeliveryOrange.json')}
                    autoPlay
                    loop
                />
                <Text style={[styles.LottieText, {color: COLORS.primaryOrangeHex}]}>Pending</Text>
            
            </View>
            ) : (
            <View style={styles.DeliveryContainer}>
            
                <LottieView
                    style={styles.WaitingPointStyle}
                    source={require('../animationPart/WaitingPoint.json')}
                    autoPlay
                    loop
                />
                <Text style={styles.LottieText}>Pending</Text>
            
            </View>
            )}

            {process=="Processing" ? (
            <View style={styles.DeliveryContainer}>
                <LottieView
                    style={styles.LottieStyle}
                    source={require('../animationPart/DeliveryOrange.json')}
                    autoPlay
                    loop
                />
                <Text style={[styles.LottieText, {color: COLORS.primaryOrangeHex}]}>Processing</Text>
            
            </View>
            ) : (
            <View style={styles.DeliveryContainer}>
                <LottieView
                    style={styles.WaitingPointStyle}
                    source={require('../animationPart/WaitingPoint.json')}
                    autoPlay
                    loop
                />
                <Text style={styles.LottieText}>Processing</Text>
            
            </View>
            )}

            {process=="Delivered" ? (
            <View style={styles.DeliveryContainer}>
                <LottieView
                    style={styles.LottieStyle}
                    source={require('../animationPart/DeliveryOrange.json')}
                    autoPlay
                    loop
                />
                <Text style={[styles.LottieText, {color: COLORS.primaryOrangeHex}]}>Delivered</Text>
            
            </View>
            ) : (
            <View style={styles.DeliveryContainer}>
            
                <LottieView
                    style={styles.WaitingPointStyle}
                    source={require('../animationPart/WaitingPoint.json')}
                    autoPlay
                    loop
                />
                <Text style={styles.LottieText}>Delivered</Text>
            
            </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    DeliveryStepContainer: {
        flexDirection: "row",
        alignSelf: "center",
    },
    DeliveryContainer: {
        flexDirection: "column",
        justifyContent: "flex-start",
        padding: SPACING.space_5,
        // borderWidth: 1,
    },
    LottieStyle: {
        height: 100,
        width: 100,
    },
    WaitingPointStyle: {
        height: SPACING.space_20,
        width: SPACING.space_20,
        margin: SPACING.space_40,
    },
    LottieText: {
        fontSize: FONTSIZE.size_14,
        fontFamily: FONTFAMILY.poppins_light,
        color: COLORS.secondaryGreyHex,
        fontWeight: "bold",
        textAlign: 'center',
        marginTop: -SPACING.space_20,
    },
});

export default DeliveryStatusAnimation;

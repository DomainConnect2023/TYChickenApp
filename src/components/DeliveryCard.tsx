import {StyleSheet, Text, View} from 'react-native';
import React, { useState } from 'react';
import {COLORS, FONTFAMILY, FONTSIZE} from '../theme/theme';
import { css } from '../theme/CSS';
import { HistoryCardProps, currencyFormat } from './Objects';

const DeliveryCard: React.FC<HistoryCardProps> = ({
    date,
    DOnumber,
    totalWeight,
    status,
}) => {
    
    return (
        <View style={css.HistoryCardContainer}>
            <View style={css.HistoryTitleContainer}>
                <Text style={styles.CardTitle}>DO: {DOnumber}</Text>

                <Text style={styles.CardDate}>{date}</Text>
            </View>
            
            <View style={css.HistoryCardContent}>
                <Text style={styles.CardSubtitle}>
                    Customer: {' '}

                    <Text style={styles.CardTextHightlight}>
                        DOMAIN CONNECT SDN BHD
                    </Text>
                </Text>

                <Text style={styles.CardSubtitle}>
                    Total KG: {' '}

                    <Text style={styles.CardTextHightlight}>
                        {currencyFormat(totalWeight)}
                    </Text>
                </Text>

                <Text style={styles.CardSubtitle}>
                    Status: {' '}

                    <Text style={[styles.CardTextHightlight, {fontWeight: "bold", color: COLORS.primaryOrangeHex}]}>
                        {status==1 ? ("Completed") : ("Pending")}
                    </Text>
                </Text>
            </View>
            
            <View style={css.HistoryCardFooter}>
                <Text style={css.CardPriceCurrency}>
                    View Detail
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    CardTitle: {
        fontFamily: FONTFAMILY.poppins_medium,
        color: COLORS.primaryGreyHex,
        fontSize: FONTSIZE.size_20,
        fontWeight: "bold",
    },
    CardDate: {
        fontFamily: FONTFAMILY.poppins_regular,
        color: COLORS.primaryLightGreyHex,
        fontSize: FONTSIZE.size_12,
    },
    CardSubtitle: {
        fontFamily: FONTFAMILY.poppins_light,
        color: COLORS.primaryLightGreyHex,
        fontSize: FONTSIZE.size_14,
    },
    CardTextHightlight: {
        color: COLORS.primaryRedHex,
    },
});

export default DeliveryCard;

import {StyleSheet, Text, View} from 'react-native';
import React, { useState } from 'react';
import {COLORS, FONTFAMILY, FONTSIZE} from '../theme/theme';
import { css } from '../theme/CSS';
import { HistoryCardProps, currencyFormat } from './Objects';

const HistoryCard: React.FC<HistoryCardProps> = ({
    id,
    date,
    DOnumber,
    currency,
    totalPrice,
    totalWeight,
    status,
}) => {
    const [todayDate, setTodayDate] = useState(new Date().toISOString().split('T')[0]);
    
    return (
        <View style={[
            css.HistoryCardContainer, id == "1"
            ? {backgroundColor: COLORS.primaryOrangeHex,}
            : {backgroundColor: COLORS.primaryWhiteHex},

            // item.date >= limitedDate
            // ? {borderWidth: 2, borderColor: COLORS.primaryLightGreyHex}
            // : {},
            // item.date == todayDate
        ]}>
            <View style={css.HistoryTitleContainer}>
                <Text style={[styles.CardTitle, id == "1"
                ? {color: COLORS.primaryWhiteHex}
                : {},]}>DO: {DOnumber}</Text>

                <Text style={[styles.CardDate, id == "1"
                ? {color: COLORS.secondaryVeryLightGreyHex}
                : {},]}>{date}</Text>
            </View>
            
            <View style={css.HistoryCardContent}>
                <Text style={[styles.CardSubtitle, id == "1"
                ? {color: COLORS.secondaryVeryLightGreyHex}
                : {},]}>
                    Total Price: {' '}

                    <Text style={[styles.CardTextHightlight, id == "1"
                    ? {color: COLORS.primaryWhiteHex, fontWeight: "bold"}
                    : {},]}>
                        {currency} {currencyFormat(totalPrice)}
                    </Text>
                </Text>

                <Text style={[styles.CardSubtitle, id == "1"
                ? {color: COLORS.secondaryVeryLightGreyHex}
                : {},]}>
                    Total KG: {' '}

                    <Text style={[styles.CardTextHightlight, id == "1"
                ? {color: COLORS.primaryWhiteHex, fontWeight: "bold"}
                : {},]}>
                        {currencyFormat(totalWeight)}
                    </Text>
                </Text>

                <Text style={[styles.CardSubtitle, id == "1"
                ? {color: COLORS.secondaryVeryLightGreyHex}
                : {},]}>
                    Status: {' '}

                    <Text style={[styles.CardTextHightlight, id == "1"
                ? {color: COLORS.primaryWhiteHex, fontWeight: "bold"}
                : {},]}>
                        {status==1 ? ("Completed") : ("Pending")}
                    </Text>
                </Text>
            </View>
            
            <View style={css.HistoryCardFooter}>
                <Text style={[css.CardPriceCurrency, id == "1"
                ? {color: COLORS.secondaryVeryLightGreyHex, fontWeight: "bold"}
                : {},]}>
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

export default HistoryCard;

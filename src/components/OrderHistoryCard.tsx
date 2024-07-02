import {Image, StyleSheet, Text, View} from 'react-native';
import React, { useState } from 'react';
import {COLORS, FONTFAMILY, FONTSIZE} from '../theme/theme';
import { css } from '../theme/CSS';
import { HistoryCardProps, PendingListCardProps, currencyFormat } from './Objects';

const OrderHistoryCard: React.FC<PendingListCardProps> = ({
    position,
    doRef,
    created_At,
    debtor,
    area,
    currency,
    vehicle,
    isApprove,
    debtorName,
}) => {
    const [todayDate, setTodayDate] = useState(new Date().toISOString().split('T')[0]);
    
    return (
        <View style={css.HistoryCardContainer}>
            <View style={css.HistoryTitleContainer}>
                <Text style={styles.CardTitle}>Ref: {doRef}</Text>

                <Text style={styles.CardDate}>{created_At}</Text>
            </View>

            {position=="admin" ? (
            <View style={css.HistoryCardContent}>

                <Text style={styles.CardSubtitle}>
                    Debtor: {' '}

                    <Text style={styles.CardTextHightlight}>
                        {debtorName}  [{debtor}]
                    </Text>
                </Text>

                <Text style={styles.CardSubtitle}>
                    Area: {' '}
                    
                    <Text style={styles.CardTextHightlight}>
                        {area} 
                    </Text>

                    {'  '}Vehicle: {' '}
                    <Text style={styles.CardTextHightlight}>
                        {vehicle} 
                    </Text>
                </Text>
            </View>
            ) : (
                <View style={css.HistoryCardContent}>

                <Text style={styles.CardSubtitle}>
                    Total Price: {' '}

                    <Text style={styles.CardTextHightlight}>
                        {"100"}
                    </Text>
                </Text>

                <Text style={styles.CardSubtitle}>
                    Total KG: {' '}
                    
                    <Text style={styles.CardTextHightlight}>
                        {"100"} 
                    </Text>
                </Text>
            </View>
            )}

            <View style={css.HistoryCardFooter}>
                    <View style={styles.CardStatus}>
                        <Image source={isApprove !=null ? require('../assets/app_images/GreenApprove.png') :require('../assets/app_images/Red_Pending.png')} style={styles.CardStatusImage} />
                    </View>

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
        fontSize: FONTSIZE.size_12,
    },
    CardTextHightlight: {
        color: COLORS.primaryRedHex,
    },
    CardStatus:{
        backgroundColor:COLORS.CardGoodStatusColorRGBA,
        width:100,
        height:100,
        justifyContent:"center",
        alignItems:"center"
    },
    CardStatusImage:{
        resizeMode:'contain',
        width:100,
        height:100
    }
});

export default OrderHistoryCard;

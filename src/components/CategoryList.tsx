import {StyleSheet, Text, View} from 'react-native';
import React, { useState } from 'react';
import {COLORS, FONTFAMILY, FONTSIZE, SPACING} from '../theme/theme';
import { css } from '../theme/CSS';
import { HistoryCardProps, currencyFormat } from './Objects';

interface CategoryListProps {
    id: number;
    value: string;
    currentChoosing: number;
  }

const CategoryListCard: React.FC<CategoryListProps> = ({
    id,
    value,
    currentChoosing,
}) => {
    return (
        <View style={{margin: SPACING.space_5,}}>
        {currentChoosing == id ? (
            <View style={[css.CategoryContainer, {backgroundColor: COLORS.primaryRedHex,}]}>
                <Text style={[css.CategoryText, {color: COLORS.primaryWhiteHex,}]}>{value}</Text>
            </View>
        ) : (
            <View style={[css.CategoryContainer, {backgroundColor: COLORS.primaryVeryLightGreyHex,}]}>
                <Text style={[css.CategoryText, {color: COLORS.primaryGreyHex,}]}>{value}</Text>
            </View>
        )}
        </View>
    );
};

export default CategoryListCard;

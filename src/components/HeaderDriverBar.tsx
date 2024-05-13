import {Alert, Dimensions, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {COLORS, FONTSIZE} from '../theme/theme';
import GradientBGIcon from './GradientBGIcon';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { css } from '../theme/CSS';
import { deleteAllData } from '../data/SQLiteFile';
import Snackbar from 'react-native-snackbar';

interface HeaderBarProps {
  title?: string;
  checkBackBttn?: boolean;
}

const HeaderDriverBar: React.FC<HeaderBarProps> = ({title, checkBackBttn}) => {
  const navigation = useNavigation();
  
  return (
    checkBackBttn==true ? (
      <View style={css.BackHeaderContainer}>
          <TouchableOpacity onPress={async () => {
            navigation.goBack()
          }}>
            <GradientBGIcon
              name="arrow-back-circle-outline"
              color={COLORS.primaryLightGreyHex}
              size={FONTSIZE.size_34}
            />
          </TouchableOpacity>

        {/* <ProfilePic /> */}
        <Text style={[css.HeaderText, {marginLeft: 30}]}>{title}</Text>
      </View>
    ):(

      <View style={css.HeaderContainer}>
        {/* <ProfilePic /> */}
        <Text style={css.HeaderText}>{title}</Text>
      </View>
    )
  );
};

export default HeaderDriverBar;

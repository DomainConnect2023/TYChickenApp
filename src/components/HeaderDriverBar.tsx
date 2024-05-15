import {Alert, Dimensions, Text, TouchableOpacity, View} from 'react-native';
import React, { useEffect, useState } from 'react';
import {COLORS, FONTSIZE} from '../theme/theme';
import GradientBGIcon from './GradientBGIcon';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { css } from '../theme/CSS';
import { deleteAllData } from '../data/SQLiteFile';
import Snackbar from 'react-native-snackbar';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface HeaderBarProps {
  title?: string;
  checkBackBttn?: boolean;
}

const HeaderDriverBar: React.FC<HeaderBarProps> = ({title, checkBackBttn}) => {
  const navigation = useNavigation();
  const [userID, setUserID] = useState('');

  useEffect(()=> {
    (async()=> {
      setUserID(await AsyncStorage.getItem('UserID') ?? "");
    })();
  }, []);
  
  return (
    checkBackBttn==true ? (
      (title=="Goods Delivery" && userID=="admin") ? (
        <View style={[css.BackHeaderContainer, {justifyContent: "space-between"}]}>
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
          <TouchableOpacity 
          onPress={async () => {
            navigation.navigate('DeliveryAdd' as never);
          }}>
            <View style={css.IconContainer}>
              <Icon
                name="create-sharp"
                color={COLORS.primaryLightGreyHex}
                size={FONTSIZE.size_34}
                style={css.MenuIcon}
              />
            </View>
          </TouchableOpacity>
        </View>
      ) : (
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
      )
    ):(

      <View style={css.HeaderContainer}>
        {/* <ProfilePic /> */}
        <Text style={css.HeaderText}>{title}</Text>
      </View>
    )
  );
};

export default HeaderDriverBar;

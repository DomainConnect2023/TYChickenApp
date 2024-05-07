import {Dimensions, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {COLORS, FONTSIZE} from '../theme/theme';
import GradientBGIcon from './GradientBGIcon';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { css } from '../theme/CSS';

interface HeaderBarProps {
  title?: string;
  checkBackBttn?: boolean;
}

const HeaderBar: React.FC<HeaderBarProps> = ({title, checkBackBttn}) => {
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

        {title=="" ? (
          <TouchableOpacity style={{width: Dimensions.get("screen").width/100*70}} onPress={async () => {
            navigation.navigate("Cart" as never)
          }}>
            <View style={css.IconContainer}>
              <Icon
                name="cart"
                color={COLORS.primaryLightGreyHex}
                size={FONTSIZE.size_34}
                style={css.MenuIcon}
              />
              <View style={css.badgeContainer}>
                <Text style={css.badge}>{0}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ) : (
          (title=="Cart") ? (
            <TouchableOpacity style={{width: Dimensions.get("screen").width/100*58}} onPress={async () => {}}>
              <View style={css.IconContainer}>
                <Icon
                  name="trash-outline"
                  color={COLORS.primaryLightGreyHex}
                  size={FONTSIZE.size_34}
                  style={css.MenuIcon}
                />
              </View>
            </TouchableOpacity>
          ) : (
            <></>
          )
        )}
      </View>
    ):(

      <View style={css.HeaderContainer}>
        {/* <ProfilePic /> */}
        <Text style={css.HeaderText}>{title}</Text>
        <View style={{flexDirection: "row"}}>
          <TouchableOpacity onPress={async () => {
            navigation.navigate("Search" as never)
          }}>
            <Icon
              name="search"
              color={COLORS.primaryLightGreyHex}
              size={FONTSIZE.size_30}
              style={css.MenuIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={async () => {
            navigation.navigate("Cart" as never)
          }}>
            <View style={css.IconContainer}>
              <Icon
                name="cart"
                color={COLORS.primaryLightGreyHex}
                size={FONTSIZE.size_36}
                style={css.MenuIcon}
              />
              <View style={css.badgeContainer}>
                <Text style={css.badge}>{0}</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    )
  );
};

export default HeaderBar;

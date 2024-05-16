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
import { StackNavigationProp } from '@react-navigation/stack';

interface HeaderBarProps {
  title?: string;
  checkBackBttn?: boolean;
  badgeNumber?: number;
}

type RootStackParamList = {
  Search: { filterValue: string };
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'Search'>;

const HeaderBar: React.FC<HeaderBarProps> = ({title, checkBackBttn, badgeNumber}) => {
  const navigation = useNavigation();
  const navigation2SearchPage = useNavigation<NavigationProp>();
  const [userID, setUserID] = useState('');

  useEffect(()=> {
    (async()=> {
      setUserID(await AsyncStorage.getItem('UserID') ?? "");
    })();
  }, []);
  
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
                <Text style={css.badge}>{badgeNumber}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ) : (
          (title=="Cart") ? (
            <TouchableOpacity style={{width: Dimensions.get("screen").width/100*58}} onPress={async () => {
              Alert.alert(
                `Clear all the cart items?`,
                "",
                [
                    {
                        text: 'No',
                        onPress: () => {},
                        style: 'cancel'
                    },
                    { text: 'Yes', onPress: () => {
                        deleteAllData();
                        Snackbar.show({
                            text: "You have deleted all the items in your cart successfully. ",
                            duration: Snackbar.LENGTH_SHORT,
                        });
                        if(userID=="admin"){
                          navigation.navigate('User Page' as never);
                        }else{
                          navigation.navigate('Tab' as never);
                        }
                    } }
                ],
                { cancelable: false }
              );
            }}>
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
            const filterValue = "";
            navigation2SearchPage.navigate("Search", { filterValue })
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
                <Text style={css.badge}>{badgeNumber}</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    )
  );
};

export default HeaderBar;

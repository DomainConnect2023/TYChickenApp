import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {COLORS} from '../theme/theme';
import {BlurView} from '@react-native-community/blur';
import Icon from 'react-native-vector-icons/Ionicons';
import { css } from '../theme/CSS';
import HomeDriverScreen from '../screens/HomeDriverScreen';
import ProfilePageScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const TabDriverNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarHideOnKeyboard: true,
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: css.tabBarStyle,
        tabBarBackground: () => (
          <BlurView
            overlayColor=""
            blurAmount={10}
            style={css.BlurViewStyles}
          />
        ),
      }}>
      <Tab.Screen
        name="Home"
        component={HomeDriverScreen}
        options={{
          tabBarIcon: ({focused, color, size}) => (
            <Icon
              name="home"
              size={28}
              color={
                focused ? COLORS.primaryOrangeHex : COLORS.secondaryLightGreyHex
              }
            />
          ),
        }}>
      </Tab.Screen>
      <Tab.Screen
          name="Profile"
          component={ProfilePageScreen}
          options={{
            tabBarIcon: ({focused, color, size}) => (
              <Icon
                name="person-circle-sharp"
                size={28}
                color={
                  focused ? COLORS.primaryOrangeHex : COLORS.secondaryLightGreyHex
                }
              />
            ),
          }}>
        </Tab.Screen>
    </Tab.Navigator>
  );
};

export default TabDriverNavigator;

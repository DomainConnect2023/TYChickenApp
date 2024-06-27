import React, { useEffect } from 'react';
import {BackHandler, StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {COLORS} from '../theme/theme';
import {BlurView} from '@react-native-community/blur';
import HomeScreen from '../screens/HomeScreen';
import Icon from 'react-native-vector-icons/Ionicons';
import ProductPageScreen from '../screens/ProductScreen';
import HistoryPageScreen from '../screens/DeliveryHistoryScreen';
import ProfilePageScreen from '../screens/ProfileScreen';
import { css } from '../theme/CSS';
import OrderHistoryPageScreen from '../screens/OrderHistoryScreen';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {

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
        component={HomeScreen}
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
        name="Product"
        component={ProductPageScreen}
        options={{
          tabBarIcon: ({focused, color, size}) => (
            <Icon
              name="cart"
              size={28}
              color={
                focused ? COLORS.primaryOrangeHex : COLORS.secondaryLightGreyHex
              }
            />
          ),
        }}>
      </Tab.Screen>
      <Tab.Screen
        name="OrderHistory"
        component={OrderHistoryPageScreen}
        options={{
          tabBarIcon: ({focused, color, size}) => (
            <Icon
              name="notifications-sharp"
              size={28}
              color={
                focused ? COLORS.primaryOrangeHex : COLORS.secondaryLightGreyHex
              }
            />
          ),
        }}>
      </Tab.Screen>
      <Tab.Screen
        name="History"
        component={HistoryPageScreen}
        options={{
          tabBarIcon: ({focused, color, size}) => (
            <Icon
              name="chatbox-sharp"
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

export default TabNavigator;

import React from 'react';
import {StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {COLORS} from '../theme/theme';
import {BlurView} from '@react-native-community/blur';
import HomeScreen from '../screens/HomeScreen';
import Icon from 'react-native-vector-icons/Ionicons';
import ProductPageScreen from '../screens/ProductScreen';
import HistoryPageScreen from '../screens/HistoryScreen';
import ContactPageScreen from '../screens/ContactScreen';
import ProfilePageScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarHideOnKeyboard: true,
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBarStyle,
        tabBarBackground: () => (
          <BlurView
            overlayColor=""
            blurAmount={10}
            style={styles.BlurViewStyles}
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
            // <CustomIcon
            //   name="cart"
            //   size={28}
            //   color={
            //     focused ? COLORS.primaryOrangeHex : COLORS.primaryLightGreyHex
            //   }
            // />
          ),
        }}></Tab.Screen>
        <Tab.Screen
          name="History"
          component={HistoryPageScreen}
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
          name="Contact"
          component={ContactPageScreen}
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
      {/* <Tab.Screen
        name="Favorite"
        component={FavoritesScreen}
        options={{
          tabBarIcon: ({focused, color, size}) => (
            <CustomIcon
              name="like"
              size={28}
              color={
                focused ? COLORS.primaryOrangeHex : COLORS.primaryLightGreyHex
              }
            />
          ),
        }}></Tab.Screen>
      <Tab.Screen
        name="History"
        component={OrderHistoryScreen}
        options={{
          tabBarIcon: ({focused, color, size}) => (
            <CustomIcon
              name="bell"
              size={28}
              color={
                focused ? COLORS.primaryOrangeHex : COLORS.primaryLightGreyHex
              }
            />
          ),
        }}></Tab.Screen> */}
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarStyle: {
    height: 65,
    position: 'absolute',
    backgroundColor: COLORS.thirdBlackRGBA,
    borderTopWidth: 0,
    elevation: 0,
    borderTopColor: 'transparent',
  },
  BlurViewStyles: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default TabNavigator;

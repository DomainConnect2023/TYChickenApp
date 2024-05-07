import * as React from 'react';
import { DrawerContentScrollView, DrawerItem, DrawerItemList, createDrawerNavigator } from '@react-navigation/drawer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import TabNavigation from '../navigators/TabNavigator';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme';
import ProfilePageScreen from '../screens/ProfileScreen';
import Icon from 'react-native-vector-icons/Ionicons';
import { css } from '../theme/CSS';

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props: any) {
    const navigation = useNavigation();

    return (
        <DrawerContentScrollView {...props}
        // style={{backgroundColor:colorThemeDB.colors.primaryContainer}}
        >
        <DrawerItemList {...props} />
        <DrawerItem label={"Log Out"} onPress={async () => {[
            await AsyncStorage.removeItem("UserID"), 
            navigation.navigate("Login" as never)
        ]}} />
        </DrawerContentScrollView>
    );
}

export function CustomDrawer() {

  const navigation = useNavigation();
  const [refreshKey, setRefreshKey] = useState(0);
  const [initialRoute, setInitialRoute] = React.useState("Home");

  return (
    <Drawer.Navigator initialRouteName={initialRoute} screenOptions={{
      headerShown: true,
      headerStyle: {
        backgroundColor: COLORS.headerColor,
        
      },
      headerTitleStyle: { 
        color: COLORS.primaryLightGreyHex,
        fontFamily: FONTFAMILY.poppins_semibold,
        fontSize: FONTSIZE.size_24,
        fontWeight: "bold", },
      headerTintColor: COLORS.primaryLightGreyHex,
      headerTitleAlign: 'left',
    }}
      drawerContent={props => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name={"Home"} component={TabNavigation} options={{
        headerTitle: "Home",
        headerRight: () => (
          <View style={{flexDirection: "row"}}>
            <TouchableOpacity onPress={async () => {
                navigation.navigate("Search" as never)
            }}>
                <Icon
                name="search"
                color={COLORS.primaryLightGreyHex}
                size={FONTSIZE.size_30}
                style={{marginHorizontal: 10}}
                />
            </TouchableOpacity>
            <TouchableOpacity onPress={async () => {
                navigation.navigate("Cart" as never)
            }}>
                <View style={styles.container}>
                    <Icon
                        name="cart"
                        color={COLORS.primaryLightGreyHex}
                        size={FONTSIZE.size_36}
                        style={{marginHorizontal: 5}}
                    />
                    <View style={css.badgeContainer}>
                        <Text style={css.badge}>{0}</Text>
                    </View>
                </View>
            </TouchableOpacity>
          </View>
        ),
      }} />
      {/* <Drawer.Screen name={"Profile"} component={ProfilePageScreen} /> */}
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginRight: 10,
  },
});
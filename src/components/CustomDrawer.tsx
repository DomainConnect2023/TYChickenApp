import * as React from 'react';
import { DrawerContentScrollView, DrawerItem, DrawerItemList, createDrawerNavigator } from '@react-navigation/drawer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import TabNavigation from '../navigators/TabNavigator';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme';
import ProfilePageScreen from '../screens/ProfileScreen';
import Icon from 'react-native-vector-icons/Ionicons';
import { css } from '../theme/CSS';
import { createTable, db } from '../data/SQLiteFile';
import Snackbar from 'react-native-snackbar';
import TabDriverNavigator from '../navigators/TabDriverNavigator';
import AdminPage from '../navigators/AdminPage';
import { StackNavigationProp } from '@react-navigation/stack';

const Drawer = createDrawerNavigator();

type RootStackParamList = {
  Search: { filterValue: string };
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'Search'>;

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
  const navigation2SearchPage = useNavigation<NavigationProp>();
  const [refreshKey, setRefreshKey] = useState(0);
  const [initialRoute, setInitialRoute] = React.useState("Admin Page");

  const [countItem, setCountItem] = useState<number>(0);

  useEffect(()=> {
    (async()=> {
      await createTable();
      await checkCartNum();
    })();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      createTable();
      checkCartNum();
    }, [])
  );

  const checkCartNum = async () => {
    try {
      let sql = "SELECT * FROM Carts GROUP BY id";
      db.transaction((tx) => {
          tx.executeSql(sql, [], async (tx, resultSet) => {
              var length = resultSet.rows.length;
              setCountItem(length);
          }, (error) => {
              console.log("Error", error);
          })
      });
    }catch (error: any) {
        Snackbar.show({
          text: error.message,
          duration: Snackbar.LENGTH_SHORT,
        });
    }
  };

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
      <Drawer.Screen name={"Admin Page"} component={AdminPage} />
      {/* <Drawer.Screen name={"User Page"} component={TabNavigation} options={{
        headerTitle: "User Page",
        headerRight: () => (
          <View style={{flexDirection: "row"}}>
            <TouchableOpacity onPress={async () => {
                const filterValue = "";
                navigation2SearchPage.navigate("Search", { filterValue })
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
                </View>
            </TouchableOpacity>
          </View>
        ),
      }} /> */}
      {/* <Drawer.Screen name={"Driver Page"} component={TabDriverNavigator} /> */}
      <Drawer.Screen name={"Person Profile"} component={ProfilePageScreen} />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginRight: 10,
  },
});
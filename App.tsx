import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import TabNavigator from './src/navigators/TabNavigator';
import LoginScreen from './src/screens/LoginScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Dimensions, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import SearchPageScreen from './src/screens/SearchScreen';
import ProductPageScreen from './src/screens/ProductScreen';
import CartPageScreen from './src/screens/CartScreen';
import ProductDetailPageScreen from './src/screens/ProductDetailScreen';
import HistoryPageScreen from './src/screens/HistoryScreen';
import ContactPageScreen from './src/screens/ContactScreen';
import ProfilePageScreen from './src/screens/ProfileScreen';
import { CustomDrawer } from './src/components/CustomDrawer';
import ContactAddPageScreen from './src/screens/ContactAddScreen';
import TabDriverNavigator from './src/navigators/TabDriverNavigator';
import HistoryReturnPageScreen from './src/screens/HistoryReturn';
import DoneDeliveryPageScreen from './src/screens/DoneDeliveryScreen';
import AdminPage from './src/navigators/AdminPage';
import ProductAdjustPageScreen from './src/screens/ProductAdjust';
import DeliveryPageScreen from './src/screens/DeliveryScreen';
import DeliveryDetailPageScreen from './src/screens/DeliveryDetailScreen';
import ReportListScreen from './src/screens/ReportListScreen';
import DeliveryAddPageScreen from './src/screens/DeliveryAddScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  const [loading, setLoading] = React.useState(true);
  const [initialRouteName, setInitialRouteName] = React.useState("");

  React.useEffect(() => {
    const checkUserCode = async () => {
      const userCode = await AsyncStorage.getItem('UserID');
      if (userCode === null) {
        setInitialRouteName('Login');
      }else{
        if(userCode=="admin"){
          setInitialRouteName('CustomDrawer');
        }else{
          if(userCode=="driver"){
            setInitialRouteName('TabDriver');
          }else{
            setInitialRouteName('Tab');
          }
        }
      }
      setLoading(false);
    };

    checkUserCode();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
    {loading ? (
      <View style={{ flex: 1, marginVertical: Dimensions.get('screen').height / 100 * 10 }}>
        <ActivityIndicator size={40} color="#000000" />
      </View>
    ) : (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRouteName} screenOptions={{headerShown: false}}>
        <Stack.Screen name="Login" component={LoginScreen} options={{animation: 'slide_from_bottom'}} />
        <Stack.Screen name="Tab" component={TabNavigator} options={{animation: 'slide_from_bottom'}} />
        <Stack.Screen name="TabDriver" component={TabDriverNavigator} options={{animation: 'slide_from_bottom'}} />
        <Stack.Screen name="CustomDrawer" component={CustomDrawer} options={{animation: 'slide_from_bottom'}} />
        <Stack.Screen name="Search" component={SearchPageScreen} options={{animation: 'slide_from_bottom'}} />
        <Stack.Screen name="Product" component={ProductPageScreen} options={{animation: 'slide_from_bottom'}} />
        <Stack.Screen name="Cart" component={CartPageScreen} options={{animation: 'slide_from_bottom'}} />
        <Stack.Screen name="ProductDetail" component={ProductDetailPageScreen} options={{animation: 'slide_from_bottom'}} />
        <Stack.Screen name="History" component={HistoryPageScreen} options={{animation: 'slide_from_bottom'}} />
        <Stack.Screen name="HistoryReturn" component={HistoryReturnPageScreen} options={{animation: 'slide_from_bottom'}} />
        <Stack.Screen name="Contact" component={ContactPageScreen} options={{animation: 'slide_from_bottom'}} />
        <Stack.Screen name="ContactAdd" component={ContactAddPageScreen} options={{animation: 'slide_from_bottom'}} />
        <Stack.Screen name="Profile" component={ProfilePageScreen} options={{animation: 'slide_from_bottom'}} />
        <Stack.Screen name="DoneDelivery" component={DoneDeliveryPageScreen} options={{animation: 'slide_from_bottom'}} />
        <Stack.Screen name="Admin" component={AdminPage} options={{animation: 'slide_from_bottom'}} />
        <Stack.Screen name="ProductAdjust" component={ProductAdjustPageScreen} options={{animation: 'slide_from_bottom'}} />
        <Stack.Screen name="Delivery" component={DeliveryPageScreen} options={{animation: 'slide_from_bottom'}} />
        <Stack.Screen name="DeliveryDetail" component={DeliveryDetailPageScreen} options={{animation: 'slide_from_bottom'}} />
        <Stack.Screen name="DeliveryAdd" component={DeliveryAddPageScreen} options={{animation: 'slide_from_bottom'}} />
        <Stack.Screen name="ReportList" component={ReportListScreen} options={{animation: 'slide_from_bottom'}} />
      </Stack.Navigator>
    </NavigationContainer>
    )}
    </SafeAreaView>
  );
};

export default App;

import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, StatusBar, Image, ScrollView } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import HeaderBar from '../components/HeaderBar';
import { css } from '../theme/CSS';
import { COLORS } from '../theme/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GridItem } from '../components/Objects';


const AdminPage = ({navigation}: {navigation:any}) => {
    const [processData, setProcessData] = useState(false);
    const [userID, setUserID] = useState('');
    const list = [
        {
            id: 1,
            index: 1,
            icon: (
                <Image
                    style={{ width: 80, height: 80 }}
                    source={{
                        uri: "https://icons.iconarchive.com/icons/mattahan/buuf/128/Menu-icon.png"
                    }}
                />
            ),
            title: "Product Adjustment",
            navigate: "ProductAdjust",
        },
        {
            id: 2,
            index: 2,
            icon: (
                <Image
                    style={{ width: 80, height: 80 }}
                    source={{
                        uri: "https://icons.iconarchive.com/icons/petalart/free-shopping/256/shipping-box-icon.png"
                    }}
                />
            ),
            title: "Delivery Part",
            navigate: "Delivery",
        },
        {
            id: 3,
            index: 3,
            icon: (
                <Image
                    style={{ width: 80, height: 80 }}
                    source={{
                        uri: "https://icons.iconarchive.com/icons/hopstarter/soft-scraps/256/User-Group-icon.png"
                    }}
                />
            ),
            title: "Access Control",
            navigate: "",
        },
        {
            id: 4,
            index: 4,
            icon: (
                <Image
                    style={{ width: 80, height: 80 }}
                    source={{
                        uri: "https://icons.iconarchive.com/icons/custom-icon-design/flatastic-5/256/Sales-report-icon.png"
                    }}
                />
            ),
            title: "Report",
            navigate: "ReportList",
        },
        {
            id: 5,
            index: 5,
            icon: (
                <Image
                    style={{ width: 80, height: 80 }}
                    source={{
                        uri: "https://icons.iconarchive.com/icons/hopstarter/sleek-xp-basic/256/Administrator-icon.png"
                    }}
                />
            ),
            title: "User Page",
            navigate: "User Page",
        },
        {
            id: 6,
            index: 6,
            icon: (
                <Image
                    style={{ width: 80, height: 80 }}
                    source={{
                        uri: "https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-3d/256/Delivery-Truck-3d-icon.png"
                    }}
                />
            ),
            title: "Driver Page",
            navigate: "Driver Page",
        },
        {
            id: 7,
            index: 7,
            icon: (
                <Image
                    style={{ width: 80, height: 80 }}
                    source={{
                        uri: "https://icons.iconarchive.com/icons/graphicloads/business/256/profile-icon.png"
                    }}
                />
            ),
            title: "Person Profile",
            navigate: "Person Profile",
        },
    ];

    useEffect(()=> {
        (async()=> {
            await fetchedDataAPI();
            // console.log(userID);
        })();
    }, []);

    const fetchedDataAPI = async() => {
        setProcessData(true);
        setUserID(await AsyncStorage.getItem('UserID') ?? "");
        setProcessData(false);
    };

    return (
        <View style={css.ScreenContainer}>
            <StatusBar backgroundColor={COLORS.secondaryLightGreyHex} />
            {processData==true ? (
                <View style={{justifyContent: 'center', alignItems: 'center', marginVertical: 10, padding: 20,}}>
                    <ActivityIndicator size="large" />
                </View>
            ) : (
            <View style={{flex: 1}}>    
                {userID == "admin" ? (
                    <></>
                ) : (
                    <HeaderBar title="Admin" checkBackBttn={false} />
                )}
                <View style={css.LineContainer}></View>
                
                <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={css.ScrollViewFlex}>

                    <View style={css.IconList}>
                        {list.slice(0, 10).map((item) => (
                            <TouchableOpacity 
                            key={item.id}
                            onPress={() => {
                                if(item.navigate!=""){
                                    if(item.navigate==item.title){
                                        navigation.navigate('CustomDrawer', { screen: item.navigate });
                                    }else{
                                        navigation.navigate(item.navigate);
                                    }
                                }
                            }} >
                                <GridItem icon={item.icon} title={item.title ?? ""} />
                            </TouchableOpacity>
                        ))}
                    </View>

                </ScrollView>
            </View>
            )}
        </View>
    )
}

export default AdminPage;
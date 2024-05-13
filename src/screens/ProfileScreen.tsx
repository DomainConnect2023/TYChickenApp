import * as React from 'react';
import { useEffect, useState } from 'react';
import { View, Alert, ScrollView, StatusBar, StyleSheet, Dimensions, Image, Text, TouchableOpacity } from "react-native";
import Snackbar from 'react-native-snackbar';
import HeaderBar from '../components/HeaderBar';
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme';
import ProfilePic from '../components/ProfilePic';
import Icon from 'react-native-vector-icons/AntDesign';
import Collapsible from 'react-native-collapsible';
import { Switch } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { css } from '../theme/CSS';
import { createTable, db, deleteAllData } from '../data/SQLiteFile';
import { useFocusEffect } from '@react-navigation/native';
import HeaderDriverBar from '../components/HeaderDriverBar';

const ProfilePageScreen = ({navigation}: {navigation:any}) => {
    const [showLanguage, setShowLanguage] = useState(false);
    const [userID, setUserID] = useState('');
    const [userName, setUserName] = useState('Hahahaha');
    const [countItem, setCountItem] = useState<number>(0);

    useEffect(()=> {
        (async()=> {
            await createTable();
            await checkCartNum();
            await fetchedDataAPI();
            // console.log(userID);
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

    const onToggleLanguage = () => {
        setShowLanguage(!showLanguage);
    };

    const fetchedDataAPI = async() => {
        setUserID(await AsyncStorage.getItem('UserID') ?? "");
        try {
         
        }catch (error: any) {
            Snackbar.show({
              text: error.message,
              duration: Snackbar.LENGTH_SHORT,
            });
        }
    };

    return (
        <View style={[css.ScreenContainer, {backgroundColor: COLORS.primaryVeryLightGreyHex}]}>
            <StatusBar backgroundColor={COLORS.secondaryLightGreyHex} />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={css.ScrollViewFlex}>
                {/* App Header */}
                {userID == "admin" ? (
                    <></>
                ) : (
                    userID == "driver" ? (
                        <HeaderDriverBar title="Profile" />
                    ) : (
                        <HeaderBar title="Profile" badgeNumber={countItem} />
                    )
                )}

                <TouchableOpacity onPress={()=>{
                    Snackbar.show({
                        text: "Link to Edit Profile",
                        duration: Snackbar.LENGTH_SHORT,
                    });
                }}>
                    <View style={[styles.InputContainerComponent, {justifyContent: "space-between"}]}>
                        <View style={{ alignItems: "center", flexDirection: "row" }}>
                            <ProfilePic />
                            <Text style={{
                                verticalAlign:"middle",
                                color: COLORS.primaryDarkGreyHex,
                                fontFamily: FONTFAMILY.poppins_medium,
                                fontSize: FONTSIZE.size_24,
                                fontWeight: 'bold',
                                marginLeft: SPACING.space_28
                            }}>{userName}</Text>
                        </View>
                        <Icon name={"edit" ?? ""} size={FONTSIZE.size_30} color={COLORS.primaryDarkGreyHex} />
                    </View>
                </TouchableOpacity>

                <View style={[styles.InputContainerComponent, {flexDirection: "column",alignItems: "flex-start",}]}>
                    <View style={{padding: SPACING.space_5}}>
                        <Text style={{
                            color: COLORS.primaryDarkGreyHex,
                            fontFamily: FONTFAMILY.poppins_medium,
                            fontSize: FONTSIZE.size_18,
                            fontWeight: 'bold',
                        }}>Preference</Text>
                    </View>
                    <View style={css.LineContainer}></View>
                    
                    <View style={{ flexDirection: "row", padding: SPACING.space_10, alignSelf: "center" }}>
                        <TouchableOpacity onPress={() => onToggleLanguage()}>
                            <View style={{ flexDirection: "row", width: Dimensions.get("screen").width, padding: 10, justifyContent: 'center', alignItems: "center" }}>
                                <View style={{ width: "20%", alignItems: "center", }}>
                                    <Icon name={"earth" ?? ""} size={FONTSIZE.size_30} color={COLORS.primaryDarkGreyHex} />
                                </View>
                                <View style={{ width: "60%", flexDirection: "row" }}>
                                    <Text style={{flex: 1,color: COLORS.primaryDarkGreyHex,fontFamily: FONTFAMILY.poppins_medium,fontSize: FONTSIZE.size_18,fontWeight:"bold"}}>{"Language"}</Text>
                                    <View style={{alignItems: "flex-end"}}>
                                        <Text style={{color: COLORS.primaryLightGreyHex}}>{('English')}</Text>
                                    </View>
                                </View>
                                <View style={{ width: "20%", alignItems: "center" }}>
                                    <Icon name={showLanguage ? 'down' : 'right'} size={FONTSIZE.size_24} color={COLORS.primaryDarkGreyHex} />
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <Collapsible collapsed={!showLanguage}>
                        <TouchableOpacity onPress={() => {}}>
                            <View style={{ 
                                padding: SPACING.space_16, 
                                margin: SPACING.space_4, 
                                borderRadius: BORDERRADIUS.radius_20, 
                                backgroundColor: COLORS.primaryLightGreyHex, 
                                width: Dimensions.get("screen").width / 100 * 90, 
                                // borderWidth: 1,
                            }}>
                                <Text style={{
                                    color: COLORS.secondaryVeryLightGreyHex,
                                    fontFamily: FONTFAMILY.poppins_medium,
                                    fontSize: FONTSIZE.size_16,
                                    fontWeight:"bold"}}>
                                        English
                                </Text>
                            </View>
                        </TouchableOpacity>
                        {/* <TouchableOpacity onPress={() => {}}>
                            <View style={{ 
                                padding: SPACING.space_16, 
                                margin: SPACING.space_4, 
                                borderRadius: BORDERRADIUS.radius_20, 
                                backgroundColor: COLORS.primaryLightGreyHex, 
                                width: Dimensions.get("screen").width / 100 * 90, 
                                // borderWidth: 1,
                            }}>
                                <Text style={{
                                    color: COLORS.secondaryVeryLightGreyHex,
                                    fontFamily: FONTFAMILY.poppins_medium,
                                    fontSize: FONTSIZE.size_16,
                                    fontWeight:"bold"}}>
                                        中文
                                    </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {}}>
                            <View style={{ 
                                padding: SPACING.space_16, 
                                margin: SPACING.space_4, 
                                borderRadius: BORDERRADIUS.radius_20, 
                                backgroundColor: COLORS.primaryLightGreyHex, 
                                width: Dimensions.get("screen").width / 100 * 90,  
                            }}>
                            <Text style={{
                                color: COLORS.secondaryVeryLightGreyHex,
                                fontFamily: FONTFAMILY.poppins_medium,
                                fontSize: FONTSIZE.size_16,
                                fontWeight:"bold"}}>
                                    Malay
                                </Text>
                            </View>
                        </TouchableOpacity> */}
                    </Collapsible>
                </View>

                <View style={styles.InputContainerComponent}>
                    <TouchableOpacity onPress={async () => {[
                        await AsyncStorage.removeItem("UserID"), 
                        deleteAllData(),
                        navigation.navigate("Login" as never),
                    ]}}>
                        <View style={{ flexDirection: "row", width: Dimensions.get("screen").width, justifyContent: 'center', alignItems: "center" }}>
                            <View style={{ width: "20%", alignItems: "center", padding: SPACING.space_10 }}>
                                <Icon name={"logout" ?? ""} size={FONTSIZE.size_30} color={COLORS.primaryRedHex} />
                            </View>
                            <View style={{ width: "80%", flexDirection: "row" }}>
                                <Text style={{flex: 1,color: COLORS.primaryRedHex,fontFamily: FONTFAMILY.poppins_medium,fontSize: FONTSIZE.size_18,fontWeight:"bold"}}>{"Log out"}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    InputContainerComponent: {
        flexDirection: 'row',
        backgroundColor: COLORS.secondaryVeryLightGreyHex,
        alignItems: 'center',
        marginVertical: SPACING.space_15,
        padding: SPACING.space_15,
    },
});

export default ProfilePageScreen;
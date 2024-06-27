import * as React from 'react';
import { useEffect, useState } from 'react';
import { View, Alert, ScrollView, StatusBar, StyleSheet, Dimensions, Image, Text, TouchableOpacity } from "react-native";
import Snackbar from 'react-native-snackbar';
import HeaderBar from '../components/HeaderBar';
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme';
import ProfilePic from '../components/ProfilePic';
import Icon from 'react-native-vector-icons/AntDesign';
import Collapsible from 'react-native-collapsible';
import { Switch, TextInput } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { css } from '../theme/CSS';
import { createTable, db, deleteAllData } from '../data/SQLiteFile';
import { CommonActions, useFocusEffect } from '@react-navigation/native';
import HeaderDriverBar from '../components/HeaderDriverBar';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { NameImage } from '../components/NameImage';
import RNFetchBlob from 'rn-fetch-blob';
import LoadingAnimation from '../components/LoadingAnimation';

const ProfilePageScreen = ({navigation}: {navigation:any}) => {
    const [showLanguage, setShowLanguage] = useState(false);
    const [showEmailInput, setShowEmailInput] = useState(false);

    const [newEmail, setNewEmail] = useState("");
    const [loading, setLoading] = React.useState(false);

    const [userID, setUserID] = useState('');
    const [userName, setUserName] = useState('');
    const [userLabel, setUserLabel] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [countItem, setCountItem] = useState<number>(0);

    const [tabBarHeight, setTabBarHeight] = useState<number>(0);

    useEffect(()=> {
        fetchData();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            fetchData();
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

    const onToggleEmail = () => {
        setShowEmailInput(!showEmailInput);
    };

    const fetchData = async () => {
        try {
            await createTable();
            await checkCartNum();
            setShowLanguage(false);
            setShowEmailInput(false);
            await fetchedDataAPI();
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const fetchedDataAPI = async() => {
        setUserID(await AsyncStorage.getItem('UserID') ?? "");
        setUserName(await AsyncStorage.getItem('UserName') ?? "");
        setUserLabel(await AsyncStorage.getItem('label') ?? "");

        if(await AsyncStorage.getItem('label') == "admin"){
            setTabBarHeight(0);
        }else{
            // const bottomTabBarHeight = useBottomTabBarHeight();
            setTabBarHeight(65);
        }

        try {
            setLoading(true);
            const IPaddress = await AsyncStorage.getItem('IPAddress') ?? "192.168.1.124:9879";

            setLoading(false);
        }catch (error: any) {
            Snackbar.show({
              text: error.message,
              duration: Snackbar.LENGTH_SHORT,
            });
        }
    };

    const changeEmailAPI = async(purpose: string)=> {
        try {
            setLoading(true);
            const IPaddress = await AsyncStorage.getItem('IPAddress') ?? "192.168.1.124:9879";
            
            RNFetchBlob.config({ trusty: true })
            .fetch("GET", "https://"+IPaddress +"/api/GetOTP?Email="+newEmail+"&Purpose="+purpose)
            .then(async (res) => {
                if(res.json().issuccess==true){
                    setNewEmail("");
                    navigation.navigate('Verify', {
                        purpose: purpose,
                        newEmail: newEmail,
                        newPassword: "",
                    });
                }else{
                    Snackbar.show({
                        text: res.json().message,
                        duration: Snackbar.LENGTH_SHORT,
                    });
                }
                setLoading(false);
            });
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
            {/* App Header */}
            {userLabel == "admin" ? (
                <></>
            ) : (
                userLabel == "driver" ? (
                    <HeaderDriverBar title="Profile" />
                ) : (
                    <HeaderBar title="Profile" badgeNumber={countItem} />
                )
            )}

            {loading ? (
                <View style={{alignSelf:"center",}}>
                    <LoadingAnimation />
                </View>
            ) : (
            <ScrollView 
            style={{
                flex: 1, 
                marginBottom: userLabel === "admin" ? 0 : tabBarHeight,
            }}
            showsVerticalScrollIndicator={false} 
            contentContainerStyle={css.ScrollViewFlex}>
                <TouchableOpacity onPress={()=>{
                    navigation.navigate('EditProfile', {
                        key: userID, 
                        name: userName,
                    });
                }}>
                    <View style={[styles.InputContainerComponent, {justifyContent: "space-between"}]}>
                        <View style={{ alignItems: "center", flexDirection: "row" }}>
                            {/* <ProfilePic /> */}
                            <NameImage name={userName} size={60} backgroundColor={COLORS.secondaryLightGreyHex} textColor="#ffffff" />
                            <Text numberOfLines={2} ellipsizeMode='tail' style={{
                                verticalAlign:"middle",
                                color: COLORS.primaryDarkGreyHex,
                                fontFamily: FONTFAMILY.poppins_medium,
                                fontSize: FONTSIZE.size_18,
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
                        }}>General</Text>
                    </View>
                    <View style={css.LineContainer}></View>
                  
                    <View style={{ flexDirection: "row", padding: SPACING.space_10, alignSelf: "center" }}>
                        <TouchableOpacity onPress={async () => {
                            const userEmail = await AsyncStorage.getItem('UserEmail') ?? "";

                            if(userEmail==""){
                                Snackbar.show({
                                    text: "You need to set an email first",
                                    duration: Snackbar.LENGTH_LONG
                                });
                            }else{
                                navigation.navigate('ChangePswd', {
                                    key: userID,
                                    name: userName,
                                });
                            }
                            
                        }}>
                            <View style={{ flexDirection: "row", width: Dimensions.get("screen").width, padding: 10, justifyContent: 'center', alignItems: "center" }}>
                                <View style={{ width: "20%", alignItems: "center", }}>
                                    <Icon name={"lock1" ?? ""} size={FONTSIZE.size_30} color={COLORS.primaryDarkGreyHex} />
                                </View>
                                <View style={{ width: "60%", flexDirection: "row" }}>
                                    <Text style={{flex: 1,color: COLORS.primaryDarkGreyHex,fontFamily: FONTFAMILY.poppins_medium,fontSize: FONTSIZE.size_18,fontWeight:"bold"}}>{"Change Password"}</Text>
                                </View>
                                <View style={{ width: "20%", alignItems: "center" }}>
                                    <Icon name={'right'} size={FONTSIZE.size_24} color={COLORS.primaryDarkGreyHex} />
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={{ flexDirection: "row", padding: SPACING.space_10, alignSelf: "center" }}>
                        <TouchableOpacity onPress={() => {onToggleEmail()}}>
                            <View style={{ flexDirection: "row", width: Dimensions.get("screen").width, padding: SPACING.space_10, justifyContent: 'center', alignItems: "center" }}>
                                <View style={{ width: "20%", alignItems: "center", }}>
                                    <Icon name={"mail" ?? ""} size={FONTSIZE.size_30} color={COLORS.primaryDarkGreyHex} />
                                </View>
                                <View style={{ width: "60%", flexDirection: "row" }}>
                                    <Text style={{flex: 1,color: COLORS.primaryDarkGreyHex,fontFamily: FONTFAMILY.poppins_medium,fontSize: FONTSIZE.size_18,fontWeight:"bold"}}>{"Change Email"}</Text>
                                </View>
                                <View style={{ width: "20%", alignItems: "center" }}>
                                    <Icon name={showEmailInput ? 'down' : 'right'} size={FONTSIZE.size_24} color={COLORS.primaryDarkGreyHex} />
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <Collapsible collapsed={!showEmailInput}>
                        <View style={{ flexDirection: "row", width: Dimensions.get("screen").width, padding: SPACING.space_8, }}>
                            <TextInput
                                placeholder="Type your new Email."
                                style={[css.loginTextInput,{width: "60%", marginHorizontal: SPACING.space_5, fontSize: FONTSIZE.size_14,}]}
                                mode="outlined"
                                value={newEmail}
                                onChangeText={text => {
                                    setNewEmail(text);
                                }}
                                placeholderTextColor={COLORS.primaryLightGreyHex}
                            />
                            <TouchableOpacity style={[css.LoginButton,{width: "25%", alignItems: "center", justifyContent: "center", marginTop: 0, marginHorizontal: SPACING.space_5}]} onPress={() => {
                                let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
                                if (reg.test(newEmail) === false) {
                                    Snackbar.show({
                                        text: "Email format is wrong.",
                                        duration: Snackbar.LENGTH_SHORT,
                                    });
                                }
                                else {
                                    changeEmailAPI("Email");
                                }
                            }} >
                                <Text style={css.LoginButtonText}>Verify</Text>
                            </TouchableOpacity>
                        </View>
                    </Collapsible>
                </View>

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
                        <TouchableOpacity onPress={() => {onToggleLanguage()}}>
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
                    </Collapsible>
                    <View style={{ flexDirection: "row", padding: SPACING.space_10, alignSelf: "center" }}>
                        <TouchableOpacity onPress={() => {}}>
                            <View style={{ flexDirection: "row", width: Dimensions.get("screen").width, padding: 10, justifyContent: 'center', alignItems: "center" }}>
                                <View style={{ width: "20%", alignItems: "center", }}>
                                    <Icon name={"questioncircleo" ?? ""} size={FONTSIZE.size_30} color={COLORS.primaryDarkGreyHex} />
                                </View>
                                <View style={{ width: "60%", flexDirection: "row" }}>
                                    <Text style={{flex: 1,color: COLORS.primaryDarkGreyHex,fontFamily: FONTFAMILY.poppins_medium,fontSize: FONTSIZE.size_18,fontWeight:"bold"}}>{"FAQ"}</Text>
                                </View>
                                <View style={{ width: "20%", alignItems: "center" }}>
                                    <Icon name={'right'} size={FONTSIZE.size_24} color={COLORS.primaryDarkGreyHex} />
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.InputContainerComponent}>
                    <TouchableOpacity onPress={async () => {[
                        await AsyncStorage.removeItem("UserID"), 
                        deleteAllData(),
                        navigation.dispatch(CommonActions.reset({
                            index: 0,
                            routes: [{ name: 'Login' }], // Navigate to Login screen after logout
                        })),
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
            )}
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
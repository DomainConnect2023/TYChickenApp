import React, { useEffect, useState } from 'react';
import { BackHandler, Dimensions, Image, NativeModules, ScrollView, TouchableOpacity } from 'react-native';
import { View, Text, TextInput as TextInputs } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HelperText, TextInput } from 'react-native-paper';
import { COLORS, FONTSIZE, SPACING } from '../theme/theme';
import { css } from '../theme/CSS';
import Octicons from 'react-native-vector-icons/Octicons';
import VersionInfo from 'react-native-version-info';
import RNFetchBlob from "rn-fetch-blob";
import Snackbar from 'react-native-snackbar';
import LoadingAnimation from '../components/LoadingAnimation';
import { URLAccess } from '../data/URLAccess';

// export interface ApiResponse {
//     ipAddress: string;
//     isSuccess: string;
// }

const LoginScreen = ({navigation}: any) => {
    const [ishide, setishide] = useState(true);
        
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const inputRef = React.createRef<TextInputs>();
    const [usernameHelperText, setusernameHelperText] = useState(false);
    const [passwordHelperText, setpasswordHelperText] = useState(false);
    const [loading, setLoading] = React.useState(false);
    // const [branch, setbranch] = useState("");
    const [IPaddress, setIPadress] = useState("");

    useEffect(()=> {
        (async()=> {
            // await getIPAdd();
            await AsyncStorage.setItem('IPAddress', "192.168.1.124:9879")
            setIPadress("192.168.1.124:9879");

            // if (__DEV__) {
                setUserName("3000/R01");
                setPassword("12345");
            // }
        })();
    }, []);

    // const getIPAdd = async() =>{
    //     try{
    //         let url =(URLAccess.getIPAddress+NativeModules.RNDeviceInfo?.bundleId+"&branch="+branch);
    //         let result = await RNFetchBlob.config({trusty:true}).fetch('get',url);
    //         let responses: ApiResponse = JSON.parse(result.data);
    //         setIPadress(responses.ipAddress);
    //         AsyncStorage.setItem("IpAddress",responses.ipAddress);

    //         console.log("Login API: " + responses.ipAddress);

    //     }
    //     catch (error) {
    //         console.error(error);
    //     }
    // };

    const loginAPI = async() => {
        
        try {
            RNFetchBlob.config({ trusty: true }).fetch("POST","https://"+IPaddress+"/api/Login", 
            { "Content-Type": "application/json" },
            JSON.stringify({
                "Username": username,
                "Password": password,
                // "Token": await AsyncStorage.getItem("fcmtoken")
            })).then(async (res) => {
               
                if (await res.json().isSuccess == true) {
                    await AsyncStorage.setItem('UserID', username);
                    await AsyncStorage.setItem('UserName', res.json().displayName);
                    setUserName("");
                    setPassword("");

                    if(res.json().label=="user"){
                        
                        await AsyncStorage.setItem('UserEmail', res.json().Email ?? "");
                        await AsyncStorage.setItem('label', res.json().label);

                        // check user is first time login or not
                        // if(await res.json().isFirsttime==true || await res.json().email==null){
                        //     navigation.navigate("FirstTime", {
                        //         key: username, 
                        //         name: username,
                        //     });
                        // }else{
                            navigation.navigate("Tab", { screen: 'Home'});
                        // }
                    }else if(res.json().label=="Admin"){
                        await AsyncStorage.setItem('label', "admin");
                        navigation.navigate("CustomDrawer", { screen: 'Home'});
                    }else{
                        await AsyncStorage.setItem('label', res.json().label);
                        navigation.navigate("TabDriver", { screen: 'Home'});
                    }
                    
                }else{
                    console.log("Error3: "+res.json().message.message);
                    Snackbar.show({
                        text: res.json().message.message,
                        duration: Snackbar.LENGTH_LONG
                    });
                }
                setLoading(false);

            }).catch(err => {
                console.log("Error2: "+err.message);
                Snackbar.show({
                    text: err.message,
                    duration: Snackbar.LENGTH_LONG
                });
                setLoading(false);
            })
        }catch(e){
            console.log("Error1: "+e);
            setLoading(false);
        }
    };

    const checkEmpty = () => {
        let emtpy = false;

        if (username === '') {
            setusernameHelperText(true)
            emtpy = true;
        } else {
            setusernameHelperText(false)
        }

        if (password === '') {
            setpasswordHelperText(true)
            emtpy = true;
        } else {
            setpasswordHelperText(false)
        }

        if (!emtpy) {
            loginAPI();
        }
    }

    return (
        <ScrollView style={css.ScrollViewContainer} 
            showsVerticalScrollIndicator={false}>
        {loading == true ? (
        <View style={[css.ScreenContainer]}>
            <LoadingAnimation />
        </View>
        ) : (
        <View style={css.ScreenContainer}>
            <View style={{height: Dimensions.get("screen").height/100*90}}>
                <View style={{ flex: 1 }}>
                    <View style={[css.widthAndAdjustment, {marginVertical: 10}]}>
                        {/* <Text style={css.titleText}>Login</Text>
                        <Text style={css.titleText}>Enter Your Credential to Login.</Text> */}
                        <Image 
                        source={require('../assets/chicken_assets/chickenlogo.png')} 
                        // source={require('../assets/chicken_assets/logo2.png')} 
                        style={{ 
                            height: Dimensions.get("screen").height / 100 * 30, 
                            width: Dimensions.get("screen").width, 
                            resizeMode: 'contain', 
                            alignSelf: "center",
                        }} />
                    </View>
                    <View style={[css.widthAndAdjustment, css.cardShadow, {flex: 1}]}>
                        <View style={[css.cardContainer, {padding: 30}]}>
                            <View style={{flexDirection: "column", marginTop: SPACING.space_20}}>
                                <Text style={css.titleTextInput}> User Name </Text>
                                <TextInput
                                    style={css.loginTextInput}
                                    mode="outlined"
                                    label="User Name"
                                    value={username}
                                    onChangeText={setUserName}
                                    onSubmitEditing={() => inputRef.current?.focus()}
                                />
                                {usernameHelperText && <HelperText type="error">User Name can't be empty</HelperText>}
                            </View>

                            <View style={{flexDirection: "column", marginTop: SPACING.space_20}}>
                                <TouchableOpacity style={css.showPasswordButton}
                                    onPress={() => {
                                        if (ishide == (true)) {
                                            setishide(false)
                                        } else {
                                            setishide(true)
                                        }
                                    }}>
                                    {ishide == true ?
                                    (
                                        <Octicons name="eye" size={FONTSIZE.size_30} style={css.showPasswordIcon} />
                                    ) : (
                                        <Octicons name="eye-closed" size={FONTSIZE.size_30} style={css.showPasswordIcon} />
                                    )}
                                </TouchableOpacity>
                                <Text style={css.titleTextInput}> Password </Text>
                                <TextInput
                                    secureTextEntry={ishide}
                                    style={css.loginTextInput}
                                    mode="outlined"
                                    label="Password"
                                    value={password}
                                    onChangeText={setPassword}
                                    ref={inputRef}
                                />
                                {passwordHelperText && <HelperText type="error">Password can't be empty</HelperText>}
                            </View>

                            <TouchableOpacity style={{}} onPress={() => { }}>
                                <Text style={css.forgotPasswordText}>
                                    Forgot Password?
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={css.LoginButton} onPress={() => {checkEmpty()}}>
                                <Text style={css.LoginButtonText}> Log In </Text>
                            </TouchableOpacity>
                        </View>
                    </View>    
                </View>
                <View style={css.FooterContainer}>
                    <Text style={css.FooterText}>Version: {VersionInfo.appVersion}</Text>
                    <Text style={css.FooterText}>Copyright by @Domain Connect</Text>
                </View>
            </View>
        </View>
        )}
        </ScrollView>
    );
};

export default LoginScreen;

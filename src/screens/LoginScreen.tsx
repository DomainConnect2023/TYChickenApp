import React, { useEffect, useState } from 'react';
import { BackHandler, Dimensions, Image, ScrollView, TouchableOpacity } from 'react-native';
import { View, Text, TextInput as TextInputs } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInput } from 'react-native-paper';
import { COLORS, FONTSIZE, SPACING } from '../theme/theme';
import { css } from '../theme/CSS';
import Octicons from 'react-native-vector-icons/Octicons';
import VersionInfo from 'react-native-version-info';

const LoginScreen = ({navigation}: any) => {
    const [ishide, setishide] = useState(true);
        
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const inputRef = React.createRef<TextInputs>();

    useEffect(()=> {
        (async()=> {
            if (__DEV__) {
                setUserName("aaaa");
                setPassword("Aaaa");
            }

            const disableBackButton = () => {
                return true;
            };

            BackHandler.addEventListener('hardwareBackPress', disableBackButton);
          
            return () => {
                BackHandler.removeEventListener('hardwareBackPress', disableBackButton);
            };
        })();
    }, [])

    const loginAPI = async() => {
        await AsyncStorage.setItem('UserID', username);
        if(username=="admin"){
            setUserName("");
            setPassword("");
            navigation.navigate("CustomDrawer", { screen: 'Home'});
        }else{
            setUserName("");
            setPassword("");
            navigation.navigate("Tab", { screen: 'Home'});
        }
        
    };

    return (
        <ScrollView style={css.ScrollViewContainer} 
            showsVerticalScrollIndicator={false}>
        <View style={css.ScreenContainer}>
            <View style={{height: Dimensions.get("screen").height/100*90}}>
                <View style={{ flex: 1 }}>
                    <View style={[css.widthAndAdjustment, {marginVertical: 10}]}>
                        {/* <Text style={css.titleText}>Login</Text>
                        <Text style={css.titleText}>Enter Your Credential to Login.</Text> */}
                        <Image 
                        source={require('../assets/chicken_assets/logo2.png')} 
                        style={{ 
                            height: Dimensions.get("screen").height / 100 * 30, 
                            width: Dimensions.get("screen").width, 
                            resizeMode: 'contain', 
                            alignSelf: "center",
                        }} />
                    </View>
                    <View style={[css.widthAndAdjustment, css.cardShadow]}>
                        <View style={[css.cardContainer, {padding: 30}]}>
                            <View style={{flexDirection: "column"}}>
                                <Text style={css.titleTextInput}> User Name </Text>
                                <TextInput
                                    style={css.loginTextInput}
                                    mode="outlined"
                                    label="User Name"
                                    value={username}
                                    onChangeText={setUserName}
                                    onSubmitEditing={() => inputRef.current?.focus()}
                                />
                            </View>

                            <View style={{flexDirection: "column"}}>
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
                                <Text style={css.titleTextInput}> Passwordn </Text>
                                <TextInput
                                    secureTextEntry={ishide}
                                    style={css.loginTextInput}
                                    mode="outlined"
                                    label="Password"
                                    value={password}
                                    onChangeText={setPassword}
                                    ref={inputRef}
                                />
                            </View>

                            <TouchableOpacity style={{}} onPress={() => { }}>
                                <Text style={css.forgotPasswordText}>
                                    Forgot Password?
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={css.LoginButton} onPress={() => {loginAPI()}}>
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
        </ScrollView>
    );
};

export default LoginScreen;

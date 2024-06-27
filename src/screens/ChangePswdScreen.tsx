import { useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StatusBar, Image, Dimensions, TextInput as TextInputs, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFetchBlob from 'rn-fetch-blob';
import Snackbar from 'react-native-snackbar';
import { css } from '../theme/CSS';
import LoadingAnimation from '../components/LoadingAnimation';
import { COLORS, FONTSIZE, SPACING } from '../theme/theme';
import HeaderBar from '../components/HeaderBar';
import { HelperText, TextInput } from 'react-native-paper';
import Octicons from 'react-native-vector-icons/Octicons';

const ChangePswdScreen = ({navigation}: {navigation:any}) => {
    const route = useRoute();
    const { key, name } = route.params as any;
    const [loading, setLoading] = React.useState(false);

    const [oldPswd, setOldPswd] = useState('');
    const [newPswd, setNewPswd] = useState('');
    const [retypePswd, setRetypePswd] = useState('');

    const [ishide1, setishide1] = useState(true);
    const [ishide2, setishide2] = useState(true);
    const [ishide3, setishide3] = useState(true);

    const [passwordHelperText, setpasswordHelperText] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const OldPswrdRef = React.createRef<TextInputs>();
    const NewPswrdRef = React.createRef<TextInputs>();
    const RetypePswrdRef = React.createRef<TextInputs>();

    useEffect(() => {
        (async () => {
            // console.log(userEmail);
            setLoading(true);
            setTimeout(() => {
                setLoading(false);
            }, 500);
        })();
    }, []);

    const changePasswordAPI = async(purpose: string)=> {
        try {
            setLoading(true);

            if(newPswd!=retypePswd){
                setpasswordHelperText(true);
                setErrorMsg("Password and Retype Password are different.");
                setLoading(false);
            }else if(oldPswd.length<=3 || newPswd.length<=3){
                setpasswordHelperText(true);
                setErrorMsg("Password must be longer than 4 characters.");
                setLoading(false);
            }else{
                const IPaddress = await AsyncStorage.getItem('IPAddress') ?? "192.168.1.124:9879";
                const userEmail = await AsyncStorage.getItem('UserEmail') ?? "";
            
                RNFetchBlob.config({ trusty: true })
                .fetch("POST", "https://"+IPaddress +"/api/CheckOldPass", 
                { "Content-Type": "application/json" },
                JSON.stringify({
                    "Debtor": key,
                    "Password": oldPswd,
                }))
                .then(async (res) => {
                    if(res.json().issuccess==true){
                        // console.log("run here");
                        RNFetchBlob.config({ trusty: true })
                        .fetch("GET", "https://"+IPaddress +"/api/GetOTP?Email="+userEmail+"&Purpose="+purpose)
                        .then(async (res) => {
                            if(res.json().issuccess==true){
                                navigation.navigate('Verify', {
                                    purpose: purpose,
                                    newEmail: userEmail,
                                    newPassword: newPswd,
                                });
                                setLoading(false);
                            }else{
                                setLoading(false);
                                Snackbar.show({
                                    text: res.json().message,
                                    duration: Snackbar.LENGTH_SHORT,
                                });
                            }
                        });
                        
                    }else{
                        setLoading(false);
                        Snackbar.show({
                            text: res.json().message,
                            duration: Snackbar.LENGTH_SHORT,
                        });
                    }
                });
            }
            
        }catch (error: any) {
            Snackbar.show({
              text: error.message,
              duration: Snackbar.LENGTH_SHORT,
            });
        }
    };

    return (
        <View style={css.ScreenContainer}>
            <StatusBar backgroundColor={COLORS.secondaryLightGreyHex} />

            {loading ? (
                <View style={{alignSelf:"center",}}>
                    <LoadingAnimation />
                </View>
            ) : (
            <View style={{flex: 1}}>   
                <HeaderBar title="Change Password" checkBackBttn={true} />
                <View style={css.LineContainer}></View>
                <ScrollView 
                style={{flex: 1}}
                showsVerticalScrollIndicator={false} 
                contentContainerStyle={css.ScrollViewFlex}>
                    <View style={[css.widthAndAdjustment, {marginVertical: 10}]}>
                        <Image 
                        source={require('../assets/chicken_assets/changePswd.png')} 
                        style={{ 
                            height: Dimensions.get("screen").height / 100 * 15, 
                            width: Dimensions.get("screen").width, 
                            resizeMode: 'contain', 
                            alignSelf: "center",
                        }} />
                    </View>

                    <View style={[css.widthAndAdjustment, css.cardShadow]}>
                        <View style={[css.cardContainer, {padding: 30}]}>
                            <View style={{flexDirection: "column",}}>
                                <Text style={css.titleTextInput}> Name : {name} </Text>
                            </View>

                            <View style={{flexDirection: "column", marginTop: SPACING.space_24}}>
                                <TouchableOpacity style={css.showPasswordButton}
                                    onPress={() => {
                                        if (ishide1 == (true)) {
                                            setishide1(false)
                                        } else {
                                            setishide1(true)
                                        }
                                    }}>
                                    {ishide1 == true ?
                                    (
                                        <Octicons name="eye" size={FONTSIZE.size_30} style={css.showPasswordIcon} />
                                    ) : (
                                        <Octicons name="eye-closed" size={FONTSIZE.size_30} style={css.showPasswordIcon} />
                                    )}
                                </TouchableOpacity>
                                <Text style={css.titleTextInput}> Old Password </Text>
                                <TextInput
                                    secureTextEntry={ishide1}
                                    style={css.loginTextInput}
                                    mode="outlined"
                                    label="Old Password"
                                    value={oldPswd}
                                    onChangeText={setOldPswd}
                                    ref={OldPswrdRef}
                                    onSubmitEditing={() => NewPswrdRef.current?.focus()}
                                />
                            </View>
                            <View style={{flexDirection: "column", marginTop: SPACING.space_24}}>
                                <TouchableOpacity style={css.showPasswordButton}
                                    onPress={() => {
                                        if (ishide2 == (true)) {
                                            setishide2(false)
                                        } else {
                                            setishide2(true)
                                        }
                                    }}>
                                    {ishide2 == true ?
                                    (
                                        <Octicons name="eye" size={FONTSIZE.size_30} style={css.showPasswordIcon} />
                                    ) : (
                                        <Octicons name="eye-closed" size={FONTSIZE.size_30} style={css.showPasswordIcon} />
                                    )}
                                </TouchableOpacity>
                                <Text style={css.titleTextInput}> New Password 
                                    <Text style={{color: COLORS.primaryRedHex, fontSize: FONTSIZE.size_10}}>
                                       : must be longer than 4 characters
                                    </Text> 
                                </Text>
                                <TextInput
                                    secureTextEntry={ishide2}
                                    style={css.loginTextInput}
                                    mode="outlined"
                                    label="New Password"
                                    value={newPswd}
                                    onChangeText={setNewPswd}
                                    ref={NewPswrdRef}
                                    onSubmitEditing={() => RetypePswrdRef.current?.focus()}
                                />
                            </View>
                            <View style={{flexDirection: "column", marginTop: SPACING.space_24}}>
                                <TouchableOpacity style={css.showPasswordButton}
                                    onPress={() => {
                                        if (ishide3 == (true)) {
                                            setishide3(false)
                                        } else {
                                            setishide3(true)
                                        }
                                    }}>
                                    {ishide3 == true ?
                                    (
                                        <Octicons name="eye" size={FONTSIZE.size_30} style={css.showPasswordIcon} />
                                    ) : (
                                        <Octicons name="eye-closed" size={FONTSIZE.size_30} style={css.showPasswordIcon} />
                                    )}
                                </TouchableOpacity>
                                <Text style={css.titleTextInput}> Retype Password </Text>
                                <TextInput
                                    secureTextEntry={ishide3}
                                    style={css.loginTextInput}
                                    mode="outlined"
                                    label="Retype Password"
                                    value={retypePswd}
                                    onChangeText={setRetypePswd}
                                    ref={RetypePswrdRef}
                                />
                            </View>
                            {passwordHelperText && <HelperText type="error">{errorMsg}</HelperText>}

                            <TouchableOpacity style={[css.LoginButton, {marginTop: SPACING.space_40}]} onPress={() => {
                                changePasswordAPI("Password");
                            }}>
                                <Text style={css.LoginButtonText}> Confirm </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
            )}

        </View>
    )
}

export default ChangePswdScreen;
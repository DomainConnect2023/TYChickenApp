import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StatusBar, Image, TextInput, Dimensions, Keyboard, ActivityIndicator, Alert, Modal, Pressable, StyleSheet, KeyboardAvoidingView, NativeSyntheticEvent, TextInputKeyPressEventData, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFetchBlob from 'rn-fetch-blob';
import Snackbar from 'react-native-snackbar';
import Feather from 'react-native-vector-icons/Feather'
import { css } from '../theme/CSS';
import LoadingAnimation from '../components/LoadingAnimation';
import { BORDERRADIUS, COLORS, FONTSIZE, SPACING } from '../theme/theme';
import HeaderBar from '../components/HeaderBar';
import PopUpAnimation from '../components/PopUpAnimation';

const VerifyScreen = ({navigation}: {navigation:any}) => {
    const route = useRoute();
    const { purpose, newEmail, newPassword } = route.params as any;
    const [loading, setLoading] = React.useState(false);
    const [errorOccurred, setErrorOccurred] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);

    const [showAnimation, setShowAnimation] = useState(false);

    const [number1, setnumber1] = useState('');
    const [number2, setnumber2] = useState('');
    const [number3, setnumber3] = useState('');
    const [number4, setnumber4] = useState('');
    const [number5, setnumber5] = useState('');
    const [number6, setnumber6] = useState('');
    let latesttime=Date.now();
    const input_ref_1 = useRef<any>();
    const input_ref_2 = useRef<any>();
    const input_ref_3 = useRef<any>();
    const input_ref_4 = useRef<any>();
    const input_ref_5 = useRef<any>();
    const input_ref_6 = useRef<any>();

    // State to track the currently focused input
    const [currentFocus, setCurrentFocus] = useState("");

    const GETOTP = async () => {
        setLoading(true);
        const IPaddress = await AsyncStorage.getItem('IPAddress') ?? "192.168.1.124:9879";
        const userCode = await AsyncStorage.getItem('UserID') ?? "";

        // Change Email API
        if(purpose=="Email"){
            RNFetchBlob.config({ trusty: true })
            .fetch("POST", "https://"+IPaddress +"/api/EditEmail", 
            { "Content-Type": "application/json" },
            JSON.stringify({
                "Debtor": userCode,
                "Email": newEmail,
                "OTP": (number1 + number2 + number3 + number4 + number5 + number6),
            })).then(async (res) => {
                if (await res.json().issuccess == true) {

                    setShowAnimation(true),
                    setTimeout(() => {
                        setShowAnimation(false);
                        navigation.goBack();
                    }, 1500);

                }else {
                    Snackbar.show({
                        text: res.json().message,
                        duration: Snackbar.LENGTH_LONG
                    })
                }
                setLoading(false);
            }).catch(err => {
                Snackbar.show({
                    text: err.message,
                    duration: Snackbar.LENGTH_LONG
                })
                setLoading(false);
            })
            setLoading(false);

        // Change Password API
        }else if(purpose=="Password"){
            RNFetchBlob.config({ trusty: true })
            .fetch("POST", "https://"+IPaddress +"/api/EditPassword", 
            { "Content-Type": "application/json" },
            JSON.stringify({
                "Debtor": userCode,
                "NewPassword": newPassword,
                "Email": newEmail,
                "OTP": (number1 + number2 + number3 + number4 + number5 + number6),
            })).then(async (res) => {
                console.log(res.json());
                if (await res.json().issuccess == true) {

                    setShowAnimation(true),
                    setTimeout(() => {
                        setShowAnimation(false);
                        navigation.navigate("Tab", { screen: 'Profile'});
                    }, 1500);

                }else {
                    Snackbar.show({
                        text: res.json().message,
                        duration: Snackbar.LENGTH_LONG
                    })
                }
                setLoading(false);
            }).catch(err => {
                Snackbar.show({
                    text: err.message,
                    duration: Snackbar.LENGTH_LONG
                })
                setLoading(false);
            })
            setLoading(false);
        }
    }

    const handleKeyPressing =(e:  { nativeEvent: { key: string; };timeStamp:any})=>{
        if(e.nativeEvent.key !== 'Backspace'){
        latesttime=Date.now()
        switch (e.nativeEvent.key){
                case '1': case '2':case '3':case '4':case '5':case '6':case '7':case '8':case '9':case '0':
                if(currentFocus=='input_ref_6'){
                    setnumber6(e.nativeEvent.key)
                    Keyboard.dismiss()
                }else if(currentFocus == 'input_ref_5'){
                    setnumber5(e.nativeEvent.key)
                    input_ref_6.current.focus()
                }
                else if(currentFocus == 'input_ref_4'){
                    setnumber4(e.nativeEvent.key)
                    input_ref_5.current.focus()
                }
                else if(currentFocus == 'input_ref_3'){
                    setnumber3(e.nativeEvent.key)
                    input_ref_4.current.focus()
                }
                else if(currentFocus == 'input_ref_2'){
                    setnumber2(e.nativeEvent.key)
                    input_ref_3.current.focus()
                }else{
                    setnumber1(e.nativeEvent.key)
                    input_ref_2.current.focus()
                };
                break;
        }
        }

        if(e.nativeEvent.key === 'Backspace' && Date.now() -latesttime >50){
            switch (e.nativeEvent.key){
                case 'Backspace': 
            if(currentFocus=='input_ref_6'){
                setnumber6('')
                input_ref_5.current.focus()
            }else if(currentFocus == 'input_ref_5'){
                setnumber5('')
                input_ref_4.current.focus()
            }
            else if(currentFocus == 'input_ref_4'){
                setnumber4('')
                input_ref_3.current.focus()
            }
            else if(currentFocus == 'input_ref_3'){
                setnumber3('')
                input_ref_2.current.focus()
            }
            else if(currentFocus == 'input_ref_2'){
                setnumber2('')
                input_ref_1.current.focus()
            }else{
                setnumber1('')

            }
            ;break;
            }
            
        }
    }

    return (
        <View style={css.ScreenContainer}>
            <StatusBar backgroundColor={COLORS.secondaryLightGreyHex} />
            {showAnimation ? (
                <PopUpAnimation
                    style={{flex: 1}}
                    source={purpose=="Email" 
                        ? (require('../animationPart/AddSuccess.json')) 
                        : (require('../animationPart/ChangePswd.json'))}
                />
            ) : (
                <></>
            )}

            {loading ? (
                <View style={{alignSelf:"center",}}>
                    <LoadingAnimation />
                </View>
            ) : (
            <View style={{flex: 1}}>   
                <HeaderBar title="Verify" checkBackBttn={true} />
                <View style={css.LineContainer}></View>
                <ScrollView 
                style={{flex: 1}}
                showsVerticalScrollIndicator={false} 
                contentContainerStyle={css.ScrollViewFlex}>
                    <View style={{ height: Dimensions.get("screen").height / 100 * 90 }}>
                        <View style={{ flex: 0.2, alignSelf: "center", justifyContent: "center" }}>
                            <Text style={{ fontWeight: "bold", fontSize: 24, color:COLORS.primaryLightGreyHex }}>{'Enter Verification Code'}</Text>
                        </View>
                        <View style={{ flex: 1, alignItems: "center", alignSelf: "center" }}>
                            <Image source={require('../assets/chicken_assets/emailIcon.png')} style={{ resizeMode: "contain", width: 200, height: 200 }} />
                            <Text style={{ marginTop: 20, color: 'grey' }}>{'Send Code to'} {" Email"} .</Text>
                            <Text style={{ color: 'grey' }}>{'Please enter Verification Code'}</Text>
                        </View>

                        <View style={{ flex: 0.3, flexDirection: "row", justifyContent: "center", alignSelf: "center" }}>
                            <TextInput
                                autoFocus={errorOccurred}
                                value={number1}
                                onFocus={() => { setCurrentFocus('input_ref_1') }}
                                style={css.OTPInputText}
                                ref={input_ref_1}
                                keyboardType={"numeric"}
                                returnKeyType={"next"}
                                maxLength={1}
                                textAlign={'center'}
                                onKeyPress={(item)=>{handleKeyPressing(item)}}
                            />
                            <TextInput
                                onFocus={() => { setCurrentFocus('input_ref_2') }}
                                style={css.OTPInputText}
                                value={number2}
                                ref={input_ref_2}
                                keyboardType={"numeric"}
                                
                                returnKeyType={"next"}
                                maxLength={1}
                                textAlign={'center'}
                                onKeyPress={(item)=>{handleKeyPressing(item)}}
                                
                            />
                            <TextInput
                                onFocus={() => { setCurrentFocus('input_ref_3') }}
                                style={css.OTPInputText}
                                value={number3}
                                ref={input_ref_3}
                                keyboardType={"numeric"}
                                
                                returnKeyType={"next"}
                                maxLength={1}
                                textAlign={'center'}
                                onKeyPress={(item)=>{handleKeyPressing(item)}}

                               
                            />
                            <TextInput
                                onFocus={() => { setCurrentFocus('input_ref_4') }}
                                style={css.OTPInputText}
                                value={number4}
                                ref={input_ref_4}
                                keyboardType={"numeric"}
                                
                                returnKeyType={"next"}
                                maxLength={1}
                                textAlign={'center'}
                                onKeyPress={(item)=>{handleKeyPressing(item)}}
                            />
                            <TextInput
                                onFocus={() => { setCurrentFocus('input_ref_5') }}
                                style={css.OTPInputText}
                                value={number5}
                                ref={input_ref_5}
                                keyboardType={"numeric"}
                                
                                returnKeyType={"next"}
                                maxLength={1}
                                textAlign={'center'}
                                onKeyPress={(item)=>{handleKeyPressing(item)}}
                                
                            />
                            <TextInput
                                onFocus={() => { setCurrentFocus('input_ref_6') }}
                                style={css.OTPInputText}
                                value={number6}
                                ref={input_ref_6}
                                keyboardType={"numeric"}
                                
                                returnKeyType={"next"}
                                maxLength={1}
                                textAlign={'center'}
                                onKeyPress={(item)=>{handleKeyPressing(item)}}
                                
                            />
                        </View>

                        <View style={{ flex: 1 }}>
                            <View style={{ flexDirection: "row", justifyContent: "center" }}>
                                <Text style={{ color: 'grey' }}>
                                    Didt Receive the Code?
                                </Text>
                                <TouchableOpacity style={{ paddingLeft: 10 }}>
                                    <Text style={{ color: 'blue' }} onPress={() => {
                                        GETOTP();
                                    }}>Resend</Text>
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity style={css.LoginButton} onPress={() => { GETOTP() }} >
                                <Text style={css.LoginButtonText}>Verify The Code</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </ScrollView>
            </View>
            )}

        </View>
    )
}

export default VerifyScreen;
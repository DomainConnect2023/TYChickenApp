import React, { useEffect, useState } from 'react';
import { ScrollView, StatusBar, TouchableOpacity } from 'react-native';
import { View, Text, TextInput as TextInputs } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HelperText, TextInput } from 'react-native-paper';
import { COLORS, FONTSIZE, SPACING } from '../theme/theme';
import { css } from '../theme/CSS';
import Octicons from 'react-native-vector-icons/Octicons';
import RNFetchBlob from "rn-fetch-blob";
import Snackbar from 'react-native-snackbar';
import LoadingAnimation from '../components/LoadingAnimation';
import HeaderBar from '../components/HeaderBar';
import { useRoute } from '@react-navigation/native';
import { PersonalData } from '../components/Objects';

const FirstTimeScreen = ({navigation}: any) => {
    const [ishide, setishide] = useState(true);
    const route = useRoute();
    const { key, name, } = route.params as PersonalData;
        
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [address1, setAddress1] = useState('');
    const [address2, setAddress2] = useState('');
    const [postcode, setPostcode] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    
    const [usernameHelperText, setusernameHelperText] = useState(false);
    const [passwordHelperText, setpasswordHelperText] = useState(false);
    const [emailHelperText, setemailHelperText] = useState(false);
    const [emailError, setemailError] = useState("Email can't be empty");
    const [addressHelperText, setaddressHelperText] = useState(false);

    const inputPassRef = React.createRef<TextInputs>();
    const inputEmailRef = React.createRef<TextInputs>();
    const inputAdd1Ref = React.createRef<TextInputs>();
    const inputAdd2Ref = React.createRef<TextInputs>();
    const inputPostcodeRef = React.createRef<TextInputs>();
    const inputCityRef = React.createRef<TextInputs>();
    const inputStateRef = React.createRef<TextInputs>();

    const [loading, setLoading] = React.useState(false);

    const FirstTimeEditAPI = async() => {
        setLoading(true);
        try {
            const IPaddress = await AsyncStorage.getItem('IPAddress') ?? "192.168.1.124:9879";

            RNFetchBlob.config({ trusty: true }).fetch("POST","https://"+IPaddress+"/api/FirstTimeEdit", 
            { "Content-Type": "application/json" },
            JSON.stringify({
                "Username": name,
                "Password": password,
                "Email": email,
                "ADD1": address1,
                "ADD2": address2,
                "ADD3": postcode+","+city,
                "ADD4": state,
            })).then(async (res) => {
                console.log(await res.json());
                if(await res.json().issuccess==true){
                    await AsyncStorage.setItem('UserID', name);
                    await AsyncStorage.setItem('label', "user");
                    navigation.navigate("Tab", { screen: 'Home'});
                }else{
                    Snackbar.show({
                        text: await res.json().message,
                        duration: Snackbar.LENGTH_LONG
                    });
                }
                setLoading(false);

            }).catch(err => {
                Snackbar.show({
                    text: err.message,
                    duration: Snackbar.LENGTH_LONG
                });
                setLoading(false);
            })
        }catch(e){
            console.log(e);
            setLoading(false);
        }
    };

    const checkEmpty = () => {
        let emtpy = false;

        if (password === '') {
            setpasswordHelperText(true);
            emtpy = true;
        } else {
            setpasswordHelperText(false);
        }

        if (email === '') {
            setemailHelperText(true);
            setemailError("Email can't be empty")
            emtpy = true;
        } else {
            let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
            if (reg.test(email) === false) {
                setemailError("Email is Not Correct");
                setemailHelperText(true);
            }
            else {
                setemailHelperText(false);
            }
        }

        if ((address1 === '' && address2 === '') || postcode === '' || city === '' || state === '') {
            setaddressHelperText(true);
            emtpy = true;
        } else {
            setaddressHelperText(false);
        }

        if (!emtpy) {
            FirstTimeEditAPI();
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
            <StatusBar backgroundColor={COLORS.secondaryLightGreyHex} />
            <View style={{ flex: 1 }}>
                <HeaderBar title="Fist to login" checkBackBttn={true} />
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={css.ScrollViewFlex}>
                    <View style={[css.widthAndAdjustment, css.cardShadow, {flex: 1, marginVertical: 10}]}>
                        <View style={[css.cardContainer, {padding: 30}]}>
                            <View style={{flexDirection: "column", marginTop: SPACING.space_20}}>
                                <Text style={css.titleTextInput}> User Name : {name} </Text>
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
                                <Text style={css.titleTextInput}> New Password </Text>
                                <TextInput
                                    secureTextEntry={ishide}
                                    style={css.loginTextInput}
                                    mode="outlined"
                                    label="New Password"
                                    value={password}
                                    onChangeText={setPassword}
                                    ref={inputPassRef}
                                    onSubmitEditing={() => inputEmailRef.current?.focus()}
                                />
                                {passwordHelperText && <HelperText type="error">Password can't be empty</HelperText>}
                            </View>

                            <View style={{flexDirection: "column", marginTop: SPACING.space_20}}>
                                <Text style={css.titleTextInput}> Email </Text>
                                <TextInput
                                    style={css.loginTextInput}
                                    mode="outlined"
                                    label="Email"
                                    value={email}
                                    onChangeText={setEmail}
                                    ref={inputEmailRef}
                                    onSubmitEditing={() => inputAdd1Ref.current?.focus()}
                                />
                                {emailHelperText && <HelperText type="error">{emailError}</HelperText>}
                            </View>

                            <View style={{flexDirection: "column", marginTop: SPACING.space_20}}>
                                <Text style={css.titleTextInput}> Address </Text>
                                <TextInput
                                    style={css.loginTextInput}
                                    mode="outlined"
                                    label="Address 1"
                                    value={address1}
                                    onChangeText={setAddress1}
                                    ref={inputAdd1Ref}
                                    onSubmitEditing={() => inputAdd2Ref.current?.focus()}
                                />
                                <TextInput
                                    style={css.loginTextInput}
                                    mode="outlined"
                                    label="Address 2"
                                    value={address2}
                                    onChangeText={setAddress2}
                                    ref={inputAdd2Ref}
                                    onSubmitEditing={() => inputPostcodeRef.current?.focus()}
                                />
                                <View style={{flexDirection: "row", marginHorizontal: SPACING.space_20, alignSelf:"center"}}>
                                    <TextInput
                                        style={{width:"55%", marginHorizontal: "3%",}}
                                        mode="outlined"
                                        label="Postcode"
                                        value={postcode}
                                        onChangeText={setPostcode}
                                        ref={inputPostcodeRef}
                                        onSubmitEditing={() => inputCityRef.current?.focus()}
                                    />
                                    <TextInput
                                        style={{width:"55%", marginHorizontal: "3%"}}
                                        mode="outlined"
                                        label="City"
                                        value={city}
                                        onChangeText={setCity}
                                        ref={inputCityRef}
                                        onSubmitEditing={() => inputStateRef.current?.focus()}
                                    />
                                </View>
                                <TextInput
                                    style={css.loginTextInput}
                                    mode="outlined"
                                    label="State"
                                    value={state}
                                    onChangeText={setState}
                                    ref={inputStateRef}
                                />
                                {addressHelperText && <HelperText type="error">Address is wrong</HelperText>}
                            </View>

                            <TouchableOpacity style={css.LoginButton} onPress={() => {checkEmpty()}}>
                                <Text style={css.LoginButtonText}> Completed </Text>
                            </TouchableOpacity>
                        </View>
                    </View>    
                    </ScrollView>
                </View>
        </View>
        )}
        </ScrollView>
    );
};

export default FirstTimeScreen;

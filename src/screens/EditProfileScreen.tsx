import React, { useEffect, useRef, useState } from 'react';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { Dimensions, Image, Pressable, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ActivityIndicator, TextInput } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Snackbar from 'react-native-snackbar';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme';
import HeaderBar from '../components/HeaderBar';
import {FlatList} from 'react-native';
import { css } from '../theme/CSS';
import { addData, createTable, db, selectData, updateData } from '../data/SQLiteFile';
import PopUpAnimation from '../components/PopUpAnimation';
import { CategoryProps, PersonalData, currencyFormat } from '../components/Objects';
import LoadingAnimation from '../components/LoadingAnimation';
import { CategoryList } from '../data/ChickenData';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NameImage } from '../components/NameImage';
import RNFetchBlob from 'rn-fetch-blob';

const EditProfilePageScreen = ({navigation}: {navigation:any}) => {
    const route = useRoute();
    const { key, name, } = route.params as PersonalData;
    const [processData, setProcessData] = useState(false);

    const [address1, setAddress1] = useState("");
    const [address2, setAddress2] = useState("");
    const [address3, setAddress3] = useState("");
    const [address4, setAddress4] = useState("");
    
      
    useEffect(()=> {
        (async()=> {
            fetchedDataAPI();
        })();
    }, []);
    
    const fetchedDataAPI = async() => {
        try{
            setProcessData(true);
            const IPaddress = await AsyncStorage.getItem('IPAddress') ?? "";

            await RNFetchBlob.config({ trusty: true })
            .fetch("GET", "https://"+IPaddress+"/api/GetEditAddress?Debtor="+key)
            .then(async (res) => {
                if (await res.json().isSuccess == true) {
                    setAddress1(res.json().adD1);
                    setAddress2(res.json().adD2);
                    setAddress3(res.json().adD3);
                    setAddress4(res.json().adD4);
                }else{
                    Snackbar.show({
                        text: "Get address fail.",
                        duration: Snackbar.LENGTH_LONG
                    });
                }
            });
            
            setProcessData(false);
        }catch(e){
            console.log(e);
        }
    };

    const updateAddressAPI = async() => {
        try{
            setProcessData(true);
            const IPaddress = await AsyncStorage.getItem('IPAddress') ?? "";

            await RNFetchBlob.config({ trusty: true })
            .fetch("POST", "https://"+IPaddress+"/api/EditAddress", {
                "Content-Type": "application/json"
            }, JSON.stringify({ 
                "Debtor": key,
                "ADD1": address1,
                "ADD2": address2,
                "ADD3": address3,
                "ADD4": address4,
            }))
            .then(async (res) => {
                console.log(res.json());
                if (await res.json().issuccess == true) {
                    Snackbar.show({
                        text: res.json().message,
                        duration: Snackbar.LENGTH_LONG
                    });
                }else{
                    Snackbar.show({
                        text: res.json().message,
                        duration: Snackbar.LENGTH_LONG
                    });
                }
            });

            setProcessData(false);
        }catch(e){
            console.log(e);
        }
    }

    return (
        <View style={css.ScreenContainer}>
            <StatusBar backgroundColor={COLORS.secondaryLightGreyHex} />
            {processData==true ? (
                <View style={{alignSelf:"center",}}>
                    <LoadingAnimation />
                </View>
            ) : (
            <View style={{flex: 1}}>   
                <HeaderBar title="Edit Profile" checkBackBttn={true} />
                <View style={css.LineContainer}></View>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={css.ScrollViewFlex}>
                    <View style={[styles.InputContainerComponent, {justifyContent: "space-between"}]}>
                        <NameImage name={name} size={120} backgroundColor={COLORS.secondaryLightGreyHex} textColor="#ffffff" />
                    </View>
                    <View style={[css.widthAndAdjustment, css.cardShadow, {flex: 1}]}>
                        <View style={[css.cardContainer, {padding: 30}]}>
                            <View style={{flexDirection: "column", marginTop: SPACING.space_20}}>
                                <Text style={css.titleTextInput}> User Name : {name} </Text>
                            </View>

                            <View style={{flexDirection: "column", marginTop: SPACING.space_20}}>
                                <Text style={css.titleTextInput}> Address </Text>
                                <TextInput
                                    style={[css.loginTextInput, {marginVertical: 5}]}
                                    mode="outlined"
                                    label="Address 1"
                                    value={address1}
                                    onChangeText={setAddress1}
                                />
                                <TextInput
                                    style={[css.loginTextInput, {marginVertical: 5}]}
                                    mode="outlined"
                                    label="Address 2"
                                    value={address2}
                                    onChangeText={setAddress2}
                                />
                                <TextInput
                                    style={[css.loginTextInput, {marginVertical: 5}]}
                                    mode="outlined"
                                    label="Address 3"
                                    value={address3}
                                    onChangeText={setAddress3}
                                />
                                <TextInput
                                    style={[css.loginTextInput, {marginVertical: 5}]}
                                    mode="outlined"
                                    label="Address 4"
                                    value={address4}
                                    onChangeText={setAddress4}
                                />
                            </View>

                            <TouchableOpacity style={css.LoginButton} onPress={() => {updateAddressAPI()}}>
                                <Text style={css.LoginButtonText}> Update </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    InputContainerComponent: {
        flexDirection: 'row',
        backgroundColor: COLORS.secondaryVeryLightGreyHex,
        alignSelf: "center",
        marginVertical: SPACING.space_15,
        padding: SPACING.space_15,
    },
});

export default EditProfilePageScreen;
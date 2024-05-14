import * as React from 'react';
import { useEffect, useState } from 'react';
import { View, ScrollView, StatusBar, TouchableOpacity, Platform, PermissionsAndroid, ActivityIndicator } from "react-native";
import HeaderBar from '../components/HeaderBar';
import { COLORS, FONTSIZE, SPACING } from '../theme/theme';
import { css } from '../theme/CSS';
import { Text } from 'react-native-paper';
import * as ImagePicker from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import { HistoryCardProps, currencyFormat } from '../components/Objects';
import { useRoute } from '@react-navigation/native';
import LoadingAnimation from '../components/LoadingAnimation';

const DoneDeliveryPageScreen = ({navigation}: {navigation:any}) => {
    const route = useRoute();
    const { id, DOnumber, customerName, date, totalWeight, totalPrice, currency, status } = route.params as HistoryCardProps;
    const [processData, setProcessData] = useState(false);
    const [userID, setUserID] = useState('');
    const [feedback, setFeedback] = useState('');
    const [fetchedData, setFetchedData] = useState("");

    const [response, setResponse] = React.useState<any>(null);
      
    useEffect(()=> {
        (async()=> {
            await requestCameraPermission();
        })();
    }, []);

    const requestCameraPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                    title: "App Camera Permission",
                    message:"App needs access to your camera ",
                    buttonNeutral: "Ask Me Later",
                    buttonNegative: "Cancel",
                    buttonPositive: "OK"
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("Camera permission given");
            } else {
                // console.log("Camera permission denied");
            }
        } catch (err) {
             console.warn(err);
        }
    };

    const UploadImageType = React.useCallback(async (type: string, options: any) => {
        if (type === 'capture') {
            await ImagePicker.launchCamera(options, async (response) => {
    
                if (response.didCancel) {
                    console.log('User cancelled image picker');
                } else if (response.errorCode) {
                    console.log('ImagePicker Error: ', response.errorMessage);
                } else {
                    setResponse(response);
                    // console.log(response.assets?.[0].fileName);
                }
            });
        } else {
            await ImagePicker.launchImageLibrary(options, async (response) => {
                setResponse(response);
            });
        }
    }, []);

    return (
        <View style={css.ScreenContainer}>
            <StatusBar backgroundColor={COLORS.secondaryLightGreyHex} />
            <HeaderBar title="Form Submition" checkBackBttn={true} />

            {processData==true ? (
                <View style={{alignSelf:"center",}}>
                    <LoadingAnimation />
                </View>
            ) : (
            <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={css.ScrollViewFlex}>
                <View style={{ flex: 1 }}>
                    <View style={[css.widthAndAdjustment, css.cardShadow, {margin: SPACING.space_30}]}>
                        <View style={[css.cardContainer, {padding: SPACING.space_30}]}>
                            <View style={{flexDirection: "row"}}>
                                <Text style={[css.titleTextInput,{fontSize:FONTSIZE.size_14,fontWeight: "normal"}]}>DO: </Text>
                                <Text style={[css.titleTextInput,{fontSize:FONTSIZE.size_14,color:COLORS.primaryRedHex}]}>{DOnumber}</Text>
                            </View>

                            <View style={{flexDirection: "row", marginTop: SPACING.space_20,}}>
                                <Text style={[css.titleTextInput,{fontSize:FONTSIZE.size_14,fontWeight: "normal"}]}>Customer: </Text>
                                <Text style={[css.titleTextInput,{fontSize:FONTSIZE.size_14,color:COLORS.primaryRedHex}]}>{customerName}</Text>
                            </View>

                            <View style={{flexDirection: "row", marginTop: SPACING.space_20,}}>
                                <Text style={[css.titleTextInput,{fontSize:FONTSIZE.size_14,fontWeight: "normal"}]}>Date: </Text>
                                <Text style={[css.titleTextInput,{fontSize:FONTSIZE.size_14,color:COLORS.primaryRedHex}]}>{date}</Text>
                            </View>

                            <View style={{flexDirection: "row", marginTop: SPACING.space_20,}}>
                                <Text style={[css.titleTextInput,{fontSize:FONTSIZE.size_14,fontWeight: "normal"}]}>Total KG: </Text>
                                <Text style={[css.titleTextInput,{fontSize:FONTSIZE.size_14,color:COLORS.primaryRedHex}]}>{currencyFormat(totalPrice)}</Text>
                            </View>

                            <View style={{
                                flexDirection: "column", 
                                marginVertical: SPACING.space_20, 
                            }}>
                                <View style={{flexDirection: "row", justifyContent: 'space-between',}}>
                                    <Text style={[css.titleTextInput, {fontSize:FONTSIZE.size_14,fontWeight: "normal"}, {alignSelf: "center",}]}> Take a Photo </Text>
                                    <View style={{flexDirection: "row", justifyContent: 'flex-end',}}>
                                        <TouchableOpacity onPress={() => {
                                            UploadImageType(
                                                'library', 
                                                {options: {
                                                    selectionLimit: 0,
                                                    mediaType: 'photo',
                                                    includeBase64: false,
                                                    includeExtra, 
                                                }}
                                            );
                                        }}>
                                            <Icon
                                                name="image-outline"
                                                color={COLORS.primaryLightGreyHex}
                                                size={FONTSIZE.size_36}
                                                style={{
                                                    color: COLORS.primaryDarkGreyHex, 
                                                    fontWeight: "bold",
                                                    alignSelf: "center",
                                                    marginHorizontal: SPACING.space_5,
                                                }}
                                            />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => {
                                            UploadImageType(
                                                'capture', 
                                                {options: {
                                                    saveToPhotos: false,
                                                    mediaType: 'photo',
                                                    includeBase64: false,
                                                    includeExtra,
                                                }}
                                            );
                                        }}>
                                            <Icon
                                                name="camera-outline"
                                                color={COLORS.primaryLightGreyHex}
                                                size={FONTSIZE.size_36}
                                                style={{
                                                    color: COLORS.primaryDarkGreyHex, 
                                                    fontWeight: "bold",
                                                    alignSelf: "center",
                                                    marginHorizontal: SPACING.space_5,
                                                }}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                <View style={css.LineContainer}></View>

                                {fetchedData.length>0 ? (
                                    <Text style={css.DescriptionText}>{"File Name1, File Name2, ...."}</Text>
                                ) : (
                                    <Text style={css.DescriptionText}>No Image Uploaded</Text>
                                )}

                            </View>

                            <TouchableOpacity style={[css.LoginButton]} onPress={() => {

                            }}>
                                <Text style={css.LoginButtonText}> Submit </Text>
                            </TouchableOpacity>
                        </View>
                    </View>    
                </View>
            </ScrollView>
            )}
        </View>
    );
}

const includeExtra = true;

interface Action {
    title: string;
    type: 'capture' | 'library';
    options: ImagePicker.CameraOptions | ImagePicker.ImageLibraryOptions;
}

const actions: Action[] = [
    {
        title: 'Take Image',
        type: 'capture',
        options: {
            saveToPhotos: false,
            mediaType: 'photo',
            includeBase64: false,
            includeExtra,
        },
    },
    {
        title: 'Select Image',
        type: 'library',
        options: {
            selectionLimit: 0,
            mediaType: 'photo',
            includeBase64: false,
            includeExtra,
        },
    },
    {
        title: 'Take Video',
        type: 'capture',
        options: {
            saveToPhotos: true,
            formatAsMp4: true,
            mediaType: 'video',
            includeExtra,
        },
    },
    {
        title: 'Select Video',
        type: 'library',
        options: {
            selectionLimit: 0,
            mediaType: 'video',
            formatAsMp4: true,
            includeExtra,
        },
    },
    {
        title: 'Select Image or Video\n(mixed)',
        type: 'library',
        options: {
            selectionLimit: 0,
            mediaType: 'mixed',
            includeExtra,
        },
    },
  ];
  
  if (Platform.OS === 'ios') {
    actions.push({
        title: 'Take Image or Video\n(mixed)',
        type: 'capture',
        options: {
            saveToPhotos: true,
            mediaType: 'mixed',
            includeExtra,
            presentationStyle: 'fullScreen',
        },
    });
  }

export default DoneDeliveryPageScreen;
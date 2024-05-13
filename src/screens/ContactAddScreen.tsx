import * as React from 'react';
import { useEffect, useState } from 'react';
import { View, ScrollView, StatusBar, TouchableOpacity, Image, Dimensions, Platform, PermissionsAndroid } from "react-native";
import HeaderBar from '../components/HeaderBar';
import { COLORS, FONTSIZE, SPACING } from '../theme/theme';
import { css } from '../theme/CSS';
import { Text, TextInput } from 'react-native-paper';
import * as ImagePicker from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';

const ContactAddPageScreen = ({navigation}: {navigation:any}) => {
    const [userID, setUserID] = useState('');
    const [feedback, setFeedback] = useState('');
    const [fetchedData, setFetchedData] = useState("aaa");

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
            <HeaderBar title="Submit Issues" checkBackBttn={true} />

            <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={css.ScrollViewFlex}>
                {/* height: Dimensions.get("screen").height/100*90 */}
            <View style={{}}>
                <View style={{ flex: 1 }}>
                    <View style={[css.widthAndAdjustment, {marginVertical: SPACING.space_10}]}>
                        <Image 
                        source={require('../assets/chicken_assets/logo2.png')} 
                        style={{ 
                            height: Dimensions.get("screen").height / 100 * 20, 
                            width: Dimensions.get("screen").width, 
                            resizeMode: 'contain', 
                            alignSelf: "center",
                        }} />
                    </View>
                    <View style={[css.widthAndAdjustment, css.cardShadow]}>
                        <View style={[css.cardContainer, {padding: 30}]}>
                            <View style={{flexDirection: "column"}}>
                                <Text style={css.titleTextInput}> Feedback </Text>
                                <TextInput
                                    style={{height: Dimensions.get("screen").height/100*15}}
                                    mode="outlined"
                                    label="Give us some feedback"
                                    value={feedback}
                                    onChangeText={setFeedback}
                                />
                            </View>

                            <View style={{
                                flexDirection: "column", 
                                marginTop: SPACING.space_20, 
                            }}>
                                <View style={{flexDirection: "row", justifyContent: 'space-between',}}>
                                    <Text style={[css.titleTextInput, {alignSelf: "center",}]}> Take a Photo </Text>
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

                            <TouchableOpacity style={css.LoginButton} onPress={() => {

                            }}>
                                <Text style={css.LoginButtonText}> Submit </Text>
                            </TouchableOpacity>
                        </View>
                    </View>    
                </View>
            </View>
            </ScrollView>
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

export default ContactAddPageScreen;
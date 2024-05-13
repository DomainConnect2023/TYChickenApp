import * as React from 'react';
import { useEffect, useState } from 'react';
import { View, ScrollView, StatusBar, TouchableOpacity, Platform, PermissionsAndroid, Image, Dimensions } from "react-native";
import HeaderBar from '../components/HeaderBar';
import { COLORS, FONTSIZE, SPACING } from '../theme/theme';
import { css } from '../theme/CSS';
import { Text } from 'react-native-paper';
import * as ImagePicker from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import { currencyFormat } from '../components/Objects';

const DeliveryDetailPageScreen = ({navigation}: {navigation:any}) => {
    const [userID, setUserID] = useState('');
    const [feedback, setFeedback] = useState('');
    const [fetchedData, setFetchedData] = useState("");

    const [response, setResponse] = React.useState<any>(null);
      
    useEffect(()=> {
        (async()=> {
            
        })();
    }, []);


    return (
        <View style={css.ScreenContainer}>
            <StatusBar backgroundColor={COLORS.secondaryLightGreyHex} />
            <HeaderBar title="Delivery Detail" checkBackBttn={true} />

            <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={css.ScrollViewFlex}>
            <View style={{}}>
                <View style={{ flex: 1 }}>
                    <View style={[css.widthAndAdjustment, css.cardShadow, {margin: SPACING.space_30}]}>
                        <View style={[css.cardContainer, {padding: SPACING.space_30}]}>
                            <View style={{flexDirection: "row"}}>
                                <Text style={[css.titleTextInput,{fontSize:FONTSIZE.size_14,fontWeight: "normal"}]}>DO: </Text>
                                <Text style={[css.titleTextInput,{fontSize:FONTSIZE.size_14,color:COLORS.primaryRedHex}]}>DO101010235</Text>
                            </View>

                            <View style={{flexDirection: "row", marginTop: SPACING.space_20,}}>
                                <Text style={[css.titleTextInput,{fontSize:FONTSIZE.size_14,fontWeight: "normal"}]}>Customer: </Text>
                                <Text style={[css.titleTextInput,{fontSize:FONTSIZE.size_14,color:COLORS.primaryRedHex}]}>DOMAIN CONNECT SDN BHD</Text>
                            </View>

                            <View style={{flexDirection: "row", marginTop: SPACING.space_20,}}>
                                <Text style={[css.titleTextInput,{fontSize:FONTSIZE.size_14,fontWeight: "normal"}]}>Date: </Text>
                                <Text style={[css.titleTextInput,{fontSize:FONTSIZE.size_14,color:COLORS.primaryRedHex}]}>{new Date().toISOString().split('T')[0]}</Text>
                            </View>

                            <View style={{flexDirection: "row", marginTop: SPACING.space_20,}}>
                                <Text style={[css.titleTextInput,{fontSize:FONTSIZE.size_14,fontWeight: "normal"}]}>Total KG: </Text>
                                <Text style={[css.titleTextInput,{fontSize:FONTSIZE.size_14,color:COLORS.primaryRedHex}]}>{currencyFormat(1000101)}</Text>
                            </View>

                            <View style={{flexDirection: "row", marginTop: SPACING.space_20,}}>
                                <Image
                                    style={{ width: 200, height: 200 }}
                                    source={{
                                        uri: "https://icons.iconarchive.com/icons/petalart/free-shopping/256/shipping-box-icon.png"
                                    }}
                                />
                            </View>
                        </View>
                    </View>    
                </View>
            </View>
            </ScrollView>
        </View>
    );
}

export default DeliveryDetailPageScreen;
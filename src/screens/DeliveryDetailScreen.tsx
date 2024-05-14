import * as React from 'react';
import { useEffect, useState } from 'react';
import { View, ScrollView, StatusBar, TouchableOpacity, Platform, PermissionsAndroid, Image, Dimensions, ActivityIndicator } from "react-native";
import HeaderBar from '../components/HeaderBar';
import { COLORS, FONTSIZE, SPACING } from '../theme/theme';
import { css } from '../theme/CSS';
import { Text } from 'react-native-paper';
import * as ImagePicker from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import { HistoryCardProps, currencyFormat } from '../components/Objects';
import { useRoute } from '@react-navigation/native';
import LoadingAnimation from '../components/LoadingAnimation';

const DeliveryDetailPageScreen = ({navigation}: {navigation:any}) => {
    const route = useRoute();
    const { id, DOnumber, customerName, date, totalWeight, totalPrice, currency, status } = route.params as HistoryCardProps;
    const [processData, setProcessData] = useState(false);
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
                                <Text style={[css.titleTextInput,{fontSize:FONTSIZE.size_14,color:COLORS.primaryRedHex}]}>{currencyFormat(totalWeight)}</Text>
                            </View>

                            <View style={{flexDirection: "row", marginTop: SPACING.space_20,}}>
                                <Text style={[css.titleTextInput,{fontSize:FONTSIZE.size_14,fontWeight: "normal"}]}>Status: </Text>
                                <Text style={[css.titleTextInput,{fontSize:FONTSIZE.size_14,color:COLORS.primaryRedHex}]}>{status==1 ? ("Completed") : ("Pending")}</Text>
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
            </ScrollView>
            )}
        </View>
    );
}

export default DeliveryDetailPageScreen;
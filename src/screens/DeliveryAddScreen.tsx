import * as React from 'react';
import { useEffect, useState } from 'react';
import { View, ScrollView, StatusBar, TextInput as TextInputs, TouchableOpacity } from "react-native";
import HeaderBar from '../components/HeaderBar';
import { COLORS, FONTSIZE, SPACING } from '../theme/theme';
import { css } from '../theme/CSS';
import { Text, TextInput } from 'react-native-paper';
import * as ImagePicker from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import { HistoryCardProps, currencyFormat } from '../components/Objects';
import { useRoute } from '@react-navigation/native';
import LoadingAnimation from '../components/LoadingAnimation';

const DeliveryAddPageScreen = ({navigation}: {navigation:any}) => {
    const [userID, setUserID] = useState('');
    const [customer, setCustomer] = useState('');
    const [date, setDate] = useState('');
    const [Item, setItem] = useState('');
    const inputRef = React.createRef<TextInputs>();
    const inputRef2 = React.createRef<TextInputs>();
      
    useEffect(()=> {
        (async()=> {
            
        })();
    }, []);


    return (
        <View style={css.ScreenContainer}>
            <StatusBar backgroundColor={COLORS.secondaryLightGreyHex} />
            <HeaderBar title="Create Delivery" checkBackBttn={true} />

            <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={css.ScrollViewFlex}>
                <View style={{ flex: 1 }}>
                    <View style={[css.widthAndAdjustment, css.cardShadow, {margin: SPACING.space_30}]}>
                        <View style={[css.cardContainer, {padding: SPACING.space_30}]}>
                            <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                                <Text style={[css.titleTextInput,{fontSize:FONTSIZE.size_14,fontWeight: "normal"}]}>Customer: </Text>
                                <TextInput
                                    style={{}}
                                    mode="outlined"
                                    label="Customer Name"
                                    value={customer}
                                    onChangeText={setCustomer}
                                    onSubmitEditing={() => inputRef.current?.focus()}
                                />
                            </View>

                            <View style={{flexDirection: "row", justifyContent: "space-between", marginTop: SPACING.space_20,}}>
                                <Text style={[css.titleTextInput,{fontSize:FONTSIZE.size_14,fontWeight: "normal"}]}>Date: </Text>
                                <TextInput
                                    style={{}}
                                    mode="outlined"
                                    label="Date"
                                    value={date}
                                    onChangeText={setDate}
                                    onSubmitEditing={() => inputRef2.current?.focus()}
                                    ref={inputRef}
                                />
                            </View>

                            <View style={{flexDirection: "row", justifyContent: "space-between", marginTop: SPACING.space_20,}}>
                                <Text style={[css.titleTextInput,{fontSize:FONTSIZE.size_14,fontWeight: "normal"}]}>Item List: </Text>
                                <TextInput
                                    style={{}}
                                    mode="outlined"
                                    label="Item List"
                                    value={customer}
                                    onChangeText={setCustomer}
                                    ref={inputRef2}
                                />
                            </View>
                            <TouchableOpacity style={[css.LoginButton]} onPress={() => {

                            }}>
                                <Text style={css.LoginButtonText}> Submit </Text>
                            </TouchableOpacity>
                        </View>
                    </View>    
                </View>
            </ScrollView>
        </View>
    );
}

export default DeliveryAddPageScreen;
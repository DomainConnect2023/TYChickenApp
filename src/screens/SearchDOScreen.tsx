import * as React from 'react';
import { useEffect, useState } from 'react';
import { View, Text, Dimensions, FlatList, TouchableOpacity, StatusBar, Image, ImageBackground, StyleSheet, Pressable, TextInput } from "react-native";
import HeaderBar from '../components/HeaderBar';
import { COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme';
import Icon from 'react-native-vector-icons/Ionicons';
import { css } from '../theme/CSS';
import { ActivityIndicator, TextInput as TextPaperInput } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Snackbar from 'react-native-snackbar';
import { ChickenData3 } from '../data/ChickenData';
import { addData, createTable, selectData, updateData } from '../data/SQLiteFile';
import { ChickenCardProps, currencyFormat } from '../components/Objects';

const CARD_WIDTH = Dimensions.get('window').width * 0.36;

const Item = ({ title }: { title: any }) => (
    <View style={[css.CategoryScrollViewContainer, {marginVertical: SPACING.space_10}]}>
        <TouchableOpacity onPress={() => { }}>
            <View style={[css.CategoryContainer, {backgroundColor: COLORS.primaryVeryLightGreyHex, borderWidth: 2}]}>
                <Text style={[css.CategoryText, {color: COLORS.primaryGreyHex,}]}>{title}</Text>
            </View>
        </TouchableOpacity>
    </View>
);

const SearchDOPageScreen = ({navigation}: {navigation:any}) => {
    const [processData, setProcessData] = useState(false);
    const [userID, setUserID] = useState('');
    const [searchText, setSearchText] = useState('');

    useEffect(()=> {
        (async()=> {
            await fetchedDataAPI(ChickenData3);
        })();
    }, []);

    const fetchedDataAPI = async(newData: { itemList: ChickenCardProps[] }) => {
        setProcessData(true);
        setUserID(await AsyncStorage.getItem('UserID') ?? "");
        
        setProcessData(false);
    };

    return (
        <View style={[css.ScreenContainer, {backgroundColor: COLORS.primaryVeryLightGreyHex,}]}>
            <StatusBar backgroundColor={COLORS.secondaryLightGreyHex} />
            <HeaderBar title="Search Here..." checkBackBttn={true} />
                
            <View style={[css.InputContainerComponent, {backgroundColor: COLORS.secondaryVeryLightGreyHex, borderWidth: 2,}]}>
                <TouchableOpacity
                    onPress={() => {
                        // setSearchText(textValue);
                    }}>
                    <Icon
                    style={css.InputIcon}
                    name="search"
                    size={FONTSIZE.size_18}
                    color={
                        searchText.length > 0
                        ? COLORS.primaryOrangeHex
                        : COLORS.primaryLightGreyHex
                    }
                    />
                </TouchableOpacity>
                <TextInput
                    placeholder="Find Your DO...."
                    value={searchText}
                    onChangeText={text => {
                        setSearchText(text);
                    }}
                    placeholderTextColor={COLORS.primaryLightGreyHex}
                    style={css.TextInputContainer}
                    onEndEditing={()=> {
                        // console.log("try");
                    }}
                />
                {searchText.length > 0 ? (
                    <TouchableOpacity
                    onPress={() => {
                        // resetSearchCoffee();
                        // setTexValue("");
                        setSearchText("");
                    }}>
                    <Icon
                        style={css.InputIcon}
                        name="close"
                        size={FONTSIZE.size_16}
                        color={COLORS.primaryLightGreyHex}
                    />
                    </TouchableOpacity>
                ) : (
                    <></>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    CardRatingText: {
        fontFamily: FONTFAMILY.poppins_medium,
        color: COLORS.primaryGreyHex,
        lineHeight: SPACING.space_22,
        fontSize: FONTSIZE.size_14,
    },
    CardTitle: {
        fontFamily: FONTFAMILY.poppins_medium,
        color: COLORS.primaryGreyHex,
        fontSize: FONTSIZE.size_20,
        fontWeight: "bold",
    },
    CardSubtitle: {
        fontFamily: FONTFAMILY.poppins_light,
        color: COLORS.primaryRedHex,
        fontSize: FONTSIZE.size_18,
        fontWeight: "bold",
    },
});

export default SearchDOPageScreen;
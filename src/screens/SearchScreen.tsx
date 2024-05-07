import * as React from 'react';
import { useState } from 'react';
import { View, Text, Dimensions, FlatList, TouchableOpacity, StatusBar, TextInput } from "react-native";
import HeaderBar from '../components/HeaderBar';
import { COLORS, FONTSIZE, SPACING } from '../theme/theme';
import Icon from 'react-native-vector-icons/Ionicons';
import { css } from '../theme/CSS';

const CategoryList = [
    { id: '1', title: 'Frozen' },
    { id: '2', title: 'Fresh' },
];

const Item = ({ title }: { title: any }) => (
    <View style={[css.CategoryScrollViewContainer, {marginVertical: SPACING.space_10}]}>
        <TouchableOpacity onPress={() => { }}>
            <View style={[css.CategoryContainer, {backgroundColor: COLORS.primaryVeryLightGreyHex, borderWidth: 2}]}>
                <Text style={[css.CategoryText, {color: COLORS.primaryGreyHex,}]}>{title}</Text>
            </View>
        </TouchableOpacity>
    </View>
);

const SearchPageScreen = ({navigation}: {navigation:any}) => {
    const [searchText, setSearchText] = useState('');

    const showGridFlatlist = ({ item }: { item: any }) => (
        <Item title={item.title} />
    );

    return (
        <View style={[css.ScreenContainer, {backgroundColor: COLORS.primaryVeryLightGreyHex,}]}>
            <StatusBar backgroundColor={COLORS.secondaryLightGreyHex} />
            <HeaderBar title="Search Here..." checkBackBttn={true} />
                
            <View style={[css.InputContainerComponent, {backgroundColor: COLORS.secondaryVeryLightGreyHex, borderWidth: 2,}]}>
                <TouchableOpacity
                    onPress={() => {}}>
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
                    placeholder="Find Your Chicken...."
                    value={searchText}
                    onChangeText={text => {
                        setSearchText(text);
                    }}
                    placeholderTextColor={COLORS.primaryLightGreyHex}
                    style={css.TextInputContainer}
                />
                {searchText.length > 0 ? (
                    <TouchableOpacity
                    onPress={() => {
                        // resetSearchCoffee();
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

            <View style={{width: Dimensions.get("screen").width/100*95, alignSelf:"center", marginTop: 20}}>
                <Text style={css.ScreenTitle}>
                    Filter
                </Text>
                <FlatList
                    data={CategoryList}
                    renderItem={showGridFlatlist}
                    keyExtractor={item => item.id}
                    numColumns={4}
                />
            </View>
        </View>
    );
}

export default SearchPageScreen;
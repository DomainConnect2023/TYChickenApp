import { Image, ImageProps, Text, View } from "react-native";
import { css } from "../theme/CSS";
import { COLORS, FONTFAMILY, FONTSIZE } from "../theme/theme";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

export interface ProductData {
    key: number;
    name: string;
    type: string;
    picture: any;
    description: string;
    price: number;
}

export interface ChickenProductProps {
    code: string;
    item: string;
    itemName: string;
    category: string;
    picture: string;
    active: string;
    price: any;
    unit: string;
    quantity: number;
}
  
export interface CartItem {
    id: number;
    originid: number;
    picture: any;
    name: string;
    type: string;
    price: number;
    quantity: number;
}

export interface PersonalData {
    key: string;
    name: string;
} 

export interface OrderHistoryCardProps {
    doRef: string;
    created_At: string;
}

export interface HistoryCardProps {
    id: string;
    DOnumber: string;
    customerName: string;
    date: string;
    totalWeight: number;
    totalPrice: number;
    currency: string;
    status: number;
}

export interface ChickenCardProps {
    id: string;
    index: number;
    type: string;
    roasted: string;
    imagelink_square: ImageProps;
    name: string;
    special_ingredient: string;
    average_rating: number;
    price: any;
    quantity: number;
    status: boolean;
    buttonAddPressHandler: any;
    buttonLessPressHandler: any;
    adjustQuantityHandler: any;
    buttonaddtoCartPressHandler: any;
}

export interface ItemProps {
    icon: JSX.Element;
    title: string;
}

export interface CategoryProps {
    id: number;
    value: string;
    quantity: number
}

export const GridItem = ({ icon, title }: ItemProps) => {
    return (
        <View style={css.gridCSS}>
            <View>{icon}</View>
            <View style={{marginHorizontal: 10, marginTop: 10}}>
                <Text style={css.gridTitle}>{title}</Text>
            </View>
        </View>
    );
};
  
export function currencyFormat(num: number) {
    return num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}
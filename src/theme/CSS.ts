import { Dimensions, StyleSheet } from "react-native";
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from "./theme";

const CARD_WIDTH = Dimensions.get('window').width * 0.36;

export const HIDE_HEIGHT = 100;

export const css = StyleSheet.create({
    ScreenContainer: {
        flex: 1,
        backgroundColor: COLORS.secondaryVeryLightGreyHex,
    },
    ScrollViewFlex: {
        flexGrow: 1,
    },
    ScrollViewContainer: {
        flex: 1,
        backgroundColor: 'transparent'
    },
    LineContainer: {
        height: 0.4, 
        width: '100%', 
        backgroundColor: COLORS.primaryLightGreyHex, 
        marginBottom: SPACING.space_10,
    },
    tabBarStyle: {
        height: 65,
        position: 'absolute',
        backgroundColor: COLORS.thirdBlackRGBA,
        borderTopWidth: 0,
        elevation: 0,
        borderTopColor: 'transparent',
    },
    BlurViewStyles: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    // ActivityIndicatorCSS: {
    //     justifyContent: 'center', 
    //     alignItems: 'center', 
    //     marginVertical: SPACING.space_10, 
    //     padding: SPACING.space_20,
    // },
    cardShadow: {
        borderRadius: BORDERRADIUS.radius_16,
        backgroundColor: 'transparent',
        shadowColor: COLORS.primaryBlackHex,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: SPACING.space_10,
    },
    cardContainer: {
        backgroundColor: COLORS.primaryWhiteHex,
        borderRadius: BORDERRADIUS.radius_16,
        overflow: 'hidden',
    },
    CardLinearGradientContainer: {
        padding: SPACING.space_15,
        borderRadius: BORDERRADIUS.radius_25,
        // margin: SPACING.space_10
    },
    CardImageBG: {
        width: CARD_WIDTH,
        height: CARD_WIDTH,
        borderRadius: BORDERRADIUS.radius_20,
        marginBottom: SPACING.space_15,
        overflow: 'hidden',
        // margin: SPACING.space_10,
    },
    CardRatingContainer: {
        flexDirection: 'row',
        backgroundColor: COLORS.primaryWhiteHex,
        alignItems: 'center',
        justifyContent: 'center',
        gap: SPACING.space_10,
        paddingHorizontal: SPACING.space_15,
        position: 'absolute',
        borderBottomLeftRadius: BORDERRADIUS.radius_20,
        borderTopRightRadius: BORDERRADIUS.radius_20,
        top: 0,
        right: 0,
    },
    CardRatingText: {
        fontFamily: FONTFAMILY.poppins_medium,
        color: COLORS.primaryGreyHex,
        lineHeight: SPACING.space_22,
        fontSize: FONTSIZE.size_14,
    },
    CardTitle: {
        fontFamily: FONTFAMILY.poppins_medium,
        color: COLORS.primaryWhiteHex,
        fontSize: FONTSIZE.size_16,
        fontWeight: "bold",
    },
    CardSubtitle: {
        fontFamily: FONTFAMILY.poppins_light,
        color: COLORS.primaryWhiteHex,
        fontSize: FONTSIZE.size_10,
    },
    CardFooterRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginTop: SPACING.space_15,
        width: CARD_WIDTH,
    },
    CardPriceCurrency: {
        fontFamily: FONTFAMILY.poppins_semibold,
        color: COLORS.primaryOrangeHex,
        fontSize: FONTSIZE.size_14,
        marginHorizontal: SPACING.space_5
    },
    CardPrice: {
        color: COLORS.primaryWhiteHex,
    },
    
    buttonText: {
        fontSize: FONTSIZE.size_16,
        lineHeight: SPACING.space_22,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: COLORS.primaryBlackHex,
    },
    InputContainerComponent: {
        flexDirection: 'row',
        margin: SPACING.space_10,
        borderRadius: BORDERRADIUS.radius_20,
        backgroundColor: COLORS.secondaryLightGreyHex,
        alignItems: 'center',
    },
    InputIcon: {
        marginHorizontal: SPACING.space_20,
    },
    ScreenTitle: {
        fontSize: FONTSIZE.size_24,
        fontFamily: FONTFAMILY.poppins_semibold,
        color: COLORS.primaryLightGreyHex,
        paddingLeft: SPACING.space_15,
        fontWeight: "bold",
    },
    TextInputContainer: {
        flex: 1,
        height: SPACING.space_20 * 3,
        fontFamily: FONTFAMILY.poppins_medium,
        fontSize: FONTSIZE.size_14,
        color: COLORS.primaryGreyHex,
    },
    titleText: {
        fontSize: SPACING.space_30, 
        fontWeight: "bold", 
        color: COLORS.primaryLightGreyHex,
    },
    titleTextInput: {
        color: COLORS.primaryDarkGreyHex,  
        paddingLeft: 5, 
        fontSize: FONTSIZE.size_14, 
        fontWeight: "bold",
    },
    loginTextInput: {
        alignSelf:"center",
        width:"100%",
    },
    widthAndAdjustment: {
        width: "90%", 
        alignSelf: "center",
    },
    showPasswordButton: {
        position: "absolute", 
        alignSelf: "flex-end", 
        margin: SPACING.space_30, 
        zIndex: SPACING.space_10, 
        paddingRight: SPACING.space_10,
    },
    showPasswordIcon: {
        color:COLORS.primaryGreyHex, 
        marginTop: SPACING.space_5,
    },
    forgotPasswordText: {
        textAlign: "right", 
        width: "95%", 
        fontWeight: "bold", 
        fontSize: FONTSIZE.size_14, 
        color:COLORS.secondaryLightGreyHex, 
        margin: SPACING.space_10,
    },
    LoginButton: {
        alignSelf:"center",
        backgroundColor:COLORS.primaryBlackHex,
        width:"60%",
        justifyContent:"center",
        marginTop: SPACING.space_20,
        borderRadius: BORDERRADIUS.radius_20,
        height: SPACING.space_20 * 3,
    },
    LoginButtonText: {
        fontWeight: "bold",
        fontSize: FONTSIZE.size_16,
        alignSelf: "center",
        color: COLORS.primaryWhiteHex,
    },
    FooterContainer: {
        justifyContent: "flex-end",
        marginBottom: SPACING.space_15, 
        alignSelf: "center",
    },
    FooterText: {
        color: COLORS.primaryLightGreyHex,
        alignSelf: "center",
    },
    HeaderContainer: {
        backgroundColor: COLORS.headerColor,
        padding: SPACING.space_12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    BackHeaderContainer: {
        backgroundColor: COLORS.headerColor,
        padding: SPACING.space_12,
        flexDirection: 'row',
    },
    HeaderText: {
        fontFamily: FONTFAMILY.poppins_semibold,
        fontSize: FONTSIZE.size_24,
        color: COLORS.primaryLightGreyHex,
        fontWeight: "bold",
        marginHorizontal: SPACING.space_15,
    },
    DashboardTitle: {
        flexDirection: "row", 
        width: Dimensions.get("screen").width*90/100, 
        marginBottom: -SPACING.space_20, 
        marginTop: SPACING.space_30
    },
    ViewMoreText: {
        fontSize: FONTSIZE.size_14, 
        fontFamily: FONTFAMILY.poppins_semibold,
        color: COLORS.primaryRedHex,
        verticalAlign: "bottom",
    },
    FlatListContainer: {
        gap: SPACING.space_20,
        paddingVertical: SPACING.space_20,
        paddingHorizontal: SPACING.space_10,
    },
    EmptyListContainer: {
        width: Dimensions.get('window').width - SPACING.space_30 * 2,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: SPACING.space_36 * 3.6,
    },
    badgeContainer: {
        position: 'absolute',
        top: -5,
        right: 0,
        backgroundColor: 'red',
        borderRadius: SPACING.space_10,
        width: SPACING.space_20,
        height: SPACING.space_20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badge: {
        color: 'white',
        fontWeight: 'bold',
    },
    IconContainer: {
        position: 'relative',
        alignSelf: "flex-end",
    },
    DetailImage: {
        width: Dimensions.get("screen").width, 
        height: 220, 
        alignSelf: "center", 
        marginBottom: SPACING.space_15,
    },
    CategoryScrollViewStyle: {
        paddingHorizontal: SPACING.space_4,
        paddingVertical: SPACING.space_12,
    },
    CategoryScrollViewContainer: {
        flexDirection: "row"
    },
    CategoryScrollViewItem: {
        alignItems: 'center',
    },
    CategoryContainer: {
        width: CARD_WIDTH*1.05,
        height: SPACING.space_50,
        borderRadius: SPACING.space_10,
    },
    CategoryText: {
        alignSelf: "center",
        textAlign: 'center', 
        verticalAlign: 'middle',
        textAlignVertical: 'center',
        height: SPACING.space_50,
        fontSize: FONTSIZE.size_16,
        fontFamily: FONTFAMILY.poppins_semibold,
        fontWeight: "bold",
    },
    ActiveCategory: {
        backgroundColor: COLORS.primaryRedHex, 
        width: CARD_WIDTH*0.75,
        height: SPACING.space_50,
        borderRadius: SPACING.space_10,
    },
    CartFooter: {
        position: 'absolute', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        margin: SPACING.space_10, 
        alignItems: "center",
    },
    AddtoCartButton: {
        backgroundColor: "#06525A", 
        width: "90%", 
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: SPACING.space_12,
        paddingHorizontal: SPACING.space_32,
        borderRadius: SPACING.space_15,
        elevation: 3,
        marginTop: SPACING.space_10,
    },
    AddtoCartText: {
        color: COLORS.primaryWhiteHex, 
        fontSize: FONTSIZE.size_16,
        lineHeight: SPACING.space_22,
        fontWeight: 'bold',
        letterSpacing: 0.25,
    },
    DetailTitle: {
        fontSize: FONTSIZE.size_18,
        fontFamily: FONTFAMILY.poppins_semibold,
        color: COLORS.secondaryLightGreyHex,
        paddingLeft: SPACING.space_15,
        fontWeight: "bold",
    },
    DescriptionText: {
        fontSize: FONTSIZE.size_14, 
        fontFamily: FONTFAMILY.poppins_semibold,
        color: COLORS.primaryBlackHex, 
        paddingLeft: SPACING.space_15,
        fontWeight: "normal"
    },
    NumberOfOrder: {
        textAlign:"center", 
        alignSelf: "center", 
        height: SPACING.space_30, 
        fontSize: FONTSIZE.size_18,
    },
    miniNumberOfOrder: {
        alignSelf: "center", 
        textAlign: "center",
        alignItems: 'center',
        height: SPACING.space_32, 
        width: SPACING.space_50,
        fontSize: FONTSIZE.size_18,
    },
    plusButton: {
        backgroundColor: COLORS.primaryWhiteHex,
        width: SPACING.space_30,
        height: SPACING.space_30,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderRadius: SPACING.space_4,
        elevation: 3, 
        margin: SPACING.space_5,
    },
    miniPlusButton: {
        backgroundColor: COLORS.primaryWhiteHex,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderRadius: SPACING.space_4,
        elevation: SPACING.space_8, 
        width: SPACING.space_32, 
        height: SPACING.space_32,
        margin: SPACING.space_5,
    },
    CheckOutContainer: {
        borderRadius: 10, 
        position: 'absolute', 
        bottom: 0, 
        left: 0, 
        right: 0,
    },
    CheckOutPressable: {
        backgroundColor: COLORS.primaryWhiteHex, 
        width: Dimensions.get("screen").width, 
        alignItems: 'center',
        paddingVertical: SPACING.space_8,
        elevation: SPACING.space_10,
    },
    CheckOutButton: {
        backgroundColor: COLORS.primaryRedHex, 
        width: "70%", 
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: SPACING.space_15,
        borderRadius: SPACING.space_10,
        elevation: SPACING.space_10,
        marginTop: SPACING.space_10,
    },
    CheckOutText: {
        color: COLORS.primaryWhiteHex, 
        fontFamily: FONTFAMILY.poppins_medium,
        fontSize: FONTSIZE.size_18,
        lineHeight: SPACING.space_18,
        fontWeight: 'bold',
        letterSpacing: 0.25,
    },
    CartTotalPriceText: {
        color:COLORS.primaryGreyHex,
        fontFamily: FONTFAMILY.poppins_medium,
        fontSize: FONTSIZE.size_18, 
        fontWeight: "bold",
    },
    CardContainer: {
        flexDirection: "row", 
        width: Dimensions.get("screen").width*95/100, 
        backgroundColor: COLORS.secondaryVeryLightGreyHex, 
        margin: SPACING.space_5, 
        borderRadius: BORDERRADIUS.radius_20,
    },
    ContactContainer: {
        position: 'absolute',
        bottom: SPACING.space_20,
        right: SPACING.space_20,
    },
    ContactIconButton: {
        backgroundColor:COLORS.primaryLightGreyHex,
        borderRadius: BORDERRADIUS.radius_25, 
        width: SPACING.space_50, 
        height: SPACING.space_50, 
        justifyContent: 'center', 
        alignItems: 'center',
        elevation: SPACING.space_5,
    },
    MenuIcon: {
        marginHorizontal: SPACING.space_10,
    },
    TextDeliveryStatus: {
        fontSize: FONTSIZE.size_18,
        lineHeight: SPACING.space_22,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: COLORS.primaryLightGreyHex, 
        paddingTop: SPACING.space_10, 
        paddingHorizontal: SPACING.space_10, 
    },
    HistoryCardContainer: {
        flexDirection: "column", 
        alignSelf:"center",
        width: Dimensions.get("screen").width, 
        backgroundColor: COLORS.primaryWhiteHex, 
        padding: SPACING.space_10, 
        marginVertical: SPACING.space_8,
        borderRadius: SPACING.space_20,
    },
    HistoryTitleContainer: {
        flexDirection: "row", 
        justifyContent: "space-between", 
        padding: SPACING.space_5,
    },
    HistoryCardContent: {
        flexDirection: "column", 
        padding: SPACING.space_5,
    },
    HistoryCardFooter: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginTop: SPACING.space_15,
    },
    IconList: {
        marginHorizontal: "auto",
        width: Dimensions.get("screen").width,
        flexDirection: "row",
        flexWrap: "wrap",
        margin: SPACING.space_10,
        justifyContent: 'center',
    },
    gridCSS: {
        flex: 1,
        minWidth: 160,
        maxWidth: 160,
        height: 180,
        justifyContent: "center",
        alignItems: "center",
        margin: SPACING.space_5,
        backgroundColor: "rgba(249, 180, 45, 0.2)",
        borderWidth: 1.5,
        borderColor: COLORS.primaryWhiteHex,
        borderRadius: BORDERRADIUS.radius_20,
    },
    gridTitle: {
        textAlign: "center", 
        justifyContent: "center", 
        color: COLORS.primaryGreyHex,
        fontSize: FONTSIZE.size_14,
        fontFamily: FONTFAMILY.poppins_medium,
        fontWeight: "bold",
    }
});

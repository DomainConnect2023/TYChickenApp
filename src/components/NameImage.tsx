import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Text as SvgText } from 'react-native-svg';

export const NameImage = ({ name, size, backgroundColor, textColor }: {name:any, size: any, backgroundColor: any, textColor: any}) => {
    // Get the first character of the name
    const initial = name ? name.charAt(0).toUpperCase() : '';
    
    return (
        <View style={[styles.container, { width: size, height: size, backgroundColor }]}>
            <Svg height={size} width={size}>
                <SvgText
                    x="50%"
                    y="50%"
                    fontSize={size / 2}
                    fill={textColor}
                    textAnchor="middle"
                    alignmentBaseline="middle"
                >
                {initial}
                </SvgText>
            </Svg>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        overflow: 'hidden',
    },
});
  
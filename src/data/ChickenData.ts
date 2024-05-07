import { ChickenCardProps } from "../components/ChickenCard";

export const ChickenData = {
    "itemList": [
    {
        index: 0,
        id: 'C1',
        name: 'Chicken Wing',
        description: `Chicken wings are typically divided into two sections: the drumette and the flat or wingette. They are prepared by deep-frying, baking, or grilling, with deep-frying being the most common method.`,
        roasted: 'Medium Roasted',
        imagelink_square: require('../assets/chicken_assets/wing.jpg'),
        imagelink_portrait: require('../assets/chicken_assets/wing.jpg'),
        ingredients: 'Wing',
        special_ingredient: 'With Wing',
        prices: [
            {size: 'S', price: '1000', currency: '$'},
            {size: 'M', price: '1150', currency: '$'},
            {size: 'L', price: '1400', currency: '$'},
        ],
        average_rating: 5.0,
        ratings_count: '6,879',
        favourite: false,
        type: 'Part',
    },
    {
        index: 1,
        id: 'C2',
        name: 'Thigh',
        description: `The chicken thigh is the dark meat from the upper part of the leg of a chicken, and is one of the most common parts of the chicken used in cooking.`,
        roasted: 'Medium Roasted',
        imagelink_square: require('../assets/chicken_assets/thigh.jpg'),
        imagelink_portrait: require('../assets/chicken_assets/thigh.jpg'),
        ingredients: 'Thigh',
        special_ingredient: 'With Thigh',
        prices: [
            {size: 'S', price: '1200', currency: '$'},
            {size: 'M', price: '1300', currency: '$'},
            {size: 'L', price: '1400', currency: '$'},
        ],
        average_rating: 5.0,
        ratings_count: '6,879',
        favourite: false,
        type: 'Part',
    },
    {
        index: 2,
        id: 'C3',
        name: 'Breast',
        description: `The chicken breast is a lean cut of meat taken from the pectoral muscle on the underside of the chicken. Each whole chicken contains one chicken breast with two halves, which are typically separated during the butchering process and sold as individual breasts.`,
        roasted: 'Medium Roasted',
        imagelink_square: require('../assets/chicken_assets/breast.jpg'),
        imagelink_portrait: require('../assets/chicken_assets/breast.jpg'),
        ingredients: 'Breast',
        special_ingredient: 'With Breast',
        prices: [
            {size: 'S', price: '1500', currency: '$'},
            {size: 'M', price: '1700', currency: '$'},
            {size: 'L', price: '1900', currency: '$'},
        ],
        average_rating: 5.0,
        ratings_count: '6,879',
        favourite: false,
        type: 'Part',
    },
    ]
}

export const TestChickenData = {
    "itemList": [
    {
        "index": 0,
        "id": 'C1',
        "name": 'Chicken Wing',
        "description": `Chicken wings are typically divided into two sections: the drumette and the flat or wingette. They are prepared by deep-frying, baking, or grilling, with deep-frying being the most common method.`,
        "roasted": 'Medium Roasted',
        "imagelink_square": require('../assets/chicken_assets/wing.jpg'),
        "imagelink_portrait": require('../assets/chicken_assets/wing.jpg'),
        "ingredients": 'Wing',
        "special_ingredient": 'With Wing',
        "prices": [
            {"size": 'S', "price": '1000', "currency": '$'},
            {"size": 'M', "price": '1150', "currency": '$'},
            {"size": 'L', "price": '1400', "currency": '$'},
        ],
        "average_rating": 5.0,
        "ratings_count": '6,879',
        "favourite": false,
        "type": 'Part',
    },
    {
        "index": 1,
        "id": 'C2',
        "name": 'Thigh',
        "description": `The chicken thigh is the dark meat from the upper part of the leg of a chicken, and is one of the most common parts of the chicken used in cooking.`,
        "roasted": 'Medium Roasted',
        "imagelink_square": require('../assets/chicken_assets/thigh.jpg'),
        "imagelink_portrait": require('../assets/chicken_assets/thigh.jpg'),
        "ingredients": 'Thigh',
        "special_ingredient": 'With Thigh',
        "prices": [
            {"size": 'S', "price": '1200', "currency": '$'},
            {"size": 'M', "price": '1300', "currency": '$'},
            {"size": 'L', "price": '1400', "currency": '$'},
        ],
        "average_rating": 5.0,
        "ratings_count": '6,879',
        "favourite": false,
        "type": 'Part',
    },
    {
        "index": 2,
        "id": 'C3',
        "name": 'Breast',
        "description": `The chicken breast is a lean cut of meat taken from the pectoral muscle on the underside of the chicken. Each whole chicken contains one chicken breast with two halves, which are typically separated during the butchering process and sold as individual breasts.`,
        "roasted": 'Medium Roasted',
        "imagelink_square": require('../assets/chicken_assets/breast.jpg'),
        "imagelink_portrait": require('../assets/chicken_assets/breast.jpg'),
        "ingredients": 'Breast',
        "special_ingredient": 'With Breast',
        "prices": [
            {"size": 'S', "price": '1500', "currency": '$'},
            {"size": 'M', "price": '1700', "currency": '$'},
            {"size": 'L', "price": '1900', "currency": '$'},
        ],
        "average_rating": 5.0,
        "ratings_count": '6,879',
        "favourite": false,
        "type": 'Part',
    },
    ]
}

export const ChickenData2 : { itemList: ChickenCardProps[];} = {
    "itemList": [
    {
        index: 0,
        id: 'C1',
        name: 'Chicken Wing',
        roasted: 'Medium Roasted',
        imagelink_square: require('../assets/chicken_assets/wing.jpg'),
        special_ingredient: 'With Wing',
        price: [
            {size: 'S', price: '1000', currency: '$'},
            {size: 'M', price: '1150', currency: '$'},
            {size: 'L', price: '1400', currency: '$'},
        ],
        average_rating: 5.0,
        type: 'Part',
        buttonPressHandler: {}
    },
    {
        index: 1,
        id: 'C2',
        name: 'Thigh',
        roasted: 'Medium Roasted',
        imagelink_square: require('../assets/chicken_assets/thigh.jpg'),
        special_ingredient: 'With Thigh',
        price: [
            {size: 'S', price: '1200', currency: '$'},
            {size: 'M', price: '1300', currency: '$'},
            {size: 'L', price: '1400', currency: '$'},
        ],
        average_rating: 5.0,
        type: 'Part',
        buttonPressHandler: {}
    },
    {
        index: 2,
        id: 'C3',
        name: 'Breast',
        roasted: 'Medium Roasted',
        imagelink_square: require('../assets/chicken_assets/breast.jpg'),
        special_ingredient: 'With Breast',
        price: [
            {size: 'S', price: '1500', currency: '$'},
            {size: 'M', price: '1700', currency: '$'},
            {size: 'L', price: '1900', currency: '$'},
        ],
        average_rating: 5.0,
        type: 'Part',
        buttonPressHandler: {}
    },
    {
      index: 3,
      id: 'C4',
      name: 'Thigh',
      roasted: 'Medium Roasted',
      imagelink_square: require('../assets/chicken_assets/thigh.jpg'),
      special_ingredient: 'With Thigh',
      price: [
          {size: 'S', price: '1200', currency: '$'},
          {size: 'M', price: '1300', currency: '$'},
          {size: 'L', price: '1400', currency: '$'},
      ],
      average_rating: 5.0,
      type: 'Part',
      buttonPressHandler: {}
  },
  {
      index: 4,
      id: 'C5',
      name: 'Breast',
      roasted: 'Medium Roasted',
      imagelink_square: require('../assets/chicken_assets/breast.jpg'),
      special_ingredient: 'With Breast',
      price: [
          {size: 'S', price: '1500', currency: '$'},
          {size: 'M', price: '1700', currency: '$'},
          {size: 'L', price: '1900', currency: '$'},
      ],
      average_rating: 5.0,
      type: 'Part',
      buttonPressHandler: {}
},
    ]
}

export const ChickenData3 : { itemList: ChickenCardProps[];} = {
    "itemList": [
        {
            index: 0,
            id: 'C1',
            name: 'Chicken Wing',
            roasted: 'Medium Roasted',
            imagelink_square: require('../assets/chicken_assets/wing.jpg'),
            special_ingredient: 'With Wing',
            price: [
                {size: 'S', price: '1000', currency: '$'},
                {size: 'M', price: '1150', currency: '$'},
                {size: 'L', price: '1400', currency: '$'},
            ],
            average_rating: 5.0,
            type: 'Part',
            buttonPressHandler: {}
        },
        {
            index: 1,
            id: 'C2',
            name: 'Thigh',
            roasted: 'Medium Roasted',
            imagelink_square: require('../assets/chicken_assets/thigh.jpg'),
            special_ingredient: 'With Thigh',
            price: [
                {size: 'S', price: '1200', currency: '$'},
                {size: 'M', price: '1300', currency: '$'},
                {size: 'L', price: '1400', currency: '$'},
            ],
            average_rating: 5.0,
            type: 'Part',
            buttonPressHandler: {}
        },
        {
            index: 2,
            id: 'C3',
            name: 'Breast',
            roasted: 'Medium Roasted',
            imagelink_square: require('../assets/chicken_assets/breast.jpg'),
            special_ingredient: 'With Breast',
            price: [
                {size: 'S', price: '1500', currency: '$'},
                {size: 'M', price: '1700', currency: '$'},
                {size: 'L', price: '1900', currency: '$'},
            ],
            average_rating: 5.0,
            type: 'Part',
            buttonPressHandler: {}
        },
        {
            index: 3,
            id: 'C4',
            name: 'Chicken Wing',
            roasted: 'Medium Roasted',
            imagelink_square: require('../assets/chicken_assets/wing.jpg'),
            special_ingredient: 'With Wing',
            price: [
                {size: 'S', price: '1000', currency: '$'},
                {size: 'M', price: '1150', currency: '$'},
                {size: 'L', price: '1400', currency: '$'},
            ],
            average_rating: 5.0,
            type: 'Part',
            buttonPressHandler: {}
        },
        {
            index: 4,
            id: 'C5',
            name: 'Thigh',
            roasted: 'Medium Roasted',
            imagelink_square: require('../assets/chicken_assets/thigh.jpg'),
            special_ingredient: 'With Thigh',
            price: [
                {size: 'S', price: '1200', currency: '$'},
                {size: 'M', price: '1300', currency: '$'},
                {size: 'L', price: '1400', currency: '$'},
            ],
            average_rating: 5.0,
            type: 'Part',
            buttonPressHandler: {}
        },
        {
            index: 5,
            id: 'C6',
            name: 'Breast',
            roasted: 'Medium Roasted',
            imagelink_square: require('../assets/chicken_assets/breast.jpg'),
            special_ingredient: 'With Breast',
            price: [
                {size: 'S', price: '1500', currency: '$'},
                {size: 'M', price: '1700', currency: '$'},
                {size: 'L', price: '1900', currency: '$'},
            ],
            average_rating: 5.0,
            type: 'Part',
            buttonPressHandler: {}
        },
    ]
}
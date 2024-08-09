import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { AdvancedImage } from 'cloudinary-react-native';
import { thumbnail } from "@cloudinary/url-gen/actions/resize";
import { cld } from '~/src/lib/cloudinary';

const categories = [
    { name: 'Food 🍽️', image: 'v1722657206/xzlj7ngdbfrovlon3q8x.avif' },
    { name: 'Social 🥂', image: 'pkbtulnuoaawykhd66um.jpg' },
    { name: 'Sports 🏈', image: 'mcsz88tyjtgx0grac3dw.jpg' },
    { name: 'Entertainment 🎥', image: 'd2ykttnl6yxeekew4e09.avif' },
    { name: 'Travel 🚘', image: 'cyxobqfr9ncpwfvncqm2.webp' },
    { name: 'Events 🗣️', image: 'mrozzfrgo7vgurvkn75o.jpg' },
    { name: 'Stay in 🏠', image: 'a2or2eibhzeuqgju2c9i.jpg' },
    { name: 'Gym 🏋️‍♀️', image: 'ktvf5tllzf85n7flwzcp.jpg' },

    // Add more categories as needed
];

export default function MovesCards({ onCategorySelect }) {
    const [selectedCategory, setSelectedCategory] = useState(null);

    const handlePress = (category) => {
        setSelectedCategory(category.name);
        onCategorySelect(category);
    };

    return (
        <View style={styles.container}>
            {categories.map((category, index) => {
                const image = cld.image(category.image);
                image.resize(thumbnail().width(200).height(100)); // Adjust size as needed

                const isSelected = selectedCategory === category.name;

                return (
                    <TouchableOpacity
                        key={index}
                        style={[styles.card, isSelected && styles.selectedCard]}
                        onPress={() => handlePress(category)}
                    >
                        <AdvancedImage cldImg={image} style={styles.image} />
                        <Text style={styles.text}>{category.name}</Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        padding: 10,
    },
    card: {
        width: '48%',
        marginBottom: 20,
        borderRadius: 10,
        overflow: 'hidden',
        elevation: 3,
        backgroundColor: 'white',
    },
    selectedCard: {
        borderColor: 'gray-900',
        borderWidth: 2,
    },
    image: {
        width: '100%',
        height: 100,
    },
    text: {
        padding: 10,
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

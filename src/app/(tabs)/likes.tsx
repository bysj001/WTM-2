import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AdvancedImage } from 'cloudinary-react-native';
import { cld } from '~/src/lib/cloudinary'; // Make sure this path is correct
import { useAuth } from '../../providers/AuthProvider';
import { thumbnail } from "@cloudinary/url-gen/actions/resize";
import { supabase } from "~/src/lib/supabase";

export default function LikesScreen() {
    const [usersWhoLiked, setUsersWhoLiked] = useState([]);
    const { user } = useAuth();
    const navigation = useNavigation();

    useEffect(() => {
        const fetchLikes = async () => {
            // Fetch the posts that the current logged-in user has made
            const { data: posts } = await supabase
                .from('posts')
                .select('id')
                .eq('user_id', user.id);

            const postIds = posts.map(post => post.id);

            // Fetch the likes on these posts by other users
            const { data: likes } = await supabase
                .from('likes')
                .select('user_id, post_id')
                .in('post_id', postIds);

            // Fetch user details of those who liked the posts
            const { data: users } = await supabase
                .from('profiles')
                .select('id, username, avatar_url')
                .in('id', likes.map(like => like.user_id))
                .neq('id', user.id); // Exclude the current user

            setUsersWhoLiked(users);
        };

        fetchLikes();
    }, [user.id]);

    const handleMatchPress = (userId) => {
        // Functionality to route to messages tab will be added here
        navigation.navigate('Messages', { userId });
    };

    const renderUserItem = ({ item }) => {
        const avatarImage = cld.image(item.avatar_url);
        avatarImage.resize(thumbnail().width(48).height(48));

        return (
            <View style={styles.userContainer}>
                <AdvancedImage cldImg={avatarImage} style={styles.avatar} />
                <Text style={styles.userName}>{item.username}</Text>
                <TouchableOpacity style={styles.matchButton} onPress={() => handleMatchPress(item.id)}>
                    <Text style={styles.matchButtonText}>Match</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Likes</Text>
            <FlatList
                data={usersWhoLiked}
                keyExtractor={(item) => item.id}
                renderItem={renderUserItem}
                contentContainerStyle={styles.listContainer}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        padding: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    listContainer: {
        paddingBottom: 20,
    },
    userContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 15,
    },
    userName: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
    },
    matchButton: {
        backgroundColor: '#007bff',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    matchButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

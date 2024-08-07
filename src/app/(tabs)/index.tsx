import { Text, View, Image, FlatList, Alert} from "react-native";
import posts from '~/assets/data/posts.json';
import {Ionicons, Feather, AntDesign } from '@expo/vector-icons';
import PostListItem from "~/src/components/PostListItem";
import { useEffect, useState } from "react";
import { supabase } from "~/src/lib/supabase";

export default function FeedScreen() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        let {data, error} = await supabase.from('posts').select('*, user:profiles(*)');
        if (error){
            Alert.alert('Something went wrong');
        }
        setPosts(data);
    };



    return (
        <FlatList
            data={posts}
            contentContainerStyle={{ gap: 10, maxWidth: 512, alignSelf: "center", width: '100%'}}
            renderItem={({ item }) => <PostListItem post={item}/>}
            showsVerticalScrollIndicator={false}
        />
    );
}
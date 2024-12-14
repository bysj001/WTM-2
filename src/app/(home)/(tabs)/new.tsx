import { Text, View, TextInput, TouchableOpacity, ScrollView, Keyboard } from "react-native";
import { useState } from "react";
import MovesCards from "~/src/components/Moves";
import { supabase } from "~/src/lib/supabase";
import { useAuth } from "~/src/providers/AuthProvider";
import { router } from 'expo-router';
type Category = {
    name: string;
    image: string;
};

export default function CreatePost() {
    const { session } = useAuth();
    const [caption, setCaption] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    const createPost = async () => {
        if (!selectedCategory) {
            alert('Please select a category');
            return;
        }

        // save post in database
        const { data, error } = await supabase
            .from('posts')
            .insert([{ 
                caption, 
                category: selectedCategory.name,
                image: selectedCategory.image,
                user_id: session?.user.id 
            }])
            .select();

        if (error) {
            console.error(error);
        } else {
            console.log('Post created successfully', data);
        }

        router.push('/(tabs)');
    }

    return (
        <View className="p-3 items-center flex-1 "> 
            <ScrollView showsVerticalScrollIndicator={false}>
                <Text className="p-3 font-semibold">CATEGORY</Text>
                <MovesCards onCategorySelect={setSelectedCategory} />
                
                <Text className="p-3 font-semibold">DETAILS</Text>
                <TextInput 
                    value={caption}
                    editable
                    multiline
                    maxLength={39}
                    numberOfLines={3}
                    onSubmitEditing={Keyboard.dismiss}
                    onChangeText={setCaption}
                    placeholder="What's the move?" 
                    className=" w-full p-10 text-wrap bg-white rounded-md"
                />
                
                <View className="p-3 mt-auto w-full">
                    <TouchableOpacity
                        style={{
                        backgroundColor: '#00264B',
                        padding: 10,
                        borderRadius: 5,
                        alignItems: 'center',
                        }}
                        onPress={createPost}
                    >
                        <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Share</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </View>
    );
}

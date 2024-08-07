import { Text, View, Image, TextInput } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { useState } from "react";
import Button from "~/src/components/Button";
import { supabase } from "~/src/lib/supabase";

export default function ProfileScreen() {
    const [image, setImage] = useState<string | null>(null);
    const [username, setUsername] = useState("");

    const pickImage = async () => {

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4,3],
            quality: 1,
        });

        if (!result.canceled){
            setImage(result.assets[0].uri);
        }
    };
    return (
        <View className="p-3 flex-1">
            {image ? (
                <Image
                    source={{ uri: image }}
                    className="w-52 aspect-[3/4] self-center rounded-lg bg-slate-300"
                />
            ) : (
                <View className="w-52 aspect-[3/4] self-center rounded-lg bg-slate-300"/>
            )}

            <Text onPress={pickImage} className="text-blue-500 font-semibold m-5 self-center"> 
                Change
            </Text>

            <Text className="mb-2 text-gray-500 font-semibold"> Username </Text>
        
            <TextInput 
                placeholder="Username" 
                value={username} 
                onChangeText={setUsername}
                className="border border-gray-300 p-3 rounded-md"
            />

            <View className="gap-2 mt-auto">
                <Button title="Update Profile" />
                <Button title="Sign Out" onPress={() => supabase.auth.signOut()}/>
            </View>
        </View>

        
    );
}


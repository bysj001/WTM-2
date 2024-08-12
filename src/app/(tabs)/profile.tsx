import { Text, View, Image, TextInput, Alert, ScrollView } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from "react";
import Button from "~/src/components/Button";
import { supabase } from "~/src/lib/supabase";
import { useAuth } from "~/src/providers/AuthProvider";
import CustomTextInput from "~/src/components/CustomTextInput";
import { cld, uploadImage } from "~/src/lib/cloudinary";
import { thumbnail } from "@cloudinary/url-gen/actions/resize";
import { AdvancedImage } from "cloudinary-react-native";
import { remote } from "@cloudinary/transformation-builder-sdk/actions/customFunction";

export default function ProfileScreen() {
    const [image, setImage] = useState<string | null>(null);
    const [username, setUsername] = useState("");
    const [bio, setBio] = useState("");
    const {user} = useAuth();
    const [remoteImage, setRemoteImage] = useState<string | null>(null);

    useEffect(() => {
        getProfile();
    }, []);

    const getProfile = async () => {
        if (!user){
            return;
        }
        const {data, error} = await supabase.from('profiles').select('*').eq('id', user?.id).single();

        if (error){
            Alert.alert('Failed to fetch profile')
        }
        
        setUsername(data.username);
        setBio(data.bio);
        setRemoteImage(data.avatar_url);
    };

    const updateProfile = async () => {
        if (!user) return;

        let avatar_url = null;
        if (image) {
            try {
                const response = await uploadImage(image);
                avatar_url = response.public_id;
            } catch (error) {
                Alert.alert('Failed to upload image');
                return;
            }
        }

        const updateData = {
            username,
            bio,
            avatar_url,
        };

        if (avatar_url) {
            updateData.avatar_url = avatar_url;
        }

        const { data, error } = await supabase
            .from('profiles')
            .update(updateData)
            .eq('id', user.id);

        if (error) {
            console.error('Failed to update profile:', error);
            Alert.alert('Failed to update profile', error.message);
        } else {
            Alert.alert('Profile updated successfully');
        }
    };

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

    let remoteCldImage;
    if (remoteImage){
        remoteCldImage = cld.image(remoteImage);
        remoteCldImage.resize(thumbnail().width(300).height(300));
    }
    
    
    return (
        <View className="p-3 flex-1 bg-gray-100 dark:bg-gray-900">

            <ScrollView showsVerticalScrollIndicator={false}> 
                {image ? (
                    <Image
                        source={{ uri: image }}
                        className="w-52 aspect-square self-center rounded-full bg-slate-300"
                    />
                ) : remoteCldImage ? (<AdvancedImage cldImg={remoteCldImage} className="w-52 aspect-square self-center rounded-full bg-slate-300" />) : (
                    <View className="w-52 aspect-square self-center rounded-full bg-slate-300"/>
                )}

                <Text onPress={pickImage} className="text-blue-500 font-semibold m-5 self-center"> 
                    Change
                </Text>

                <View className="gap-4">
                    <CustomTextInput 
                        label="Username"
                        placeholder="Username" 
                        value={username} 
                        onChangeText={setUsername}
                        className="border border-gray-300 p-3 rounded-md "
                    />

                    <CustomTextInput 
                        label="Bio" 
                        placeholder="Bio" 
                        value={bio} 
                        onChangeText={setBio}
                        multiline
                        numberOfLines={3}
                    />
                </View>

                <View className="gap-2 mt-auto">
                    <Button title="Update Profile" onPress={updateProfile}/>
                    <Button title="Sign Out" onPress={() => supabase.auth.signOut()}/>
                </View>
                
            </ScrollView>
            
        </View>

        
    );
}


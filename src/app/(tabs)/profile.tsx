import { Text, View, Image, TextInput, Alert, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from "react";
import Button from "~/src/components/Button";
import { supabase } from "~/src/lib/supabase";
import { useAuth } from "~/src/providers/AuthProvider";
import CustomTextInput from "~/src/components/CustomTextInput";
import { cld, uploadImage } from "~/src/lib/cloudinary";
import { thumbnail } from "@cloudinary/url-gen/actions/resize";
import { AdvancedImage } from "cloudinary-react-native";

export default function ProfileScreen() {
    const [image, setImage] = useState<string | null>(null);
    const [username, setUsername] = useState("");
    const [bio, setBio] = useState("");
    const { user } = useAuth();
    const [remoteImage, setRemoteImage] = useState<string | null>(null);
    const [photos, setPhotos] = useState<(string | null)[]>(Array(6).fill(null));
    const [remotePhotos, setRemotePhotos] = useState<(string | null)[]>(Array(6).fill(null));

    useEffect(() => {
        getProfile();
    }, []);

    const getProfile = async () => {
        if (!user) {
            return;
        }
        const { data, error } = await supabase.from('profiles').select('*').eq('id', user?.id).single();

        if (error) {
            Alert.alert('Failed to fetch profile');
            console.error('Failed to fetch profile:', error);
        }

        setUsername(data.username);
        setBio(data.bio);
        setRemoteImage(data.avatar_url);
        setRemotePhotos([
            data.photo1_url,
            data.photo2_url,
            data.photo3_url,
            data.photo4_url,
            data.photo5_url,
            data.photo6_url
        ]);
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

        const uploadedPhotos = await Promise.all(
            photos.map(async (photo) => {
                if (photo && photo.startsWith('file://')) {
                    try {
                        const response = await uploadImage(photo);
                        return response.public_id;
                    } catch (error) {
                        console.error('Failed to upload photo:', error);
                    }
                }
                return photo;
            })
        );

        const updateData = {
            username,
            bio,
            avatar_url,
            photo1_url: uploadedPhotos[0],
            photo2_url: uploadedPhotos[1],
            photo3_url: uploadedPhotos[2],
            photo4_url: uploadedPhotos[3],
            photo5_url: uploadedPhotos[4],
            photo6_url: uploadedPhotos[5],
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
            setRemotePhotos(uploadedPhotos);
        }
    };

    const pickProfileImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const pickImage = async (index: number) => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            const updatedPhotos = [...photos];
            updatedPhotos[index] = result.assets[0].uri;
            setPhotos(updatedPhotos);
        }
    };

    let remoteCldImage;
    if (remoteImage) {
        remoteCldImage = cld.image(remoteImage);
        remoteCldImage.resize(thumbnail().width(300).height(300));
    }

    const getCldImage = (publicId: string | null) => {
        if (publicId) {
            const cldImg = cld.image(publicId);
            cldImg.resize(thumbnail().width(100).height(100));
            return cldImg;
        }
        return null;
    };

    return (
        <View className="p-3 flex-1 bg-gray-100 dark:bg-gray-900">
            <ScrollView showsVerticalScrollIndicator={false}>
                {image ? (
                    <Image
                        source={{ uri: image }}
                        className="w-52 aspect-square self-center rounded-full bg-slate-300"
                    />
                ) : remoteCldImage ? (
                    <AdvancedImage cldImg={remoteCldImage} className="w-52 aspect-square self-center rounded-full bg-slate-300" />
                ) : (
                    <View className="w-52 aspect-square self-center rounded-full bg-slate-300" />
                )}

                <Text onPress={pickProfileImage} className="text-blue-500 font-semibold m-5 self-center">
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

                <Text className="text-lg font-semibold mt-5">Edit My Photos</Text>
                <View style={styles.photoContainer}>
                    {photos.map((photo, index) => {
                        const remoteCldPhoto = getCldImage(remotePhotos[index]);
                        return (
                            <TouchableOpacity key={index} onPress={() => pickImage(index)} style={styles.photoBox}>
                                {photo ? (
                                    <Image source={{ uri: photo }} style={styles.photo} />
                                ) : remoteCldPhoto ? (
                                    <AdvancedImage cldImg={remoteCldPhoto} style={styles.photo} />
                                ) : (
                                    <Text style={styles.photoText}>+</Text>
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </View>

                <View className="gap-2 mt-auto">
                    <Button title="Update Profile" onPress={updateProfile} />
                    <Button title="Sign Out" onPress={() => supabase.auth.signOut()} />
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    photoContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    photoBox: {
        width: '30%',
        aspectRatio: 1,
        backgroundColor: '#e0e0e0',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
    },
    photo: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
    photoText: {
        color: '#888',
        fontSize: 24,
    },
});

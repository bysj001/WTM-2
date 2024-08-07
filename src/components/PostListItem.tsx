import { Text, View, Image, useWindowDimensions} from "react-native";
import {Ionicons, Feather, AntDesign } from '@expo/vector-icons';
import { Cloudinary } from "@cloudinary/url-gen";
import React from "react";
import { AdvancedImage } from "cloudinary-react-native";

import { thumbnail } from "@cloudinary/url-gen/actions/resize";
import { byRadius } from "@cloudinary/url-gen/actions/roundCorners";
import { focusOn } from "@cloudinary/url-gen/qualifiers/gravity";
import { FocusOn } from "@cloudinary/url-gen/qualifiers/focusOn";
import { cld } from '~/src/lib/cloudinary';


// Include Timer for each post of 1 hours. Each post gets 1 hour to be on the feed. 
// If match doesn't occur or does occur, it gets removed from feed


export default function PostListItem({post}) {
    const { width } = useWindowDimensions();

    // cld.image returns a CloudinaryImage with the configuration set.
    const image = cld.image(post.image);
    image.resize(thumbnail().width(width).height(width));

    // Apply the transformation.
    const avatar = cld.image(post.user.avatar_url || 'olzd8tda4rzleawvwelr');
    avatar.resize(thumbnail().width(48).height(48));  // Crop the image, focusing on the face.   // Round the corners.


    return (
        <View className="p-3 flex-row items-center gap-2 bg-white">
            <AdvancedImage 
                cldImg={avatar} 
                className="w-12 aspect-square rounded-full" 
            />
            
            <Text className="font-semibold"> 
                    {post.user.username || 'New User'} 
            </Text>

            <View className="flex-1">
                
                {/* rendering image from cloudinary */}
                <AdvancedImage cldImg={image} className="w-full aspect-[4/3] rounded" /> 
                
                <View className="flex-row gap-3 mt-2">
                    <AntDesign name="hearto" size={20} />
                    <Ionicons name="chatbubble-outline" size={20} />
                    <Feather name="send" size={20} />
                    <Feather name="bookmark" size={20} className="ml-auto" />
                </View>
            </View>
        </View>
    );
}

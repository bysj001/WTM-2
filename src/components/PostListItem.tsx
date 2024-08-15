import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions, Image } from 'react-native';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { AdvancedImage } from 'cloudinary-react-native';
import { thumbnail } from '@cloudinary/url-gen/actions/resize';
import { cld } from '~/src/lib/cloudinary';
import { supabase } from '../lib/supabase';
import { useAuth } from '../providers/AuthProvider';

export default function PostListItem({ post }) {
    const [isLiked, setIsLiked] = useState(false);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const { user } = useAuth();
    const { width } = useWindowDimensions();
    const [likeRecord, setLikeRecord] = useState(null);
    const [photos, setPhotos] = useState([]);

    useEffect(() => {
        fetchLike();
        fetchPhotos();
    }, []);

    useEffect(() => {
        if (isLiked) {
            saveLike();
        } else {
            deleteLike();
        }
    }, [isLiked]);

    const fetchLike = async () => {
        const { data } = await supabase.from('likes').select('*').eq('user_id', user?.id).eq('post_id', post.id);
        if (data && data.length > 0) {
            setLikeRecord(data[0]);
            setIsLiked(true);
        }
    };

    const saveLike = async () => {
        if (likeRecord) {
            return;
        }
        const { data } = await supabase.from('likes').insert([{ user_id: user.id, post_id: post.id }]);
        setLikeRecord(data[0]);
    };

    const deleteLike = async () => {
        if (likeRecord) {
            const { error } = await supabase.from('likes').delete().eq('id', likeRecord.id);
            if (!error) {
                setLikeRecord(null);
            }
        }
    };

    const fetchPhotos = async () => {
        const { data } = await supabase
            .from('profiles')
            .select('photo1_url, photo2_url, photo3_url, photo4_url, photo5_url, photo6_url')
            .eq('id', post.user.id)
            .single();
        if (data) {
            const photoUrls = [
                data.photo1_url,
                data.photo2_url,
                data.photo3_url,
                data.photo4_url,
                data.photo5_url,
                data.photo6_url
            ].filter(url => url);
            setPhotos(photoUrls);
        }
    };

    const handleNextPhoto = () => {
        if (photos.length > 0) {
            setCurrentPhotoIndex((prevIndex) => (prevIndex + 1) % photos.length);
        }
    };

    const handlePrevPhoto = () => {
        if (photos.length > 0) {
            setCurrentPhotoIndex((prevIndex) => (prevIndex - 1 + photos.length) % photos.length);
        }
    };

    const avatar = cld.image(post.user.avatar_url || 'olzd8tda4rzleawvwelr');
    avatar.resize(thumbnail().width(48).height(48));

    return (
        <View style={styles.container}>
            <View style={styles.box}>
                <View style={styles.profileContainer}>
                    <AdvancedImage cldImg={avatar} style={styles.avatar} />
                    <Text style={styles.username}>{post.user.username || 'New User'}</Text>
                </View>

                <View style={styles.photoContainer}>
                    {photos.length > 0 ? (
                        <>
                            <View style={styles.indicatorContainer}>
                                {photos.map((_, index) => (
                                    <View
                                        key={index}
                                        style={[
                                            styles.indicator,
                                            index === currentPhotoIndex && styles.activeIndicator,
                                        ]}
                                    />
                                ))}
                            </View>
                            <TouchableOpacity style={styles.leftEdge} onPress={handlePrevPhoto} />
                            <AdvancedImage cldImg={cld.image(photos[currentPhotoIndex]).resize(thumbnail().width(width).height(width))} style={styles.postImage} />
                            <TouchableOpacity style={styles.rightEdge} onPress={handleNextPhoto} />
                        </>
                    ) : (
                        <Text style={styles.noPhotosText}>No photos available</Text>
                    )}
                </View>

                <Text style={styles.category}>{post.category || 'No Category'}</Text>
                <Text style={styles.caption}>{post.caption || 'No Caption'}</Text>
                
                <View style={styles.iconsContainer}>
                    <AntDesign
                        onPress={() => setIsLiked(!isLiked)}
                        name={isLiked ? 'heart' : 'hearto'}
                        size={20}
                        color={isLiked ? 'crimson' : 'black'}
                    />
                    <Ionicons
                        style={styles.chatIcon}
                        name="chatbubble-outline"
                        size={20}
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: 10,
        backgroundColor: '#f9f9f9', // Background color for container
    },
    box: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 3,
    },
    profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
    },
    username: {
        marginLeft: 10,
        fontSize: 16,
        fontWeight: 'bold',
    },
    photoContainer: {
        position: 'relative',
    },
    postImage: {
        width: '100%',
        aspectRatio: 4 / 3,
        borderRadius: 10,
    },
    leftEdge: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: '15%',
        zIndex: 1,
    },
    rightEdge: {
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        width: '15%',
        zIndex: 1,
    },
    noPhotosText: {
        fontSize: 14,
        color: '#888',
        textAlign: 'center',
        marginVertical: 10,
    },
    category: {
        fontSize: 14,
        fontWeight: '500',
        color: '#666',
        marginVertical: 5,
    },
    caption: {
        fontSize: 14,
        color: '#333',
        marginVertical: 5,
        paddingHorizontal: 5,
    },
    iconsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    chatIcon: {
        marginLeft: 10,
    },
    indicatorContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 10,
    },
    indicator: {
        height: 4,
        flex: 1,
        backgroundColor: '#d3d3d3',
        marginHorizontal: 2,
    },
    activeIndicator: {
        backgroundColor: '#888',
    },
});


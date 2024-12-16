import { PropsWithChildren, useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import { StreamChat } from "stream-chat";
import { Chat, OverlayProvider } from "stream-chat-expo";
import { useAuth } from "./AuthProvider";
import { supabase } from "../lib/supabase";

const client = StreamChat.getInstance(process.env.EXPO_PUBLIC_STREAM_API_KEY);

export default function ChatProvider({ children }: PropsWithChildren) {
    const [isReady, setIsReady] = useState(false);
    const { profile } = useAuth();

    useEffect(() => {
        if (!profile?.id) return; // Exit if `profile` is not ready

        let isCancelled = false;

        const connect = async () => {
            try {
                // Construct user object for StreamChat
                const user = {
                    id: profile.id,
                    name: profile.full_name,
                    image: supabase.storage.from("avatars").getPublicUrl(profile.avatar_url).data.publicUrl,
                };

                // Connect the StreamChat client
                await client.connectUser(user, client.devToken(profile.id));

                if (!isCancelled) {
                    setIsReady(true); // Only set if component is still mounted
                }
            } catch (error) {
                console.error("StreamChat connection error:", error);
                if (!isCancelled) {
                    setIsReady(false);
                }
            }
        };

        connect();

        // Cleanup: Disconnect StreamChat client
        return () => {
            isCancelled = true; // Prevent state updates after unmount
            if (client.userID) {
                client.disconnectUser();
            }
            setIsReady(false);
        };
    }, [profile?.id]);

    if (!isReady) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <OverlayProvider>
            <Chat client={client}>{children}</Chat>
        </OverlayProvider>
    );
}

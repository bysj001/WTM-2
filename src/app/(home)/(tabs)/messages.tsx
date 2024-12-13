import { useEffect, useState } from "react";
import { StreamChat } from 'stream-chat';
import { ChannelList, Channel, Chat, OverlayProvider, MessageList, MessageInput } from "stream-chat-expo";
import { Channel as ChannelType } from 'stream-chat';
import { router } from "expo-router";
import { useAuth } from "~/src/providers/AuthProvider";

export default function MessageScreen() {
    const { user } = useAuth();

    return (
        <ChannelList 
        filters={{members: {$in: [user.id]}}}
            onSelect={(channel) => router.push(`/channel/${channel.cid}`)} 
        />

    );
}

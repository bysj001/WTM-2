import { Tabs, Redirect } from "expo-router";
import { FontAwesome } from '@expo/vector-icons';
import { useAuth } from "~/src/providers/AuthProvider";
import NotificationProvider from "~/src/providers/NotificationProvider";

export default function TabsLayout() {
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated) {
        return <Redirect href="/(auth)" />;
    }

    return (
        <NotificationProvider>
            <Tabs
                screenOptions={{
                    tabBarActiveTintColor: 'black',
                    tabBarShowLabel: false,
                    headerStyle: { backgroundColor: '#00264B' },
                    headerTintColor: 'white', // This sets the title color
                }}
            >
                <Tabs.Screen
                    name='index'
                    options={{
                        title: 'WTM',
                        tabBarIcon: ({ color }) => (
                            <FontAwesome name="home" size={26} color={color} />
                        ),
                    }}
                />

                <Tabs.Screen
                    name='new'
                    options={{
                        title: 'Create Move',
                        tabBarIcon: ({ color }) => (
                            <FontAwesome name="plus-square-o" size={26} color={color} />
                        ),
                    }}
                />

                <Tabs.Screen
                    name='likes'
                    options={{
                        title: 'Likes',
                        tabBarIcon: ({ color }) => (
                            <FontAwesome name="heart-o" size={26} color={color} />
                        ),
                    }}
                />

                <Tabs.Screen
                    name='messages'
                    options={{
                        title: 'Messages',
                        tabBarIcon: ({ color }) => (
                            <FontAwesome name="comment" size={26} color={color} />
                        ),
                    }}
                />

                <Tabs.Screen
                    name='profile'
                    options={{
                        title: 'Profile',
                        tabBarIcon: ({ color }) => (
                            <FontAwesome name="user" size={26} color={color} />
                        ),
                    }}
                />
            </Tabs>
        </NotificationProvider>
    );
}
import { Tabs, Redirect } from "expo-router";
import { FontAwesome } from '@expo/vector-icons';
import { useAuth } from "~/src/providers/AuthProvider";

export default function TabsLayout() {
    const {isAuthenticated} = useAuth();
    if (!isAuthenticated){
        return <Redirect href="/(auth)"/>;
    }
    
    return (
        <Tabs screenOptions={ {tabBarActiveTintColor: 'black', headerStyle: {backgroundColor: '#bef9fa'}, tabBarShowLabel: false}}>
            <Tabs.Screen
            name='index' 
                options={{
                    headerTitle: 'WTM',
                    tabBarIcon: ({ color }) => (
                        <FontAwesome name="home" size={26} color={color} />
                    ),
                }} 
            />

            <Tabs.Screen 
            name='new' 
                options={{
                    headerTitle: 'Create Move', 
                    tabBarIcon: ({ color }) => (
                        <FontAwesome name="plus-square-o" size={26} color={color} />
                    ),
                }} 
            />

            <Tabs.Screen 
            name='messages' 
                options={{
                    headerTitle: 'Messages', 
                    tabBarIcon: ({ color }) => (
                        <FontAwesome name="comment" size={26} color={color} />
                    ),
                }} 
            />  

            <Tabs.Screen 
            name='profile' 
                options={{
                    headerTitle: 'Profile', 
                    tabBarIcon: ({ color }) => (
                        <FontAwesome name="user" size={26} color={color} />
                    ),
                }} 
            />

        </Tabs>
    );
}
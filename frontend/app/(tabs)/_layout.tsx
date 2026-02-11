import { Tabs } from 'expo-router'
import { View, Text } from 'react-native'
import {Ionicons} from "@expo/vector-icons"

const TabsLayout = () => {
    return (
        <Tabs screenOptions={{
                tabBarActiveTintColor: "blue",
                tabBarInactiveTintColor: "black",
                tabBarStyle:{
                    backgroundColor: "white",
                    borderTopWidth: 1,
                    borderTopColor: "grey",
                    height: 90,
                    paddingBottom: 30,
                    paddingTop: 10,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: "100",
                },
                headerShown: false,
            }}>
            <Tabs.Screen
                name='index'
                options={{
                    title:"Home",
                    tabBarIcon: ({color,size}) => (
                        <Ionicons name='home-outline' size={size} color={color}/>
                    ),
                }}
            />
            <Tabs.Screen
                name='about'
                options={{
                    title:"About",
                    tabBarIcon: ({color,size}) => (
                        <Ionicons name='bar-chart-outline' size={size} color={color}/>
                    ),
                }}
            />
            <Tabs.Screen
                name='settings'
                options={{
                    title:"Settings",
                    tabBarIcon: ({color,size}) => (
                        <Ionicons name='settings' size={size} color={color}/>
                    )
                }}
            />
        </Tabs>
    )
}

export default TabsLayout
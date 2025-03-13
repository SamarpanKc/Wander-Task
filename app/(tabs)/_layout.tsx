import React from 'react';
import { Tabs } from 'expo-router';
import { MapPin, ListTodo, Settings } from 'lucide-react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { StyleSheet, useColorScheme } from 'react-native';

export default function TabLayout() {
  const tabBarStyle = {
    borderTopWidth: 1,
    borderTopColor: useThemeColor({}, 'border'),
    backgroundColor: useThemeColor({}, 'card'),
  };

  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colorScheme === 'dark' ? '#fff' : '#007AFF',
        tabBarInactiveTintColor: colorScheme === 'dark' ? '#A9A9A9' : '#8E8E93',
        tabBarStyle: tabBarStyle,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Wander Task',
          tabBarIcon: ({ color, size }) => (
            <ListTodo size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Map',
          tabBarIcon: ({ color, size }) => (
            <MapPin size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Settings size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
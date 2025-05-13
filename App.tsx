// App.tsx
import React, { useEffect, useRef, useState } from 'react';
import { View, Animated, StyleSheet, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './LoginScreen';
import CategoryScreen from './category';
import Politics from './Politics';
import Sports from './Sports';
import International from './international';
import SignupScreen from './Signup';
import BlogScreen from './BlogListScreen';
import AddBlogScreen from './AddBlogScreen';
import BlogDetailScreen from './BlogDetailScreen';
import LiveNews from './LiveNews';
import ProfileScreen from './ProfileScreen';
export type RootStackParamList = {
  Login: undefined;
  Categories: undefined;
  Politics: undefined;
  Sports: undefined;
  International: undefined;
  Signup: undefined;
  Blog: undefined;
  AddBlog: undefined;
  BlogDetail: undefined;
  LiveNews: undefined;
  Profile: undefined;

};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  const [isSplashVisible, setSplashVisible] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      setSplashVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (isSplashVisible) {
    return (
      <View style={styles.splashContainer}>
        <Animated.Image
          source={require('./assets/logo.jpg')}
          style={[styles.logo, { opacity: fadeAnim }]}
          resizeMode="contain"
        />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Categories" component={CategoryScreen} />
        <Stack.Screen name="Politics" component={Politics} />
        <Stack.Screen name="Sports" component={Sports} />
        <Stack.Screen name="International" component={International} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Blog" component={BlogScreen} />
        <Stack.Screen name="AddBlog" component={AddBlogScreen} />
        <Stack.Screen name="BlogDetail" component={BlogDetailScreen} />
        <Stack.Screen name="LiveNews" component={LiveNews} />
        <Stack.Screen name="Profile" component={ProfileScreen} /> 
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
  },
});

export default App;

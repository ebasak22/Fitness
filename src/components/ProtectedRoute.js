// src/components/ProtectedRoute.js
import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import auth from '@react-native-firebase/auth';
import { CommonActions } from '@react-navigation/native';

const ProtectedRoute = ({ navigation, route, adminOnly = false }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async (currentUser) => {
      try {
        if (currentUser) {
          // Check for admin claim if adminOnly is true
          const idTokenResult = await currentUser.getIdTokenResult();
          if (!adminOnly || (adminOnly && idTokenResult.claims.admin)) {
            setUser(currentUser);
          } else {
            setUser(null);
            // Navigate to login
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              })
            );
          }
        } else {
          setUser(null);
          // Navigate to login
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            })
          );
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [navigation, adminOnly]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // If authenticated, render the screen
  return route.params?.component ? <route.params.component /> : null;
};

export default ProtectedRoute;

// Usage example in navigation setup:
/*
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen 
        name="ProtectedScreen" 
        component={ProtectedRoute}
        initialParams={{ 
          component: YourProtectedComponent,
          adminOnly: false // optional
        }} 
      />
      <Stack.Screen 
        name="AdminScreen" 
        component={ProtectedRoute}
        initialParams={{ 
          component: AdminComponent,
          adminOnly: true
        }} 
      />
    </Stack.Navigator>
  );
}
*/
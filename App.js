import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

// Import your screens
import RegisterScreen from './src/screens/RegisterScreen';
import CompleteProfileScreen from './src/screens/CompleteProfileScreen';
import DashboardScreen from './src/screens/DashBoardScreen';
import DefaultScreen from './src/screens/DefaultScreen';
import MenuScreen from './src/screens/MenuScreen';
import UpdateDetailsScreen from './src/screens/UpdateDetailsScreen';
import MembershipDetailsScreen from './src/screens/MembershipDetailsScreen';
import AboutUsScreen from './src/screens/AboutUsScreen';
import ContactUsScreen from './src/screens/ContactUsScreen';
import PrivacyPolicyScreen from './src/screens/PrivacyPolicyScreen';
import TermsConditionsScreen from './src/screens/TermsConditionsScreen';
import RefundPolicyScreen from './src/screens/RefundPolicyScreen';
import ProfileSettingsScreen from './src/screens/ProfileSettingsScreen';
import EditProfileScreen from './src/screens/EditProfileScreen';
import AddressesScreen from './src/screens/AddressScreen';
import ShippingAddressDetailScreen from './src/screens/ShippingAddressDetailsScreen';
import GoalSettingScreen from './src/screens/GoalSettingScreen';
import WorkoutTrackerScreen from './src/components/WorkoutTrackerScreen';
import ExerciseChartScreen from './src/components/ExerciseChartScreen';
import ExerciseVideosScreen from './src/components/ExerciseVideosScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  const [userData, setUserData] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const fetchUserData = async (user) => {
      try {
        if (user?.phoneNumber) {
          const userDocRef = firestore().collection('users').doc(user.phoneNumber);
          const userDocSnap = await userDocRef.get();
            
          if (userDocSnap.exists) {
            setUserData(userDocSnap.data());
          } else {
            await userDocRef.set({
              phoneNumber: user.phoneNumber,
              createdAt: firestore.FieldValue.serverTimestamp()
            });
          }
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    // Handle user state changes
    const unsubscribe = auth().onAuthStateChanged(user => {
      if (user) {
        fetchUserData(user);
      } else {
        setUserData(null);
        setIsAuthenticated(false);
      }
    });
    
    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Register"
        screenOptions={{
          headerShown: true,
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTintColor: '#000',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        {/* Public Routes */}
        {!isAuthenticated ? (
          <>
            <Stack.Screen 
              name="Register" 
              component={RegisterScreen} 
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="DefaultScreen" 
              component={DefaultScreen}
            />
          </>
        ) : (
          <>
            {/* Protected Routes */}
            <Stack.Screen name="CompleteProfile" component={CompleteProfileScreen} />
            <Stack.Screen name="Dashboard" component={DashboardScreen} />
            <Stack.Screen 
              name="Menu" 
              component={MenuScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="UpdateDetails" component={UpdateDetailsScreen} />
            <Stack.Screen 
              name="MembershipDetails" 
              component={MembershipDetailsScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="ProfileSettings" component={ProfileSettingsScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Stack.Screen name="Addresses" component={AddressesScreen} />
            <Stack.Screen name="ShippingAddressDetail" component={ShippingAddressDetailScreen} />
            <Stack.Screen 
              name="GoalSetting" 
              component={GoalSettingScreen} 
              options={{ headerShown: false }}
            />
            <Stack.Screen name="WorkoutTracker" component={WorkoutTrackerScreen} />
            <Stack.Screen name="ExerciseChart" component={ExerciseChartScreen} />
            <Stack.Screen 
              name="ExerciseVideos" 
              component={ExerciseVideosScreen}
              initialParams={{
                programType: userData?.fitnessGoals?.targetGoal,
                userPhone: auth().currentUser?.phoneNumber
              }}
            />
            
            {/* Information Screens */}
            <Stack.Screen name="About" component={AboutUsScreen} />
            <Stack.Screen name="Contact" component={ContactUsScreen} />
            <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
            <Stack.Screen name="Terms" component={TermsConditionsScreen} />
            <Stack.Screen name="RefundPolicy" component={RefundPolicyScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
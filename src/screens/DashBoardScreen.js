import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  BackHandler,
} from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

// Import your tab components
import HomeTab from './HomeTab';
import NotificationsTab from './NotificationsTab';
import ShoppingTab from './ShoppingTab';
import AboutTrainers from './AboutTrainers';

const Tab = createMaterialTopTabNavigator();
const defaultAvatar = require('../assets/default-avatar.png');

const DashboardScreen = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [profileImage, setProfileImage] = useState(defaultAvatar);
  const [refreshing, setRefreshing] = useState(false);
  
  const navigation = useNavigation();

  // Handle back button
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        Alert.alert(
          'Exit App',
          'Are you sure you want to exit?',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Exit', 
              onPress: () => BackHandler.exitApp(),
              style: 'destructive'
            }
          ]
        );
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [])
  );

  const fetchUserData = async (showLoader = true) => {
    try {
      const user = auth().currentUser;
      if (!user) {
        navigation.replace('Register');
        return;
      }

      if (showLoader) setLoading(true);

      const userRef = firestore().collection('users').doc(user.phoneNumber);
      const userDoc = await userRef.get();
   
    } catch (error) {
      console.error('Error fetching user data:', error);
      Alert.alert(
        'Error',
        'Failed to load user data. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateMembership = async () => {
    try {
      const user = auth().currentUser;
      if (!user) {
        Alert.alert('Error', 'Please log in again.');
        return;
      }
      
      setLoading(true);
      
      // Navigate to membership update screen
      navigation.navigate('MembershipDetails', {
        currentPlan: userData?.membershipPlan,
        onUpdateComplete: fetchUserData
      });
    } catch (error) {
      console.error('Error in handleUpdateMembership:', error);
      Alert.alert('Error', 'Failed to update membership. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          onPress: async () => {
            try {
              await auth().signOut();
              navigation.replace('Register');
            } catch (error) {
              console.error('Error signing out:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
          style: 'destructive'
        }
      ]
    );
  };

  // Set up real-time listener for user data
  useEffect(() => {
    const user = auth().currentUser;
    if (!user) {
      navigation.replace('Register');
      return;
    }

    const userRef = firestore()
      .collection('users')
      .doc(user.phoneNumber);

    const unsubscribe = userRef.onSnapshot(
      (doc) => {
        if (doc.exists) {
          const data = doc.data();
          setUserData(data);
          setProfileImage(data.profileImage ? { uri: data.profileImage } : defaultAvatar);
        }
      },
      (error) => {
        console.error('User data listener error:', error);
      }
    );

    // Clean up listener
    return () => unsubscribe();
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchUserData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0d6efd" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.profileContainer}
            onPress={() => navigation.navigate('Menu')}
            activeOpacity={0.7}
          >
            <Image
              source={profileImage}
              style={styles.profileImage}
              defaultSource={defaultAvatar}
            />
          </TouchableOpacity>
          <View style={styles.userInfo}>
            <Text style={styles.welcomeText}>
              Welcome, {userData?.name || 'User'}
            </Text>
            <Text style={styles.membershipStatus}>
              {userData?.membershipPlan || 'No Plan'}
            </Text>
          </View>
        </View>
        <View style={styles.buttonContainer}>
        
        
        </View>
      </View>

      <Tab.Navigator
        screenOptions={{
          tabBarLabelStyle: styles.tabLabel,
          tabBarStyle: styles.tabBar,
          tabBarIndicatorStyle: styles.tabIndicator,
          tabBarActiveTintColor: '#0d6efd',
          tabBarInactiveTintColor: '#6c757d',
          tabBarPressColor: 'rgba(13, 110, 253, 0.1)',
        }}
      >
        <Tab.Screen 
          name="Home" 
          component={HomeTab}
          options={{
            tabBarLabel: 'Home'
          }}
        />
        <Tab.Screen
          name="Notifications"
          component={NotificationsTab}
          options={{
            tabBarBadge: unreadNotifications > 0 ? unreadNotifications : null,
            tabBarBadgeStyle: {
              backgroundColor: '#dc3545',
              color: '#fff'
            }
          }}
        />
        <Tab.Screen name="Shop" component={ShoppingTab} />
        <Tab.Screen name="About" component={AboutTrainers} />
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  // Existing styles remain the same
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 15,
    marginTop: 15,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileContainer: {
    marginRight: 15,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  userInfo: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
  },
  membershipStatus: {
    fontSize: 14,
    color: '#6c757d',
    marginTop: 2,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  updateButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#0d6efd',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 10,
  },
  buttonText: {
    color: '#0d6efd',
    fontSize: 14,
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#dc3545',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  logoutButtonText: {
    color: '#dc3545',
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  tabBar: {
    elevation: 0,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'none',
  },
  tabIndicator: {
    backgroundColor: '#0d6efd',
    height: 2,
  },
});

export default DashboardScreen;
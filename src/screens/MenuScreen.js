import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

const MenuScreen = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  const fetchUserData = useCallback(async (user) => {
    if (!user) {
      navigation.navigate('Login');
      return;
    }

    try {
      const timeoutDuration = 15000;
      const fetchWithTimeout = async (promise) => {
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Request timed out')), timeoutDuration)
        );
        return Promise.race([promise, timeoutPromise]);
      };

      const unsubscribe = firestore()
        .collection('users')
        .doc(user.phoneNumber)
        .onSnapshot(
          {
            // Enable offline persistence
            includeMetadataChanges: true,
          },
          (documentSnapshot) => {
            if (documentSnapshot.exists) {
              const userData = documentSnapshot.data();
              setUserData(userData);
              setProfileImage(userData.profileImage || null);
              setLoading(false);
            } else {
              // Handle case where user document doesn't exist
              console.warn('User document does not exist');
              setError('User profile not found');
              setLoading(false);
            }
          },
          (error) => {
            console.error('Firestore error:', error);
            setError(
              error.code === 'firestore/permission-denied'
                ? 'Access denied. Please check your permissions.'
                : error.message === 'Request timed out'
                ? 'Connection timeout. Please check your internet connection.'
                : 'Error loading profile data'
            );
            setLoading(false);
          }
        );

      return () => unsubscribe();
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError(
        err.message === 'Request timed out'
          ? 'Connection timeout. Please check your internet connection.'
          : 'Error loading profile data'
      );
      setLoading(false);
    }
  }, [navigation]);
  useEffect(() => {
    // Enable offline persistence when component mounts
    const enablePersistence = async () => {
      try {
        await firestore().settings({
          cacheSizeBytes: firestore.CACHE_SIZE_UNLIMITED,
          persistence: true,
        });
      } catch (error) {
        if (error.code === 'firestore/failed-precondition') {
          // Multiple tabs open, persistence can only be enabled in one tab at a time
          console.warn('Persistence already enabled in another tab');
        } else if (error.code === 'firestore/unimplemented') {
          // The current platform doesn't support persistence
          console.warn('Persistence not supported on this platform');
        }
      }
    };

    enablePersistence();

    let unsubscribeAuth;
    let unsubscribeFirestore;

    const setupSubscriptions = () => {
      unsubscribeAuth = auth().onAuthStateChanged((user) => {
        if (user) {
          unsubscribeFirestore = fetchUserData(user);
        } else {
          navigation.navigate('Login');
        }
      });
    };

    setupSubscriptions();
    return () => {
      if (unsubscribeAuth) unsubscribeAuth();
      if (unsubscribeFirestore) unsubscribeFirestore();
    };
  }, [fetchUserData, navigation]);
  
  const generateSparkfitnessId = useCallback((phoneNumber) => {
    if (!phoneNumber) return '';
    const numericPhone = phoneNumber.replace(/\D/g, '');
    const lastTenDigits = numericPhone.slice(-10);
    return `1916${lastTenDigits}`;
  }, []);

  const handleMetricClick = useCallback(() => {
    if (!loading) {
      navigation.navigate('UpdateDetails');
    }
  }, [loading, navigation]);

  const calculateBMI = useCallback((height, weight) => {
    if (!height || !weight) return '--';
    return (weight / Math.pow(height/100, 2)).toFixed(1);
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Loading your profile...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1a2980', '#26d0ce']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.gradient}
      >
        <ScrollView style={styles.scrollView}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            disabled={loading}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          
          <View style={styles.profileHeader}>
            <View style={styles.profileInfo}>
              <View style={styles.profileImageContainer}>
                {profileImage ? (
                  <Image
                    source={{ uri: profileImage }}
                    style={styles.profileImage}
                    defaultSource={require('../assets/default-avatar.png')}
                  />
                ) : (
                  <View style={styles.profileImagePlaceholder}>
                    <Ionicons name="person-circle-outline" size={60} color="white" />
                  </View>
                )}
              </View>
              <Text style={styles.username}>{userData?.name || 'User'}</Text>
              <Text style={styles.sparkfitnessId}>
                SPARKFITNESS ID - {generateSparkfitnessId(auth().currentUser?.phoneNumber)}
              </Text>
              {error && <Text style={styles.errorMessage}>{error}</Text>}
            </View>
          </View>

          <View style={styles.metricsCard}>
            <View style={styles.metricsGrid}>
              <TouchableOpacity style={styles.metric} onPress={handleMetricClick}>
                <Text style={styles.metricValue}>{userData?.height || '--'}</Text>
                <Text style={styles.metricLabel}>Height (cm)</Text>
                <Text style={styles.metricArrow}>›</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.metric} onPress={handleMetricClick}>
                <Text style={styles.metricValue}>{userData?.weight || '--'}</Text>
                <Text style={styles.metricLabel}>Weight (kg)</Text>
                <Text style={styles.metricArrow}>›</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.metric} onPress={handleMetricClick}>
                <Text style={styles.metricValue}>
                  {calculateBMI(userData?.height, userData?.weight)}
                </Text>
                <Text style={styles.metricLabel}>BMI</Text>
                <Text style={styles.metricArrow}>›</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.membershipCard}
            onPress={() => !loading && navigation.navigate('MembershipDetails')}
          >
            <View style={styles.membershipInfo}>
              <View style={styles.membershipDetails}>
                <View style={styles.membershipIcon}>
                  <Text style={styles.emoji}>🏋️</Text>
                </View>
                <View style={styles.membershipText}>
                  <Text style={styles.membershipTitle}>Membership Details</Text>
                  <Text style={[
                    styles.membershipStatus,
                    { color: userData?.membershipStatus === 'active' ? '#4CAF50' : '#ff4444' }
                  ]}>
                    {userData?.membershipStatus === 'active' 
                      ? 'Your Membership is Active' 
                      : 'Your Membership is InActive'}
                  </Text>
                  <Text style={styles.membershipPlans}>
                    IGNITE ({userData?.plans?.ignite || 'InActive'}), 
                    GLOW({userData?.plans?.glow || 'InActive'}), 
                    BLAZE({userData?.plans?.blaze || 'InActive'}), 
                    INFERNO ({userData?.plans?.inferno || 'InActive'})
                  </Text>
                </View>
              </View>
              <Text style={styles.membershipArrow}>›</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.membershipCard}
            onPress={() => !loading && navigation.navigate('ProfileSettings')}
          >
            <View style={styles.membershipInfo}>
              <View style={styles.membershipDetails}>
                <View style={styles.membershipIcon}>
                  <Text style={styles.emoji}>👤</Text>
                </View>
                <View style={styles.membershipText}>
                  <Text style={styles.membershipTitle}>Profile Settings</Text>
                  <Text style={[styles.membershipStatus, { color: '#666' }]}>
                    Edit Profile, Address, Billing Details
                  </Text>
                  <Text style={styles.membershipPlans}>
                    Terms & Conditions, Privacy Policy, About
                  </Text>
                </View>
              </View>
              <Text style={styles.membershipArrow}>›</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a2980',
  },
  loadingText: {
    color: 'white',
    marginTop: 10,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
    padding: 10,
  },
  profileHeader: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  profileInfo: {
    alignItems: 'center',
  },
  profileImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: 'white',
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  profileImagePlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  username: {
    fontSize: 28,
    fontWeight: '600',
    color: 'white',
    marginBottom: 8,
  },
  sparkfitnessId: {
    fontSize: 14,
    color: 'white',
    opacity: 0.9,
    letterSpacing: 0.5,
  },
  errorMessage: {
    color: '#ff4444',
    backgroundColor: 'rgba(255, 68, 68, 0.1)',
    padding: 8,
    borderRadius: 4,
    marginTop: 10,
    fontSize: 14,
  },
  metricsCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    margin: 20,
    padding: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  metric: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },
  metricValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a2980',
    marginBottom: 5,
  },
  metricLabel: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  metricArrow: {
    position: 'absolute',
    right: -15,
    top: '50%',
    color: '#26d0ce',
    fontSize: 20,
    fontWeight: 'bold',
  },
  membershipCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    margin: 20,
    marginTop: 0,
    padding: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  membershipInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 50,
    paddingLeft: 10,
  },
  membershipDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  membershipIcon: {
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 10,
    marginRight: 15,
  },
  emoji: {
    fontSize: 24,
  },
  membershipText: {
    flex: 1,
  },
  membershipTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 5,
    color: '#000',
  },
  membershipStatus: {
    fontSize: 16,
    marginBottom: 5,
  },
  membershipPlans: {
    color: '#666',
    fontSize: 14,
  },
  membershipArrow: {
    position: 'absolute',
    right: 0,
    color: '#26d0ce',
    fontSize: 28,
    fontWeight: 'bold',
  },
});

export default MenuScreen;
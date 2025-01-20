import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import ExerciseChartScreen from '../components/ExerciseChartScreen';
import CalorieTrackerScreen from '../components/CalorieTrackerScreen';

const HomeTab = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);

  const fetchUserData = useCallback(async () => {
   
    const user = auth().currentUser;
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
              console.log('sdsd', userData)
              setUserData(userData);
             
            } else {
              // Handle case where user document doesn't exist
              console.warn('User document does not exist');
            
            }
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
    
    fetchUserData()
  }, [fetchUserData, navigation]);



  const formatDate = (dateString) => {
    if (!dateString) return 'Not Set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDaysRemaining = () => {
    if (!userData?.membershipEndDate) return null;
    const endDate = new Date(userData.membershipEndDate);
    const today = new Date();
    return Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
  };

  const calculateHeartRateZones = (age) => {
    const maxHeartRate = 220 - age;
    return {
      maximum: maxHeartRate,
      moderateZone: {
        min: Math.round(maxHeartRate * 0.64),
        max: Math.round(maxHeartRate * 0.76)
      },
      fatBurningZone: {
        min: Math.round(maxHeartRate * 0.77),
        max: Math.round(maxHeartRate * 0.93)
      },
      peakZone: {
        min: Math.round(maxHeartRate * 0.94),
        max: maxHeartRate
      }
    };
  };

  const renderMembershipCard = () => (
    <View style={styles.card}>
      <View style={styles.planDetails}>
        <View style={styles.currentPlan}>
          <Text style={styles.heading}>Current Plan: 
            <Text style={styles.planName}> {userData?.membershipPlan || 'No Plan'}</Text>
          </Text>
          <Text style={styles.planDuration}>Duration: {userData?.planDuration || 'Not Set'}</Text>
        </View>
        {userData?.membershipPlan !== 'No Plan' && (
          <View style={styles.planDates}>
            <View style={styles.dateItem}>
              <Text style={styles.dateLabel}>Start Date:</Text>
              <Text style={styles.dateValue}>{formatDate(userData?.membershipStartDate)}</Text>
            </View>
            <View style={styles.dateItem}>
              <Text style={styles.dateLabel}>End Date:</Text>
              <Text style={styles.dateValue}>{formatDate(userData?.membershipEndDate)}</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
  const renderCalariTrakcer = () => (
    <View style={styles.card}>
      <CalorieTrackerScreen />
    </View>
  );

  const renderWarningMessage = () => {
    const daysRemaining = getDaysRemaining();

    if (userData?.membershipEndDate && new Date(userData.membershipEndDate) < new Date()) {
      return (
        <View style={[styles.alert, styles.alertDanger]}>
          <Text style={styles.alertText}>
            Your current package has expired. All application based services will be blocked within 3 days.
          </Text>
        </View>
      );
    }

    if (daysRemaining <= 5 && daysRemaining > 1) {
      return (
        <View style={[styles.alert, styles.alertWarning]}>
          <Text style={styles.alertText}>
            Your plan will expire within {daysRemaining} days, renew to have uninterrupted services
          </Text>
        </View>
      );
    }

    if (daysRemaining === 1) {
      return (
        <View style={[styles.alert, styles.alertWarningUrgent]}>
          <Text style={styles.alertText}>
            Your plan will expire tomorrow, renew now to avoid service interruption
          </Text>
        </View>
      );
    }

    return null;
  };

  const renderFitnessGoals = () => (
    <View style={styles.card}>
      <Text style={styles.cardHeader}>Fitness Goals</Text>
      {userData?.fitnessGoals ? (
        <View style={styles.fitnessGoals}>
          <View style={styles.goalsInfo}>
            <View style={styles.goalRow}>
              <Text style={styles.goalLabel}>Height</Text>
              <Text style={styles.goalValue}>{userData.fitnessGoals.height} cm</Text>
            </View>
            <View style={styles.goalRow}>
              <Text style={styles.goalLabel}>Weight</Text>
              <Text style={styles.goalValue}>{userData.fitnessGoals.weight} kg</Text>
            </View>
            <View style={styles.goalRow}>
              <Text style={styles.goalLabel}>Age</Text>
              <Text style={styles.goalValue}>{userData.fitnessGoals.age} years</Text>
            </View>
            <View style={styles.goalRow}>
              <Text style={styles.goalLabel}>Blood Group</Text>
              <Text style={styles.goalValue}>{userData.fitnessGoals.bloodGroup}</Text>
            </View>
            <View style={styles.goalRow}>
              <Text style={styles.goalLabel}>BMI</Text>
              <View style={styles.bmiContainer}>
                <Text style={styles.goalValue}>{userData.fitnessGoals.bmi}</Text>
                <View style={[
                  styles.badge,
                  userData.fitnessGoals.category === 'Normal weight' ? styles.badgeSuccess :
                  userData.fitnessGoals.category === 'Underweight' ? styles.badgeWarning :
                  styles.badgeDanger
                ]}>
                  <Text style={styles.badgeText}>{userData.fitnessGoals.category}</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.goalsFooter}>
            <View style={styles.targetGoal}>
              <Text style={styles.targetGoalLabel}>Target Goal:</Text>
              <Text style={styles.targetGoalValue}>
                {userData.fitnessGoals.targetGoal
                  ? userData.fitnessGoals.targetGoal
                      .split('_')
                      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(' ')
                  : 'Not set'
                }
              </Text>
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('GoalSetting')}
            >
              <Text style={styles.buttonText}>Update Goals</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.noGoals}>
          <Text style={styles.noGoalsText}>No fitness goals set yet.</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('GoalSetting')}
          >
            <Text style={styles.buttonText}>Set Your Goals</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {renderCalariTrakcer()}
        {renderMembershipCard()}
        {renderWarningMessage()}
        {renderFitnessGoals()}
        <ExerciseChartScreen targetGoal={userData?.fitnessGoals?.targetGoal} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  planDetails: {
    padding: 10,
  },
  currentPlan: {
    marginBottom: 15,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  planName: {
    color: '#0d6efd',
    fontWeight: 'bold',
  },
  planDuration: {
    color: '#666',
    fontSize: 14,
  },
  planDates: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  dateItem: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 13,
    color: '#666',
  },
  dateValue: {
    fontWeight: '500',
    color: '#333',
    marginTop: 5,
  },
  alert: {
    margin: 10,
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 5,
  },
  alertDanger: {
    backgroundColor: '#f8d7da',
    borderLeftColor: '#dc3545',
  },
  alertWarning: {
    backgroundColor: '#fff3cd',
    borderLeftColor: '#ffc107',
  },
  alertWarningUrgent: {
    backgroundColor: '#ffe5d0',
    borderLeftColor: '#fd7e14',
  },
  alertText: {
    fontSize: 14,
    color: '#333',
  },
  cardHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  fitnessGoals: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
  },
  goalsInfo: {
    marginTop: 15,
  },
  goalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  goalLabel: {
    color: '#495057',
    fontWeight: '500',
  },
  goalValue: {
    color: '#333',
  },
  bmiContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 8,
  },
  badgeSuccess: {
    backgroundColor: '#28a745',
  },
  badgeWarning: {
    backgroundColor: '#ffc107',
  },
  badgeDanger: {
    backgroundColor: '#dc3545',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
  },
  goalsFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  targetGoal: {
    flex: 1,
  },
  targetGoalLabel: {
    color: '#495057',
    fontWeight: '500',
  },
  targetGoalValue: {
    color: '#333',
    backgroundColor: '#e9ecef',
    padding: 4,
    borderRadius: 4,
    marginTop: 5,
  },
  button: {
    backgroundColor: '#0d6efd',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
  },
  noGoals: {
    alignItems: 'center',
    padding: 20,
  },
  noGoalsText: {
    color: '#666',
    marginBottom: 15,
  },
});

export default HomeTab;
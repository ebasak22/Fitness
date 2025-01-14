import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  FlatList,
  Switch,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import LinearGradient from 'react-native-linear-gradient';

const DefaultScreen = () => {
  const [userData, setUserData] = useState(null);
  const [allExercises, setAllExercises] = useState([]);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [profileImage, setProfileImage] = useState(null);
  const navigation = useNavigation();

  // Default avatar
  const defaultAvatar = "https://raw.githubusercontent.com/shadcn-ui/ui/main/apps/www/public/avatars/01.png";

  // Mock exercise data
  const mockExercises = [
    {
      id: '1',
      name: 'Bench Press',
      description: 'Lie on a flat bench, lower the barbell to chest level, and press upward until arms are fully extended.',
      sets: '3 sets of 12 reps'
    },
    {
      id: '2',
      name: 'Squats',
      description: 'Stand with feet shoulder-width apart, lower your body by bending knees and hips.',
      sets: '4 sets of 10 reps'
    },
    {
      id: '3',
      name: 'Deadlift',
      description: 'Stand with feet hip-width apart, bend at hips and knees to grasp barbell.',
      sets: '3 sets of 8 reps'
    }
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth().currentUser;
        if (!user) {
          setIsLoading(false);
          return;
        }

        const userDoc = await firestore()
          .collection('users')
          .doc(user.phoneNumber)
          .get();

        if (userDoc.exists) {
          const data = userDoc.data();
          setUserData(data);
          if (data.profileImage) {
            setProfileImage(data.profileImage);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        Alert.alert('Error', 'Failed to load user data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    setAllExercises(mockExercises);
  }, []);

  const handleExerciseToggle = (exerciseId) => {
    setSelectedExercises(prev =>
      prev.includes(exerciseId)
        ? prev.filter(id => id !== exerciseId)
        : [...prev, exerciseId]
    );
  };

  const handleAssignExercises = async () => {
    if (selectedExercises.length === 0) {
      Alert.alert('Error', 'Please select at least one exercise');
      return;
    }

    try {
      setIsLoading(true);
      const user = auth().currentUser;
      
      if (!user) {
        Alert.alert('Error', 'Please login first');
        return;
      }

      await firestore()
        .collection('users')
        .doc(user.phoneNumber)
        .collection('exercises')
        .doc('assigned')
        .set({
          exercises: selectedExercises,
          updatedAt: firestore.FieldValue.serverTimestamp()
        });

      Alert.alert('Success', 'Exercises assigned successfully!');
      setSelectedExercises([]);
    } catch (error) {
      console.error('Error assigning exercises:', error);
      Alert.alert('Error', 'Failed to assign exercises');
    } finally {
      setIsLoading(false);
    }
  };

  const renderExerciseItem = ({ item }) => (
    <View style={styles.exerciseItem}>
      <View style={styles.exerciseHeader}>
        <Text style={styles.exerciseName}>{item.name}</Text>
        <Switch
          value={selectedExercises.includes(item.id)}
          onValueChange={() => handleExerciseToggle(item.id)}
          trackColor={{ false: '#cbd5e0', true: '#4299e1' }}
          thumbColor={selectedExercises.includes(item.id) ? '#2b6cb0' : '#f4f3f4'}
        />
      </View>
      <Text style={styles.exerciseDescription}>{item.description}</Text>
      <Text style={styles.exerciseSets}>{item.sets}</Text>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0d6efd" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Profile Header */}
      <LinearGradient
        colors={['#1a2980', '#26d0ce']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.profileHeader}
      >
        <TouchableOpacity
          style={styles.profileSection}
          onPress={() => navigation.navigate('Menu')}
          activeOpacity={0.7}
        >
          <Image
            source={profileImage ? { uri: profileImage } : { uri: defaultAvatar }}
            style={styles.profileAvatar}
            defaultSource={{ uri: defaultAvatar }}
          />
          <Text style={styles.profileGreeting}>
            Hi, {userData?.name?.split(' ')[0] || 'Guest'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {/* Exercise List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>General Gym Exercise Chart</Text>
          <FlatList
            data={allExercises}
            renderItem={renderExerciseItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
          />
        </View>

        {/* Assign Button */}
        {selectedExercises.length > 0 && (
          <TouchableOpacity
            style={styles.assignButton}
            onPress={handleAssignExercises}
            disabled={isLoading}
          >
            <Text style={styles.assignButtonText}>
              {isLoading ? 'Assigning...' : 'Assign Selected Exercises'}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileHeader: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  profileAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#fff',
  },
  profileGreeting: {
    fontSize: 18,
    fontWeight: '500',
    color: '#fff',
    opacity: 0.9,
  },
  loginButton: {
    backgroundColor: '#007bff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    color: '#1a2980',
  },
  exerciseItem: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3748',
  },
  exerciseDescription: {
    fontSize: 14,
    color: '#4a5568',
    marginBottom: 8,
    lineHeight: 20,
  },
  exerciseSets: {
    fontSize: 14,
    color: '#2b6cb0',
    fontWeight: '500',
  },
  assignButton: {
    backgroundColor: '#1a2980',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
  },
  assignButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default DefaultScreen;
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Alert,
  SafeAreaView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker';
import Accordion from 'react-native-collapsible/Accordion';

const WorkoutTrackerScreen = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const [weeklyWorkouts, setWeeklyWorkouts] = useState({
    Monday: [{ exercise: '', sets: '', duration: '', rest: '' }],
    Tuesday: [{ exercise: '', sets: '', duration: '', rest: '' }],
    Wednesday: [{ exercise: '', sets: '', duration: '', rest: '' }],
    Thursday: [{ exercise: '', sets: '', duration: '', rest: '' }],
    Friday: [{ exercise: '', sets: '', duration: '', rest: '' }],
    Saturday: [{ exercise: '', sets: '', duration: '', rest: '' }]
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [recommendedProgram, setRecommendedProgram] = useState({});
  const [dailyFeedback, setDailyFeedback] = useState({});
  const [activeSections, setActiveSections] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      let retryCount = 0;
      const maxRetries = 3;
      const timeoutDuration = 15000;

      const attemptFetch = async () => {
        try {
          const user = auth().currentUser;
          if (!user) {
            navigation.navigate('Home');
            return;
          }

          const userDoc = await firestore()
            .collection('users')
            .doc(user.phoneNumber)
            .get();

          if (userDoc.exists) {
            const data = userDoc.data();
            setUserData(data);
            if (data.fitnessGoals?.targetGoal) {
              const program = getRecommendedProgram(data.fitnessGoals.targetGoal);
              setRecommendedProgram(program);
            }
            if (data.weeklyWorkouts) {
              setWeeklyWorkouts(data.weeklyWorkouts);
              const initialFeedback = {};
              Object.entries(data.weeklyWorkouts).forEach(([day, exercises]) => {
                if (exercises.some(ex => ex.exercise)) {
                  initialFeedback[day] = generateDailyFeedback(day, exercises);
                }
              });
              setDailyFeedback(initialFeedback);
            }
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          if (retryCount < maxRetries) {
            retryCount++;
            await new Promise(resolve => setTimeout(resolve, 2000));
            return attemptFetch();
          }
          throw error;
        }
      };

      setLoading(true);
      attemptFetch()
        .catch(error => {
          console.error('Final error after retries:', error);
          setFeedback(
            error.message.includes('timeout')
              ? 'Connection timeout. Please check your internet connection.'
              : 'Unable to load your workout data. Please try refreshing.'
          );
        })
        .finally(() => {
          setLoading(false);
        });
    };

    fetchUserData();
  }, [navigation]);

  const handleAddExercise = (day) => {
    setWeeklyWorkouts(prev => ({
      ...prev,
      [day]: [...prev[day], { exercise: '', sets: '', duration: '', rest: '' }]
    }));
  };

  const handleRemoveExercise = (day, index) => {
    Alert.alert(
      'Remove Exercise',
      'Are you sure you want to remove this exercise?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Remove',
          onPress: () => {
            setWeeklyWorkouts(prev => {
              const newWorkouts = {
                ...prev,
                [day]: prev[day].filter((_, i) => i !== index)
              };
              setDailyFeedback(prevFeedback => ({
                ...prevFeedback,
                [day]: generateDailyFeedback(day, newWorkouts[day])
              }));
              return newWorkouts;
            });
          },
          style: 'destructive'
        }
      ]
    );
  };

  const handleExerciseChange = (day, index, field, value) => {
    setWeeklyWorkouts(prev => {
      const newWorkouts = {
        ...prev,
        [day]: prev[day].map((exercise, i) =>
          i === index ? { ...exercise, [field]: value } : exercise
        )
      };
      setDailyFeedback(prevFeedback => ({
        ...prevFeedback,
        [day]: generateDailyFeedback(day, newWorkouts[day])
      }));
      return newWorkouts;
    });
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const feedback = generateWeeklyFeedback(weeklyWorkouts);
      await firestore()
        .collection('users')
        .doc(auth().currentUser.phoneNumber)
        .update({
          weeklyWorkouts: weeklyWorkouts,
          lastWorkoutFeedback: feedback,
          lastUpdated: new Date().toISOString()
        });

      setFeedback(feedback);
      Alert.alert('Success', 'Workout progress saved successfully!');
    } catch (error) {
      console.error('Error saving workouts:', error);
      Alert.alert('Error', 'Failed to save workout progress. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const renderExerciseItem = (day, exercise, index) => (
    <View style={styles.exerciseEntry} key={index}>
      <View style={styles.exerciseRow}>
        <View style={styles.exerciseField}>
          <Text style={styles.label}>Exercise</Text>
          <Picker
            selectedValue={exercise.exercise}
            onValueChange={(value) => handleExerciseChange(day, index, 'exercise', value)}
            style={styles.picker}
          >
            <Picker.Item label="Select exercise..." value="" />
            {recommendedProgram[day]?.map((ex, i) => (
              <Picker.Item key={i} label={ex.name} value={ex.name} />
            ))}
          </Picker>
        </View>
      </View>

      <View style={styles.exerciseRow}>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Sets</Text>
          <TextInput
            style={styles.input}
            value={exercise.sets}
            onChangeText={(value) => handleExerciseChange(day, index, 'sets', value)}
            keyboardType="numeric"
            placeholder="Sets"
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Duration</Text>
          <TextInput
            style={styles.input}
            value={exercise.duration}
            onChangeText={(value) => handleExerciseChange(day, index, 'duration', value)}
            placeholder="Duration"
          />
        </View>
      </View>

      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveExercise(day, index)}
      >
        <Text style={styles.removeButtonText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );

  const renderHeader = (section) => (
    <View style={styles.dayHeader}>
      <Text style={styles.dayHeaderText}>{section}</Text>
      {weeklyWorkouts[section].some(ex => ex.exercise) && (
        <View style={styles.exerciseCountBadge}>
          <Text style={styles.exerciseCountText}>
            {weeklyWorkouts[section].filter(ex => ex.exercise).length} exercises
          </Text>
        </View>
      )}
    </View>
  );

  const renderContent = (section) => (
    <View style={styles.dayContent}>
      {recommendedProgram[section] && (
        <View style={styles.recommendedSection}>
          <Text style={styles.sectionTitle}>Recommended Exercises:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.recommendedExercises}>
              {recommendedProgram[section].map((exercise, index) => (
                <View key={index} style={styles.recommendedExercise}>
                  <Text style={styles.exerciseName}>{exercise.name}</Text>
                  <Text style={styles.exerciseDetails}>
                    {exercise.recommended.sets} × {exercise.recommended.duration}
                    {exercise.recommended.rest !== 'N/A' && (
                      <Text style={styles.restPeriod}>
                        {'\n'}Rest: {exercise.recommended.rest}
                      </Text>
                    )}
                  </Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      )}

      {dailyFeedback[section] && weeklyWorkouts[section].some(ex => ex.exercise) && (
        <View style={styles.feedbackContainer}>
          <Text style={styles.feedbackText}>{dailyFeedback[section]}</Text>
        </View>
      )}

      {weeklyWorkouts[section].map((exercise, index) =>
        renderExerciseItem(section, exercise, index)
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => handleAddExercise(section)}
      >
        <Text style={styles.addButtonText}>Add Exercise</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Weekly Workout Tracker</Text>
        <View style={styles.goalBadge}>
          <Text style={styles.goalText}>
            {userData?.fitnessGoals?.targetGoal?.replace('_', ' ').toUpperCase()}
          </Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <Accordion
          sections={Object.keys(weeklyWorkouts)}
          activeSections={activeSections}
          renderHeader={renderHeader}
          renderContent={renderContent}
          onChange={setActiveSections}
          expandMultiple
        />

        {feedback && (
          <View style={[styles.feedbackContainer, { marginTop: 20 }]}>
            <Text style={styles.feedbackText}>{feedback}</Text>
          </View>
        )}
      </ScrollView>

      <TouchableOpacity
        style={[styles.saveButton, saving && styles.saveButtonDisabled]}
        onPress={handleSubmit}
        disabled={saving}
      >
        <Text style={styles.saveButtonText}>
          {saving ? 'Saving Progress...' : 'Save Weekly Progress'}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 16,
    flex: 1,
  },
  goalBadge: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  goalText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  dayHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  exerciseCountBadge: {
    backgroundColor: '#28a745',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  exerciseCountText: {
    color: '#fff',
    fontSize: 12,
  },
  dayContent: {
    padding: 16,
  },
  recommendedSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  recommendedExercises: {
    flexDirection: 'row',
  },
  recommendedExercise: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e1e1e1',
    minWidth: 150,
  },
  exerciseName: {
    fontWeight: '600',
    marginBottom: 4,
  },
  exerciseDetails: {
    fontSize: 12,
    color: '#666',
  },
  restPeriod: {
    color: '#888',
  },
  exerciseEntry: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  exerciseRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  exerciseField: {
    flex: 1,
  },
  fieldContainer: {
    flex: 1,
    marginRight: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
    color: '#495057',
  },
  picker: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 4,
    ...Platform.select({
      ios: {
        height: 40,
      },
      android: {
        height: 50,
      },
    }),
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 4,
    padding: 8,
    height: 40,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  removeButton: {
    backgroundColor: '#dc3545',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#28a745',
    padding: 16,
    alignItems: 'center',
    margin: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    ...Platform.select({
      ios: {
        marginBottom: 32,
      },
    }),
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  feedbackContainer: {
    backgroundColor: '#cce5ff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#b8daff',
  },
  feedbackText: {
    color: '#004085',
    fontSize: 14,
    lineHeight: 20,
  },
  recommendedSection: {
    marginBottom: 16,
  },
  recommendedExercises: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  recommendedExercise: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e1e1e1',
    minWidth: 150,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  exerciseName: {
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 4,
    color: '#212529',
  },
  exerciseDetails: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  restPeriod: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  errorContainer: {
    backgroundColor: '#f8d7da',
    padding: 16,
    borderRadius: 8,
    margin: 16,
    borderWidth: 1,
    borderColor: '#f5c6cb',
  },
  errorText: {
    color: '#721c24',
    fontSize: 14,
    lineHeight: 20,
  },
  retryButton: {
    backgroundColor: '#dc3545',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
  },
  dayTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
    flex: 1,
  },
  exerciseCount: {
    backgroundColor: '#28a745',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  exerciseCountText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  listContainer: {
    flexGrow: 1,
  },
  placeholder: {
    color: '#6c757d',
    fontSize: 16,
  },
  inputContainer: {
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  halfWidth: {
    width: '48%',
  },
  infoIcon: {
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#212529',
  },
  modalText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#495057',
    marginBottom: 16,
  },
  modalButton: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  separator: {
    height: 1,
    backgroundColor: '#dee2e6',
    marginVertical: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  successBadge: {
    backgroundColor: '#28a745',
  },
  warningBadge: {
    backgroundColor: '#ffc107',
  },
  dangerBadge: {
    backgroundColor: '#dc3545',
  },
  infoBadge: {
    backgroundColor: '#17a2b8',
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
});

export default WorkoutTrackerScreen;
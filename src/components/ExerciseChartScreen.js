// ExerciseChart.js
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ExerciseChartScreen = ({ targetGoal }) => {
  const navigation = useNavigation();
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedExercises, setSelectedExercises] = useState([]);

  const exerciseCharts = {
    weight_loss: {
      title: 'Weight Loss Program',
      description: 'Focus on high-intensity cardio and full-body workouts',
      color: '#dc3545',
      schedule: [
        {
          day: 'Monday - HIIT & Core',
          exercises: [
            { name: 'Jumping Jacks', sets: '3 sets', duration: '45 seconds', rest: '15 seconds' },
            { name: 'Mountain Climbers', sets: '3 sets', duration: '45 seconds', rest: '15 seconds' },
            { name: 'Burpees', sets: '3 sets', duration: '30 seconds', rest: '30 seconds' },
            { name: 'Running/Jogging', sets: '1 set', duration: '30 minutes', rest: 'N/A' },
            { name: 'Plank', sets: '3 sets', duration: '30 seconds', rest: '30 seconds' }
          ]
        },
        {
            day: 'Tuesday - Lower Body',
            exercises: [
              { name: 'Squats', sets: '4 sets', duration: '15 reps', rest: '30 seconds' },
              { name: 'Lunges', sets: '3 sets', duration: '12 reps each leg', rest: '30 seconds' },
              { name: 'Jump Rope', sets: '4 sets', duration: '2 minutes', rest: '1 minute' },
              { name: 'Bicycle Crunches', sets: '3 sets', duration: '20 reps', rest: '30 seconds' }
            ]
          },
          {
            day: 'Wednesday - Cardio & Upper Body',
            exercises: [
              { name: 'Swimming/Cycling', sets: '1 set', duration: '45 minutes', rest: 'N/A' },
              { name: 'Push-ups', sets: '3 sets', duration: '10 reps', rest: '30 seconds' },
              { name: 'Dumbbell Rows', sets: '3 sets', duration: '12 reps', rest: '30 seconds' },
              { name: 'Arm Circles', sets: '2 sets', duration: '30 seconds each direction', rest: '15 seconds' }
            ]
          },
          {
            day: 'Thursday - HIIT & Legs',
            exercises: [
              { name: 'High Knees', sets: '4 sets', duration: '30 seconds', rest: '30 seconds' },
              { name: 'Jump Squats', sets: '3 sets', duration: '12 reps', rest: '45 seconds' },
              { name: 'HIIT Training', sets: '1 set', duration: '20 minutes', rest: 'N/A' },
              { name: 'Calf Raises', sets: '3 sets', duration: '20 reps', rest: '30 seconds' }
            ]
          },
          {
            day: 'Friday - Full Body Circuit',
            exercises: [
              { name: 'Step-ups', sets: '3 sets', duration: '15 reps each leg', rest: '30 seconds' },
              { name: 'Russian Twists', sets: '3 sets', duration: '20 reps', rest: '30 seconds' },
              { name: 'Running', sets: '1 set', duration: '25 minutes', rest: 'N/A' },
              { name: 'Mountain Climbers', sets: '3 sets', duration: '40 seconds', rest: '20 seconds' }
            ]
          },
          {
            day: 'Saturday - Active Recovery',
            exercises: [
              { name: 'Brisk Walking', sets: '1 set', duration: '45 minutes', rest: 'N/A' },
              { name: 'Light Stretching', sets: '1 set', duration: '15 minutes', rest: 'N/A' },
              { name: 'Yoga', sets: '1 set', duration: '20 minutes', rest: 'N/A' }
            ]
          }
        ]
      },
      muscle_gain: {
        title: 'Muscle/Weight Gain Program',
        description: 'Focus on progressive overload and compound movements',
        color: '#28a745',
        schedule: [
          {
            day: 'Monday - Chest & Triceps',
            exercises: [
              { name: 'Bench Press', sets: '4 sets', duration: '8-10 reps', rest: '90 seconds' },
              { name: 'Incline Dumbbell Press', sets: '3 sets', duration: '10-12 reps', rest: '60 seconds' },
              { name: 'Tricep Dips', sets: '3 sets', duration: '12 reps', rest: '60 seconds' },
              { name: 'Chest Flyes', sets: '3 sets', duration: '12 reps', rest: '60 seconds' }
            ]
          },
          {
            day: 'Tuesday - Back & Biceps',
            exercises: [
              { name: 'Deadlifts', sets: '4 sets', duration: '6-8 reps', rest: '120 seconds' },
              { name: 'Pull-ups/Lat Pulldowns', sets: '3 sets', duration: '10 reps', rest: '90 seconds' },
              { name: 'Barbell Rows', sets: '3 sets', duration: '10 reps', rest: '90 seconds' },
              { name: 'Bicep Curls', sets: '3 sets', duration: '12 reps', rest: '60 seconds' }
            ]
          },
          {
            day: 'Wednesday - Legs',
            exercises: [
              { name: 'Squats', sets: '4 sets', duration: '8-10 reps', rest: '120 seconds' },
              { name: 'Romanian Deadlifts', sets: '3 sets', duration: '10 reps', rest: '90 seconds' },
              { name: 'Leg Press', sets: '3 sets', duration: '12 reps', rest: '90 seconds' },
              { name: 'Calf Raises', sets: '4 sets', duration: '15 reps', rest: '60 seconds' }
            ]
          },
          {
            day: 'Thursday - Shoulders & Abs',
            exercises: [
              { name: 'Military Press', sets: '4 sets', duration: '8-10 reps', rest: '90 seconds' },
              { name: 'Lateral Raises', sets: '3 sets', duration: '12 reps', rest: '60 seconds' },
              { name: 'Front Raises', sets: '3 sets', duration: '12 reps', rest: '60 seconds' },
              { name: 'Plank Variations', sets: '3 sets', duration: '30-45 seconds', rest: '45 seconds' }
            ]
          },
          {
            day: 'Friday - Arms & Core',
            exercises: [
              { name: 'Close-Grip Bench Press', sets: '4 sets', duration: '8-10 reps', rest: '90 seconds' },
              { name: 'Hammer Curls', sets: '3 sets', duration: '12 reps', rest: '60 seconds' },
              { name: 'Tricep Extensions', sets: '3 sets', duration: '12 reps', rest: '60 seconds' },
              { name: 'Cable Crunches', sets: '3 sets', duration: '15 reps', rest: '60 seconds' }
            ]
          },
          {
            day: 'Saturday - Light Full Body',
            exercises: [
              { name: 'Clean and Press', sets: '3 sets', duration: '6-8 reps', rest: '90 seconds' },
              { name: 'Pull-ups', sets: '3 sets', duration: '8 reps', rest: '90 seconds' },
              { name: 'Light Squats', sets: '3 sets', duration: '10 reps', rest: '60 seconds' },
              { name: 'Face Pulls', sets: '3 sets', duration: '15 reps', rest: '60 seconds' }
            ]
          }
        ]
      },
      fitness: {
        title: 'General Fitness Program',
        description: 'Balanced workout combining strength, flexibility, and cardio',
        color: '#17a2b8',
        schedule: [
          {
            day: 'Monday - Full Body & Flexibility',
            exercises: [
              { name: 'Yoga/Stretching', sets: '1 set', duration: '20 minutes', rest: 'N/A' },
              { name: 'Push-ups', sets: '3 sets', duration: '10 reps', rest: '30 seconds' },
              { name: 'Bodyweight Squats', sets: '3 sets', duration: '15 reps', rest: '30 seconds' },
              { name: 'Walking/Light Jogging', sets: '1 set', duration: '20 minutes', rest: 'N/A' }
            ]
          },
          {
            day: 'Tuesday - Cardio & Core',
            exercises: [
              { name: 'Swimming/Cycling', sets: '1 set', duration: '30 minutes', rest: 'N/A' },
              { name: 'Planks', sets: '3 sets', duration: '30 seconds', rest: '30 seconds' },
              { name: 'Bird Dogs', sets: '3 sets', duration: '10 reps each side', rest: '30 seconds' },
              { name: 'Russian Twists', sets: '3 sets', duration: '20 reps', rest: '30 seconds' }
            ]
          },
          {
            day: 'Wednesday - Strength & Balance',
            exercises: [
              { name: 'Dumbbell Rows', sets: '3 sets', duration: '12 reps', rest: '45 seconds' },
              { name: 'Lunges', sets: '3 sets', duration: '10 reps each leg', rest: '45 seconds' },
              { name: 'Glute Bridges', sets: '3 sets', duration: '15 reps', rest: '30 seconds' },
              { name: 'Single-Leg Balance', sets: '2 sets', duration: '30 seconds each leg', rest: '30 seconds' }
            ]
          },
          {
            day: 'Thursday - Cardio & Mobility',
            exercises: [
              { name: 'Cycling', sets: '1 set', duration: '30 minutes', rest: 'N/A' },
              { name: 'Dynamic Stretching', sets: '1 set', duration: '15 minutes', rest: 'N/A' },
              { name: 'Jump Rope', sets: '3 sets', duration: '2 minutes', rest: '1 minute' },
              { name: 'Mobility Drills', sets: '2 sets', duration: '5 minutes', rest: '1 minute' }
            ]
          },
          {
            day: 'Friday - Strength & Endurance',
            exercises: [
              { name: 'Circuit Training', sets: '3 rounds', duration: '10 minutes', rest: '2 minutes' },
              { name: 'Resistance Band Work', sets: '3 sets', duration: '15 reps', rest: '30 seconds' },
              { name: 'Body Weight Exercises', sets: '3 sets', duration: '12 reps', rest: '45 seconds' },
              { name: 'Core Workout', sets: '2 sets', duration: '5 minutes', rest: '1 minute' }
            ]
          },
          {
            day: 'Saturday - Active Recovery',
            exercises: [
              { name: 'Light Yoga', sets: '1 set', duration: '25 minutes', rest: 'N/A' },
              { name: 'Walking', sets: '1 set', duration: '30 minutes', rest: 'N/A' },
              { name: 'Stretching', sets: '1 set', duration: '15 minutes', rest: 'N/A' }
            ]
          }
        ]
      }
    };


  const selectedProgram = exerciseCharts[targetGoal];

  if (!selectedProgram) {
    return (
      <View style={styles.card}>
        <Text style={styles.messageText}>
          Set your fitness goal to view your personalized exercise chart.
        </Text>
      </View>
    );
  }

  const renderExerciseRow = (exercise, index) => (
    <View key={index} style={styles.exerciseRow}>
      <Text style={styles.exerciseName}>{exercise.name}</Text>
      <View style={styles.exerciseDetails}>
        <Text style={styles.detailText}>{exercise.sets}</Text>
        <Text style={styles.detailText}>{exercise.duration}</Text>
        <Text style={styles.detailText}>{exercise.rest}</Text>
      </View>
    </View>
  );

  const renderDaySchedule = (day, index) => (
    <View key={index} style={styles.daySchedule}>
      <Text style={styles.dayHeader}>{day.day}</Text>
      <View style={styles.tableHeader}>
        <Text style={[styles.headerText, styles.exerciseCol]}>Exercise</Text>
        <Text style={[styles.headerText, styles.detailCol]}>Sets</Text>
        <Text style={[styles.headerText, styles.detailCol]}>Duration</Text>
        <Text style={[styles.headerText, styles.detailCol]}>Rest</Text>
      </View>
      {day.exercises.map((exercise, exIndex) => renderExerciseRow(exercise, exIndex))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{selectedProgram.title}</Text>
            <View style={[styles.badge, { backgroundColor: selectedProgram.color }]}>
              <Text style={styles.badgeText}>Personalized Plan</Text>
            </View>
          </View>
          <Text style={styles.description}>{selectedProgram.description}</Text>
        </View>
        <View style={styles.content}>
          {selectedProgram.schedule.map((day, index) => renderDaySchedule(day, index))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  badge: {
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  description: {
    color: '#6c757d',
    fontSize: 14,
  },
  content: {
    padding: 16,
  },
  daySchedule: {
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dayHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  tableHeader: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerText: {
    fontWeight: '600',
    color: '#495057',
    fontSize: 14,
  },
  exerciseRow: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  exerciseName: {
    flex: 2,
    fontSize: 14,
    color: '#333',
  },
  exerciseDetails: {
    flex: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailText: {
    flex: 1,
    fontSize: 14,
    color: '#495057',
    textAlign: 'center',
  },
  exerciseCol: {
    flex: 2,
  },
  detailCol: {
    flex: 1,
    textAlign: 'center',
  },
  messageText: {
    padding: 16,
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default ExerciseChartScreen;
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const ExerciseVideosScreen = () => {
  const navigation = useNavigation();
  const [programType, setProgramType] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserGoal = async () => {
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
          const userData = userDoc.data();
          setProgramType(userData?.fitnessGoals?.targetGoal || null);
        }
      } catch (error) {
        console.error('Error fetching user goal:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserGoal();
  }, [navigation]);

  const getExercises = () => {
    if (programType === 'fitness') {
        return [
          {
            focusArea: 'Full Body & Flexibility',
            exercises: [
              {
                name: 'Yoga/Stretching',
                focus: '1 set, 20 minutes',
                url: 'https://www.youtube.com/watch?v=v7AYKMP6rOE'
              },
              {
                name: 'Push-ups',
                focus: '3 sets, 10 reps with 30 seconds rest',
                url: 'https://www.youtube.com/watch?v=IODxDxX7oi4'
              },
              {
                name: 'Bodyweight Squats',
                focus: '3 sets, 15 reps with 30 seconds rest',
                url: 'https://www.youtube.com/watch?v=YaXPRqUwItQ'
              },
              {
                name: 'Walking/Light Jogging',
                focus: '1 set, 20 minutes',
                url: 'https://www.youtube.com/watch?v=_kGESn8ArrU'
              }
            ]
          },
          {
            focusArea: 'Cardio & Core',
            exercises: [
              {
                name: 'Swimming/Cycling',
                focus: '1 set, 30 minutes',
                url: 'https://www.youtube.com/watch?v=jv9jkrWFQsY'
              },
              {
                name: 'Planks',
                focus: '3 sets, 30 seconds with 30 seconds rest',
                url: 'https://www.youtube.com/watch?v=ASdvN_XEl_c'
              },
              {
                name: 'Bird Dogs',
                focus: '3 sets, 10 reps each side with 30 seconds rest',
                url: 'https://www.youtube.com/watch?v=wiFNA3sqjCA'
              },
              {
                name: 'Russian Twists',
                focus: '3 sets, 20 reps with 30 seconds rest',
                url: 'https://www.youtube.com/watch?v=wkD8rjkodUI'
              }
            ]
          },
          {
            focusArea: 'Strength & Balance',
            exercises: [
              {
                name: 'Dumbbell Rows',
                focus: '3 sets, 12 reps with 45 seconds rest',
                url: 'https://www.youtube.com/watch?v=roCP6wCXPqo'
              },
              {
                name: 'Lunges',
                focus: '3 sets, 10 reps each leg with 45 seconds rest',
                url: 'https://www.youtube.com/watch?v=QOVaHwm-Q6U'
              },
              {
                name: 'Glute Bridges',
                focus: '3 sets, 15 reps with 30 seconds rest',
                url: 'https://www.youtube.com/watch?v=OUgsJ8_vcfY'
              },
              {
                name: 'Single-Leg Balance',
                focus: '2 sets, 30 seconds each leg with 30 seconds rest',
                url: 'https://www.youtube.com/watch?v=jugh8VzaaGE'
              }
            ]
          },
          {
            focusArea: 'Cardio & Mobility',
            exercises: [
              {
                name: 'Cycling',
                focus: '1 set, 30 minutes',
                url: 'https://www.youtube.com/watch?v=jv9jkrWFQsY'
              },
              {
                name: 'Dynamic Stretching',
                focus: '1 set, 15 minutes',
                url: 'https://www.youtube.com/watch?v=nPHfEnZD1Wk'
              },
              {
                name: 'Jump Rope',
                focus: '3 sets, 2 minutes with 1 minute rest',
                url: 'https://www.youtube.com/watch?v=FJmRQ5iTXKE'
              },
              {
                name: 'Mobility Drills',
                focus: '2 sets, 5 minutes with 1 minute rest',
                url: 'https://www.youtube.com/watch?v=uQGyfxnXMWY'
              }
            ]
          },
          {
            focusArea: 'Strength & Endurance',
            exercises: [
              {
                name: 'Circuit Training',
                focus: '3 rounds, 10 minutes with 2 minutes rest',
                url: 'https://www.youtube.com/watch?v=yDQQKqUVt1Y'
              },
              {
                name: 'Resistance Band Work',
                focus: '3 sets, 15 reps with 30 seconds rest',
                url: 'https://www.youtube.com/watch?v=T5V3pxXXgjg'
              },
              {
                name: 'Body Weight Exercises',
                focus: '3 sets, 12 reps with 45 seconds rest',
                url: 'https://www.youtube.com/watch?v=UoC_O3HzsH0'
              },
              {
                name: 'Core Workout',
                focus: '2 sets, 5 minutes with 1 minute rest',
                url: 'https://www.youtube.com/watch?v=dJlFmxiL11s'
              }
            ]
          },
          {
            focusArea: 'Active Recovery',
            exercises: [
              {
                name: 'Light Yoga',
                focus: '1 set, 25 minutes',
                url: 'https://www.youtube.com/watch?v=v7AYKMP6rOE'
              },
              {
                name: 'Walking',
                focus: '1 set, 30 minutes',
                url: 'https://www.youtube.com/watch?v=njeZ29umqVE'
              },
              {
                name: 'Stretching',
                focus: '1 set, 15 minutes',
                url: 'https://www.youtube.com/watch?v=g_tea8ZNk5A'
              }
            ]
          }
        ];
      } else if (programType === 'weight_loss') {
          return [
            {
              focusArea: 'HIIT & Core',
              exercises: [
                {
                  name: 'Jumping Jacks',
                  focus: '3 sets, 45 seconds with 15 seconds rest',
                  url: 'https://www.youtube.com/watch?v=2W4ZNSwoW_4'
                },
                {
                  name: 'Mountain Climbers',
                  focus: '3 sets, 45 seconds with 15 seconds rest',
                  url: 'https://www.youtube.com/watch?v=nmwgirgXLYM'
                },
                {
                  name: 'Burpees',
                  focus: '3 sets, 30 seconds with 30 seconds rest',
                  url: 'https://www.youtube.com/watch?v=dZgVxmf6jkA'
                },
                {
                  name: 'Running/Jogging',
                  focus: '1 set, 30 minutes',
                  url: 'https://www.youtube.com/watch?v=_kGESn8ArrU'
                },
                {
                  name: 'Plank',
                  focus: '3 sets, 30 seconds with 30 seconds rest',
                  url: 'https://www.youtube.com/watch?v=ASdvN_XEl_c'
                }
              ]
            },
            {
              focusArea: 'Lower Body',
              exercises: [
                {
                  name: 'Squats',
                  focus: '4 sets, 15 reps with 30 seconds rest',
                  url: 'https://www.youtube.com/watch?v=YaXPRqUwItQ'
                },
                {
                  name: 'Lunges',
                  focus: '3 sets, 12 reps each leg with 30 seconds rest',
                  url: 'https://www.youtube.com/watch?v=QOVaHwm-Q6U'
                },
                {
                  name: 'Jump Rope',
                  focus: '4 sets, 2 minutes with 1 minute rest',
                  url: 'https://www.youtube.com/watch?v=FJmRQ5iTXKE'
                },
                {
                  name: 'Bicycle Crunches',
                  focus: '3 sets, 20 reps with 30 seconds rest',
                  url: 'https://www.youtube.com/watch?v=Iwyvozckjak'
                }
              ]
            },
            {
              focusArea: 'Cardio & Upper Body',
              exercises: [
                {
                  name: 'Swimming/Cycling',
                  focus: '1 set, 45 minutes',
                  url: 'https://www.youtube.com/watch?v=jv9jkrWFQsY'
                },
                {
                  name: 'Push-ups',
                  focus: '3 sets, 10 reps with 30 seconds rest',
                  url: 'https://www.youtube.com/watch?v=IODxDxX7oi4'
                },
                {
                  name: 'Dumbbell Rows',
                  focus: '3 sets, 12 reps with 30 seconds rest',
                  url: 'https://www.youtube.com/watch?v=roCP6wCXPqo'
                },
                {
                  name: 'Arm Circles',
                  focus: '2 sets, 30 seconds each direction with 15 seconds rest',
                  url: 'https://www.youtube.com/watch?v=bP52FXTlzjA'
                }
              ]
            },
            {
              focusArea: 'HIIT & Legs',
              exercises: [
                {
                  name: 'High Knees',
                  focus: '4 sets, 30 seconds with 30 seconds rest',
                  url: 'https://www.youtube.com/watch?v=oDdkytliOqE'
                },
                {
                  name: 'Jump Squats',
                  focus: '3 sets, 12 reps with 45 seconds rest',
                  url: 'https://www.youtube.com/watch?v=CVaEhXotL7M'
                },
                {
                  name: 'HIIT Training',
                  focus: '1 set, 20 minutes',
                  url: 'https://www.youtube.com/watch?v=ml6cT4AZdqI'
                },
                {
                  name: 'Calf Raises',
                  focus: '3 sets, 20 reps with 30 seconds rest',
                  url: 'https://www.youtube.com/watch?v=gwLzBJYoWlI'
                }
              ]
            },
            {
              focusArea: 'Full Body Circuit',
              exercises: [
                {
                  name: 'Step-ups',
                  focus: '3 sets, 15 reps each leg with 30 seconds rest',
                  url: 'https://www.youtube.com/watch?v=ied6vxqW_Mk'
                },
                {
                  name: 'Russian Twists',
                  focus: '3 sets, 20 reps with 30 seconds rest',
                  url: 'https://www.youtube.com/watch?v=wkD8rjkodUI'
                },
                {
                  name: 'Running',
                  focus: '1 set, 25 minutes',
                  url: 'https://www.youtube.com/watch?v=_kGESn8ArrU'
                },
                {
                  name: 'Mountain Climbers',
                  focus: '3 sets, 40 seconds with 20 seconds rest',
                  url: 'https://www.youtube.com/watch?v=nmwgirgXLYM'
                }
              ]
            },
            {
              focusArea: 'Active Recovery',
              exercises: [
                {
                  name: 'Brisk Walking',
                  focus: '1 set, 45 minutes',
                  url: 'https://www.youtube.com/watch?v=njeZ29umqVE'
                },
                {
                  name: 'Light Stretching',
                  focus: '1 set, 15 minutes',
                  url: 'https://www.youtube.com/watch?v=g_tea8ZNk5A'
                },
                {
                  name: 'Yoga',
                  focus: '1 set, 20 minutes',
                  url: 'https://www.youtube.com/watch?v=v7AYKMP6rOE'
                }
              ]
            }
          ];
        }
        else if (programType === 'muscle_gain') {
          return [
            {
              focusArea: 'Chest & Triceps',
              exercises: [
                {
                  name: 'Bench Press',
                  focus: '4 sets, 8-10 reps with 90 seconds rest',
                  url: 'https://www.youtube.com/watch?v=vcBig73ojpE'
                },
                {
                  name: 'Incline Dumbbell Press',
                  focus: '3 sets, 10-12 reps with 60 seconds rest',
                  url: 'https://www.youtube.com/watch?v=8iPEnn-ltC8'
                },
                {
                  name: 'Tricep Dips',
                  focus: '3 sets, 12 reps with 60 seconds rest',
                  url: 'https://www.youtube.com/watch?v=2z8JmcrW-As'
                },
                {
                  name: 'Chest Flyes',
                  focus: '3 sets, 12 reps with 60 seconds rest',
                  url: 'https://www.youtube.com/watch?v=eozdVDA78K0'
                }
              ]
            },
            {
              focusArea: 'Back & Biceps',
              exercises: [
                {
                  name: 'Deadlifts',
                  focus: '4 sets, 6-8 reps with 120 seconds rest',
                  url: 'https://www.youtube.com/watch?v=wtX1CXp8z6E'
                },
                {
                  name: 'Pull-ups/Lat Pulldowns',
                  focus: '3 sets, 10 reps with 90 seconds rest',
                  url: 'https://www.youtube.com/watch?v=eGo4IYlbE5g'
                },
                {
                  name: 'Barbell Rows',
                  focus: '3 sets, 10 reps with 90 seconds rest',
                  url: 'https://www.youtube.com/watch?v=9efgcAjQe7E'
                },
                {
                  name: 'Bicep Curls',
                  focus: '3 sets, 12 reps with 60 seconds rest',
                  url: 'https://www.youtube.com/watch?v=ykJmrZ5v0Oo'
                }
              ]
            },
            {
              focusArea: 'Legs',
              exercises: [
                {
                  name: 'Squats',
                  focus: '4 sets, 8-10 reps with 120 seconds rest',
                  url: 'https://www.youtube.com/watch?v=nEQQle9-0NA'
                },
                {
                  name: 'Romanian Deadlifts',
                  focus: '3 sets, 10 reps with 90 seconds rest',
                  url: 'https://www.youtube.com/watch?v=hCDzSR6bW10'
                },
                {
                  name: 'Leg Press',
                  focus: '3 sets, 12 reps with 90 seconds rest',
                  url: 'https://www.youtube.com/watch?v=IZxyjW7MPJQ'
                },
                {
                  name: 'Calf Raises',
                  focus: '4 sets, 15 reps with 60 seconds rest',
                  url: 'https://www.youtube.com/watch?v=gwLzBJYoWlI'
                }
              ]
            },
            {
              focusArea: 'Shoulders & Abs',
              exercises: [
                {
                  name: 'Military Press',
                  focus: '4 sets, 8-10 reps with 90 seconds rest',
                  url: 'https://www.youtube.com/watch?v=2yjwXTZQDDI'
                },
                {
                  name: 'Lateral Raises',
                  focus: '3 sets, 12 reps with 60 seconds rest',
                  url: 'https://www.youtube.com/watch?v=3VcKaXpzqRo'
                },
                {
                  name: 'Front Raises',
                  focus: '3 sets, 12 reps with 60 seconds rest',
                  url: 'https://www.youtube.com/watch?v=gj3p0YE_mUQ'
                },
                {
                  name: 'Plank Variations',
                  focus: '3 sets, 30-45 seconds with 45 seconds rest',
                  url: 'https://www.youtube.com/watch?v=pSHjTRCQxIw'
                }
              ]
            },
            {
              focusArea: 'Arms & Core',
              exercises: [
                {
                  name: 'Close-Grip Bench Press',
                  focus: '4 sets, 8-10 reps with 90 seconds rest',
                  url: 'https://www.youtube.com/watch?v=nEF0bv2FW94'
                },
                {
                  name: 'Hammer Curls',
                  focus: '3 sets, 12 reps with 60 seconds rest',
                  url: 'https://www.youtube.com/watch?v=zC3nLlEvin4'
                },
                {
                  name: 'Tricep Extensions',
                  focus: '3 sets, 12 reps with 60 seconds rest',
                  url: 'https://www.youtube.com/watch?v=nRiJVZDpdL0'
                },
                {
                  name: 'Cable Crunches',
                  focus: '3 sets, 15 reps with 60 seconds rest',
                  url: 'https://www.youtube.com/watch?v=2fbujeH3F0E'
                }
              ]
            },
            {
              focusArea: 'Light Full Body',
              exercises: [
                {
                  name: 'Clean and Press',
                  focus: '3 sets, 6-8 reps with 90 seconds rest',
                  url: 'https://www.youtube.com/watch?v=KwYJTpQ_x5A'
                },
                {
                  name: 'Pull-ups',
                  focus: '3 sets, 8 reps with 90 seconds rest',
                  url: 'https://www.youtube.com/watch?v=eGo4IYlbE5g'
                },
                {
                  name: 'Light Squats',
                  focus: '3 sets, 10 reps with 60 seconds rest',
                  url: 'https://www.youtube.com/watch?v=nEQQle9-0NA'
                },
                {
                  name: 'Face Pulls',
                  focus: '3 sets, 15 reps with 60 seconds rest',
                  url: 'https://www.youtube.com/watch?v=rep-qVOkqgk'
                }
              ]
            }
          ];
      } else {
        return [];
      }
    };
  

  const handleWatchVideo = async (url) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error('Error opening video URL:', error);
    }
  };

  const exercises = getExercises();

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.card}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>Loading exercise videos...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (exercises.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.card}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.backButton}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Exercise Videos</Text>
          </View>
          <Text style={styles.emptyText}>
            Please set your fitness goal to view personalized exercise videos.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.card}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.backButton}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>
              Exercise Videos - {programType.replace('_', ' ').toUpperCase()}
            </Text>
          </View>
          
          {exercises.map((section, sectionIndex) => (
            <View key={sectionIndex} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.focusArea}</Text>
              {section.exercises.map((exercise, exerciseIndex) => (
                <View 
                  key={exerciseIndex} 
                  style={styles.exerciseItem}
                >
                  <View style={styles.exerciseInfo}>
                    <Text style={styles.exerciseName}>{exercise.name}</Text>
                    <Text style={styles.exerciseFocus}>{exercise.focus}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.watchButton}
                    onPress={() => handleWatchVideo(exercise.url)}
                  >
                    <Text style={styles.watchButtonText}>Watch Video</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ))}
        </View>
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
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
    paddingBottom: 8,
  },
  backButton: {
    fontSize: 24,
    marginRight: 16,
    color: '#007AFF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  exerciseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  exerciseFocus: {
    fontSize: 14,
    color: '#6c757d',
  },
  watchButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    minWidth: 100,
    alignItems: 'center',
  },
  watchButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  loadingText: {
    marginTop: 8,
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: '#6c757d',
  },
});

export default ExerciseVideosScreen;
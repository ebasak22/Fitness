import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const GoalSettingScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    height: '',
    weight: '',
    age: '',
    bloodGroup: '',
    gender: '',
    medicalInjury: '',
  });
  const [bmiData, setBmiData] = useState(null);
  const [goalSelected, setGoalSelected] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const calculateBMI = (height, weight) => {
    const heightInM = height / 100;
    const bmi = weight / (heightInM * heightInM);
    let category;

    if (bmi < 18.5) {
      category = 'Underweight';
    } else if (bmi >= 18.5 && bmi < 25) {
      category = 'Normal weight';
    } else if (bmi >= 25 && bmi < 30) {
      category = 'Overweight';
    } else {
      category = 'Obese';
    }

    return {
      bmi: bmi.toFixed(1),
      category,
    };
  };

  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Calculate BMI when height and weight are both entered
    if ((name === 'height' || name === 'weight') && 
        formData.height && formData.weight) {
      const height = name === 'height' ? value : formData.height;
      const weight = name === 'weight' ? value : formData.weight;
      const bmiResult = calculateBMI(height, weight);
      setBmiData(bmiResult);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError('');

    try {
      const user = auth().currentUser;

      if (!user) {
        setError('User not authenticated. Please login again.');
        return;
      }

      const fitnessGoalsData = {
        ...formData,
        bmi: bmiData.bmi,
        category: bmiData.category,
        targetGoal: goalSelected,
        setAt: firestore.FieldValue.serverTimestamp()
      };

      try {
        await firestore()
          .collection('users')
          .doc(user.phoneNumber)
          .update({
            fitnessGoals: fitnessGoalsData
          });
      } catch (updateError) {
        // If document doesn't exist, create it
        if (updateError.code === 'not-found') {
          await firestore()
            .collection('users')
            .doc(user.phoneNumber)
            .set({
              fitnessGoals: fitnessGoalsData
            });
        } else {
          throw updateError;
        }
      }

      navigation.navigate('Dashboard');
    } catch (error) {
      setError(`Failed to save your goals: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Set Your Fitness Goals</Text>
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <View style={styles.formContainer}>
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.label}>Height (cm)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={formData.height}
              onChangeText={(value) => handleInputChange('height', value)}
              placeholder="Enter height"
            />
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>Weight (kg)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={formData.weight}
              onChangeText={(value) => handleInputChange('weight', value)}
              placeholder="Enter weight"
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.label}>Age</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={formData.age}
              onChangeText={(value) => handleInputChange('age', value)}
              placeholder="Enter age"
            />
          </View>

          <View style={styles.column}>
            <Text style={styles.label}>Blood Group</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.bloodGroup}
                onValueChange={(value) => handleInputChange('bloodGroup', value)}
                style={styles.picker}
              >
                <Picker.Item label="Select Blood Group" value="" />
                <Picker.Item label="A+" value="A+" />
                <Picker.Item label="A-" value="A-" />
                <Picker.Item label="B+" value="B+" />
                <Picker.Item label="B-" value="B-" />
                <Picker.Item label="O+" value="O+" />
                <Picker.Item label="O-" value="O-" />
                <Picker.Item label="AB+" value="AB+" />
                <Picker.Item label="AB-" value="AB-" />
              </Picker>
            </View>
          </View>
        </View>

        <View style={styles.fullWidth}>
          <Text style={styles.label}>Gender</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.gender}
              onValueChange={(value) => handleInputChange('gender', value)}
              style={styles.picker}
            >
              <Picker.Item label="Select Gender" value="" />
              <Picker.Item label="Male" value="male" />
              <Picker.Item label="Female" value="female" />
              <Picker.Item label="Other" value="other" />
            </Picker>
          </View>
        </View>

        <View style={styles.fullWidth}>
          <Text style={styles.label}>Previous Medical Injury (if any)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            multiline
            numberOfLines={3}
            value={formData.medicalInjury}
            onChangeText={(value) => handleInputChange('medicalInjury', value)}
            placeholder="Optional - Describe any previous injuries or medical conditions"
          />
        </View>

        {bmiData && (
          <View style={styles.bmiContainer}>
            <Text style={styles.bmiTitle}>Your Body Mass Index (BMI)</Text>
            <Text style={styles.bmiText}>BMI: {bmiData.bmi}</Text>
            <Text style={styles.bmiText}>Category: {bmiData.category}</Text>
          </View>
        )}

        {bmiData && (
          <View style={styles.fullWidth}>
            <Text style={styles.label}>Select Your Goal</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={goalSelected}
                onValueChange={setGoalSelected}
                style={styles.picker}
              >
                <Picker.Item label="Choose your goal" value="" />
                <Picker.Item label="Weight Loss" value="weight_loss" />
                <Picker.Item label="Weight/Muscle Gain" value="muscle_gain" />
                <Picker.Item label="General Fitness" value="fitness" />
              </Picker>
            </View>
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.submitButton,
            (!bmiData || !goalSelected || isSubmitting) && styles.submitButtonDisabled
          ]}
          onPress={handleSubmit}
          disabled={!bmiData || !goalSelected || isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.submitButtonText}>Save Goals</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
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
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 24,
    color: '#333',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 16,
  },
  formContainer: {
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  column: {
    flex: 1,
    marginRight: 8,
  },
  fullWidth: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  errorContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: '#ffebee',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffcdd2',
  },
  errorText: {
    color: '#c62828',
    fontSize: 16,
  },
  bmiContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#90caf9',
  },
  bmiTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1976d2',
    marginBottom: 8,
  },
  bmiText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  submitButton: {
    backgroundColor: '#2196f3',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  submitButtonDisabled: {
    backgroundColor: '#90caf9',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default GoalSettingScreen;
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore, { updateDoc } from '@react-native-firebase/firestore';

const UpdateDetailsScreen = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    height: '',
    weight: '',
    waist: '',
    age: '',
    gender: ''
  });


  const calculateBMI = (height, weight) => {
    if (!height || !weight) return null;
    const heightInM = height / 100;
    return (weight / (heightInM * heightInM)).toFixed(1);
  };

  const validateForm = () => {
    const errors = [];
    if (!formData.height || isNaN(formData.height) || formData.height <= 0)
      errors.push('Please enter a valid height');
    if (!formData.weight || isNaN(formData.weight) || formData.weight <= 0)
      errors.push('Please enter a valid weight');
    if (!formData.age || isNaN(formData.age) || formData.age <= 0)
      errors.push('Please enter a valid age');
    if (!formData.gender)
      errors.push('Please select a gender');
    
    return errors;
  };

  useEffect(() => {
    let unsubscribe;

    const fetchUserData = async () => {
      try {
        const user = auth().currentUser;
        if (!user) {
          navigation.navigate('Home');
          return;
        }
        // Set up real-time listener
        unsubscribe = firestore()
          .collection('users')
          .doc(user.phoneNumber)
          .onSnapshot(
            async (docSnapshot) => {
              try {
              
                
                if (docSnapshot.exists) {
                  const userData = docSnapshot.data();
                  setFormData({
                    height: userData.height || apiData?.data?.height || '',
                    weight: userData.weight || apiData?.data?.weight || '',
                    waist: userData.waist || apiData?.data?.waist || '',
                    age: userData.age || apiData?.data?.age || '',
                    gender: userData.gender || apiData?.data?.gender || ''
                  });
                }
              } catch (apiError) {
                if (docSnapshot.exists) {
                  const userData = docSnapshot.data();
                  setFormData({
                    height: userData.height || '',
                    weight: userData.weight || '',
                    waist: userData.waist || '',
                    age: userData.age || '',
                    gender: userData.gender || ''
                  });
                }
              }
            },
            (error) => {
              console.error('Firestore error:', error);
              Alert.alert('Error', 'Failed to load user data');
            }
          );
      } catch (error) {
        console.error('Error in fetchUserData:', error);
        Alert.alert('Error', 'Failed to load user data');
      }
    };

    fetchUserData();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [navigation]);

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      const errors = validateForm();
      if (errors.length > 0) {
        Alert.alert('Validation Error', errors.join('\n'));
        setIsLoading(false);
        return;
      }

      const user = auth().currentUser;
      if (!user) throw new Error('User not authenticated');
      
        const userRef = firestore().collection('users').doc(user.phoneNumber);
        const userDoc = await userRef.get();
        // console.log('historRed', historyRef)
        await updateDoc(userRef, {
      'fitnessGoals.bmi':  calculateBMI(formData.height, formData.weight),        // Update the BMI value inside the fitness object
      'fitnessGoals.height': formData.height ,  // Update the height value inside the fitness object
      'fitnessGoals.weight':formData.weight})

      // // Update current user data
      // batch.update(user, {
      //   ...formData,
      //   height: 20,
      //   bmi:20,
      //   updatedAt: timestamp
      // });

      // // Add to history collection
      // batch.set(userDoc, {
      //   ...formData,
      //   height: 20,
      //   bmi:20,
      //   timestamp
      // });

  
      navigation.navigate('Menu');
    } catch (error) {
      console.error('Error updating details:', error);
      
      let errorMessage = 'Failed to update details. Please try again.';
      if (error.code === 'firestore/permission-denied') {
        errorMessage = 'You do not have permission to update details.';
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = 'User not found. Please login again.';
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  const InputField = ({ label, value, onChangeText, placeholder, unit }) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          keyboardType="numeric"
          editable={!isLoading}
        />
        {unit && <Text style={styles.unit}>{unit}</Text>}
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.title}>Update your details</Text>
          <Text style={styles.subtitle}>Update your details to help us calculate your BMI</Text>

          <View style={styles.formGrid}>
            <InputField
              label="Height"
              value={formData.height}
              onChangeText={(value) => setFormData({...formData, height: value})}
              placeholder="Enter height"
              unit="cm"
            />

            <InputField
              label="Weight"
              value={formData.weight}
              onChangeText={(value) => setFormData({...formData, weight: value})}
              placeholder="Enter weight"
              unit="kg"
            />

            <InputField
              label="Waist"
              value={formData.waist}
              onChangeText={(value) => setFormData({...formData, waist: value})}
              placeholder="Enter waist"
              unit="in"
            />

            <InputField
              label="Age"
              value={formData.age}
              onChangeText={(value) => setFormData({...formData, age: value})}
              placeholder="Enter age"
            />
          </View>

          <View style={styles.genderSection}>
            <Text style={styles.label}>Gender</Text>
            <View style={styles.genderOptions}>
              {['male', 'female', 'other'].map((gender) => (
                <TouchableOpacity
                  key={gender}
                  style={[
                    styles.genderButton,
                    formData.gender === gender && styles.genderButtonActive
                  ]}
                  onPress={() => setFormData({...formData, gender})}
                  disabled={isLoading}
                >
                  <Text style={[
                    styles.genderButtonText,
                    formData.gender === gender && styles.genderButtonTextActive
                  ]}>
                    {gender.charAt(0).toUpperCase() + gender.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity
            style={[styles.updateButton, isLoading && styles.updateButtonDisabled]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.updateButtonText}>Update Details</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  formGrid: {
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
  },
  unit: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
  },
  genderSection: {
    marginBottom: 24,
  },
  genderOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  genderButton: {
    flex: 1,
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  genderButtonActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  genderButtonText: {
    fontSize: 16,
    color: '#333',
  },
  genderButtonTextActive: {
    color: 'white',
  },
  updateButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
  },
  updateButtonDisabled: {
    opacity: 0.7,
  },
  updateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default UpdateDetailsScreen;
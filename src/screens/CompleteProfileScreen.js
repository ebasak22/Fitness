import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRoute, useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const CompleteProfileScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { phone, uid } = route.params || {};
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    sex: '',
    location: '',
  });

  useEffect(() => {
    // Check if user is already logged in and has profile
    const checkExistingProfile = async () => {
      try {
        const userDoc = await firestore()
          .collection('users')
          .doc(phone)
          .get();

        if (userDoc.exists && userDoc.data().name) {
          // Profile already exists, redirect to Dashboard
          navigation.replace('Dashboard');
        }
      } catch (error) {
        console.error('Error checking profile:', error);
      }
    };

    if (phone) {
      checkExistingProfile();
    }
  }, [phone, navigation]);

  const validateForm = () => {
    if (!formData.name.trim()) {
      throw new Error('Please enter your name');
    }

    if (!formData.email.trim()) {
      throw new Error('Please enter your email');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      throw new Error('Please enter a valid email address');
    }

    if (!formData.age || isNaN(formData.age)) {
      throw new Error('Please enter a valid age');
    }

    const age = parseInt(formData.age);
    if (age < 13 || age > 120) {
      throw new Error('Please enter a valid age between 13 and 120');
    }

    if (!formData.sex) {
      throw new Error('Please select your sex');
    }

    if (!formData.location.trim()) {
      throw new Error('Please enter your location');
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');

    try {
      // Validate form
      validateForm();

      // Create user profile in Firestore
      const userRef = firestore().collection('users').doc(phone);
      await userRef.set({
        ...formData,
        phone,
        uid,
        age: parseInt(formData.age),
        isMember: false,
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp()
      }, { merge: true });

      // Create a subcollection for additional user data if needed
      await userRef.collection('profile_details').doc('settings').set({
        notifications: true,
        emailVerified: false,
        lastUpdated: firestore.FieldValue.serverTimestamp()
      });

      navigation.replace('Dashboard');
    } catch (error) {
      console.error('Error saving profile:', error);
      setError(error.message || 'Failed to save profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyEmail = () => {
    // Placeholder for email verification functionality
    Alert.alert(
      'Email Verification',
      'This feature will be implemented in the next update.',
      [{ text: 'OK' }]
    );
  };

  if (!phone || !uid) {
    navigation.replace('Register');
    return null;
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.profileCard}>
          <Text style={styles.title}>Complete Your Profile</Text>
          <Text style={styles.subtitle}>Update your details to help us calculate your BMI</Text>

          {error ? <Text style={styles.errorMessage}>{error}</Text> : null}

          <View style={styles.formField}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(text) => {
                setFormData({...formData, name: text});
                setError('');
              }}
              editable={!isLoading}
              placeholder="Enter your full name"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.formField}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.emailField}>
              <TextInput
                style={[styles.input, styles.emailInput]}
                value={formData.email}
                onChangeText={(text) => {
                  setFormData({...formData, email: text.toLowerCase()});
                  setError('');
                }}
                editable={!isLoading}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="Enter your email"
                placeholderTextColor="#999"
              />
              <TouchableOpacity 
                style={styles.verifyButton}
                onPress={handleVerifyEmail}
                disabled={isLoading || !formData.email}
              >
                <Text style={styles.verifyButtonText}>Verify</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.formField}>
            <Text style={styles.label}>Age</Text>
            <TextInput
              style={styles.input}
              value={formData.age}
              onChangeText={(text) => {
                setFormData({...formData, age: text.replace(/[^0-9]/g, '')});
                setError('');
              }}
              editable={!isLoading}
              keyboardType="numeric"
              maxLength={3}
              placeholder="Enter your age"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.formField}>
            <Text style={styles.label}>Sex</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.sex}
                onValueChange={(value) => {
                  setFormData({...formData, sex: value});
                  setError('');
                }}
                enabled={!isLoading}
                style={styles.picker}
              >
                <Picker.Item label="Select Sex" value="" />
                <Picker.Item label="Male" value="male" />
                <Picker.Item label="Female" value="female" />
                <Picker.Item label="Other" value="other" />
              </Picker>
            </View>
          </View>

          <View style={styles.formField}>
            <Text style={styles.label}>Location</Text>
            <TextInput
              style={styles.input}
              value={formData.location}
              onChangeText={(text) => {
                setFormData({...formData, location: text});
                setError('');
              }}
              editable={!isLoading}
              placeholder="Enter your location"
              placeholderTextColor="#999"
            />
          </View>

          <TouchableOpacity
            style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Complete Profile</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  // ... (keeping existing styles)
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  profileCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    color: '#666',
    marginBottom: 30,
  },
  formField: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
    color: '#333',
    fontWeight: '500',
  },
  input: {
    width: '100%',
    padding: Platform.OS === 'ios' ? 12 : 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    fontSize: 16,
    color: '#333',
  },
  emailField: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  emailInput: {
    flex: 1,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    width: '100%',
    height: Platform.OS === 'ios' ? 150 : 50,
  },
  verifyButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    justifyContent: 'center',
  },
  verifyButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  submitButton: {
    width: '100%',
    padding: 15,
    backgroundColor: '#007bff',
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  errorMessage: {
    color: '#dc3545',
    backgroundColor: '#f8d7da',
    borderWidth: 1,
    borderColor: '#f5c6cb',
    padding: 10,
    borderRadius: 4,
    marginBottom: 20,
  },
});

export default CompleteProfileScreen;
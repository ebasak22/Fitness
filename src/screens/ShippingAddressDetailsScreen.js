import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const ShippingAddressDetailsScreen = () => {
  const navigation = useNavigation();
  const [selectedType, setSelectedType] = useState('home');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    locality: '',
    city: '',
    state: '',
    pincode: ''
  });

  const indianStates = [
    'Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh',
    'Assam', 'Bihar', 'Chandigarh', 'Chhattisgarh',
    'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Goa', 'Gujarat',
    'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand',
    'Karnataka', 'Kerala', 'Ladakh', 'Lakshadweep', 'Madhya Pradesh',
    'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha',
    'Puducherry', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
    'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
  ];

  const handleSubmit = async () => {
    try {
      // Validation
      if (!formData.name || !formData.address || !formData.locality ||
          !formData.city || !formData.state || !formData.pincode) {
        Alert.alert('Error', 'Please fill all fields');
        return;
      }

      if (!/^\d{6}$/.test(formData.pincode)) {
        Alert.alert('Error', 'Please enter a valid 6-digit pincode');
        return;
      }

      setLoading(true);

      const user = auth().currentUser;
      if (!user) {
        Alert.alert('Error', 'Please login to add address');
        navigation.navigate('Register');
        return;
      }

      const addressData = {
        ...formData,
        type: selectedType,
        createdAt: firestore.FieldValue.serverTimestamp(),
        userId: user.phoneNumber
      };

      // Save to Firestore
      await firestore()
        .collection('users')
        .doc(user.phoneNumber)
        .collection('addresses')
        .add(addressData);

      Alert.alert('Success', 'Address saved successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Error saving address:', error);
      Alert.alert('Error', 'Failed to save address. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const AddressTypeButton = ({ type, icon, label }) => (
    <TouchableOpacity
      style={[
        styles.typeOption,
        selectedType === type && styles.selectedTypeOption
      ]}
      onPress={() => setSelectedType(type)}
    >
      <Ionicons
        name={icon}
        size={24}
        color={selectedType === type ? '#6b46c1' : '#4a5568'}
      />
      <Text
        style={[
          styles.typeLabel,
          selectedType === type && styles.selectedTypeLabel
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView style={styles.scrollView}>
          {/* Address Type Selection */}
          <View style={styles.typeButtons}>
            <AddressTypeButton type="home" icon="home-outline" label="Home" />
            <AddressTypeButton type="office" icon="briefcase-outline" label="Office" />
            <AddressTypeButton type="other" icon="location-outline" label="Other" />
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.formField}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(text) => setFormData({...formData, name: text})}
                placeholder="Enter your name"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.formField}>
              <Text style={styles.label}>Address</Text>
              <TextInput
                style={styles.input}
                value={formData.address}
                onChangeText={(text) => setFormData({...formData, address: text})}
                placeholder="Enter your address"
                placeholderTextColor="#999"
                multiline
              />
            </View>

            <View style={styles.formField}>
              <Text style={styles.label}>Locality</Text>
              <TextInput
                style={styles.input}
                value={formData.locality}
                onChangeText={(text) => setFormData({...formData, locality: text})}
                placeholder="Enter locality"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.formField}>
              <Text style={styles.label}>City</Text>
              <TextInput
                style={styles.input}
                value={formData.city}
                onChangeText={(text) => setFormData({...formData, city: text})}
                placeholder="Enter city"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.formField}>
              <Text style={styles.label}>State</Text>
              <View style={styles.pickerContainer}>
                <Picker                  
                  selectedValue={formData.state}
                  onValueChange={(value) => setFormData({...formData, state: value})}
                  style={{  height: 50,
                    color:formData.state === '' ? '#999': "black"}}
                >
                   {!formData.state ?  <Picker.Item label="Select state" value="" /> : null}
                  {indianStates.map((state, index) => (
                    <Picker.Item
                      key={index}
                      label={state}
                      value={state.toLowerCase()}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            <View style={styles.formField}>
              <Text style={styles.label}>Pincode</Text>
              <TextInput
                style={styles.input}
                value={formData.pincode}
                onChangeText={(text) => setFormData({...formData, pincode: text.replace(/[^0-9]/g, '')})}
                placeholder="Enter pincode"
                placeholderTextColor="#999"
                keyboardType="numeric"
                maxLength={6}
              />
            </View>

            <TouchableOpacity
              style={[styles.submitButton, loading && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>SAVE ADDRESS</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#6b46c1',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '500',
    color: '#fff',
    textAlign: 'center',
    marginRight: 40,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  typeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  typeOption: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  selectedTypeOption: {
    backgroundColor: '#f0e7ff',
    borderColor: '#6b46c1',
  },
  typeLabel: {
    marginTop: 4,
    fontSize: 12,
    color: '#4a5568',
  },
  selectedTypeLabel: {
    color: '#6b46c1',
  },
  form: {
    padding: 16,
  },
  formField: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4a5568',
    marginBottom: 6,
  },
  input: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 6,
    fontSize: 16,
    color: '#2d3748',
    backgroundColor: '#fff',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 6,
    backgroundColor: '#fff',
  },
  picker: {
  
  },
  submitButton: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#6b46c1',
    borderRadius: 6,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#a795d1',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default ShippingAddressDetailsScreen;
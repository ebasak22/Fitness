import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import PhoneInput from 'react-native-phone-number-input';

const RegisterScreen = ({ navigation }) => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState(null);

  console.log('cjheddlld')

  const isMember = async () => {

    const userRef = firestore().collection('users').doc(phone);
    const userDoc = await userRef.get();
    const userData = userDoc.data();
      console.log('ssd', userData.isMember)
    if (userData.isMember) {
      navigation.navigate('Dashboard')
    }

  }

  useEffect(() => {
      // isMember()
  }, []);

  

  const handleSendOtp = async () => {
    if (loading) return;

    try {
      setLoading(true);

      if (!phone || phone.length < 10) {
        throw new Error('Please enter a valid phone number');
      }

      // The new way to trigger phone auth in React Native Firebase
      const confirmation = await auth().signInWithPhoneNumber(phone);
      setConfirm(confirmation);
      setShowOtp(true);
      Alert.alert('Success', 'OTP sent successfully');
    } catch (error) {
      console.error('Error sending OTP:', error);
      Alert.alert('Error', error.message || 'Error sending OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (loading || !confirm) {
      Alert.alert('Error', 'Please request OTP first');
      return;
    }

    try {
      setLoading(true);

      if (!otp || otp.length !== 6) {
        throw new Error('Please enter a valid 6-digit OTP');
      }

      // Confirm the OTP code
      const credential = await confirm.confirm(otp);
      const user = credential.user;

      const userRef = firestore().collection('users').doc(phone);
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        await userRef.set({
          phoneNumber: phone,
          createdAt: firestore.FieldValue.serverTimestamp(),
          uid: user.uid
        });
        
        navigation.replace('CompleteProfile', {
          phone,
          uid: user.uid
        });
      } else {
        const userData = userDoc.data();
        console.log('userLogData', userData.isMember)
        if (userData.isMember === true) {
          navigation.navigate('Dashboard');
        } else {
          console.log('Complter')
          navigation.replace('CompleteProfile', {
            phone,
            uid: user.uid
          });
        }
      }
    } catch (error) {
      console.error('Verification error:', error);
      Alert.alert('Error', 'Invalid OTP or verification failed. Please try again.');
      setOtp('');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePhone = () => {
    setShowOtp(false);
    setOtp('');
    setConfirm(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.card}>
          <Text style={styles.title}>Spark Fitness</Text>
          <Text style={styles.subtitle}>
            {showOtp ? 'Enter verification code' : 'Enter your phone number to continue'}
          </Text>

          {!showOtp ? (
            <>
              <PhoneInput
                defaultCode="IN"
                layout="first"
                onChangeFormattedText={(text) => setPhone(text)}
                withDarkTheme
                containerStyle={styles.phoneInput}
                textContainerStyle={styles.phoneInputText}
              />

              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleSendOtp}
                disabled={loading || !phone}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Send OTP</Text>
                )}
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TextInput
                style={styles.input}
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChangeText={(text) => setOtp(text.replace(/\D/g, '').slice(0, 6))}
                keyboardType="number-pad"
                maxLength={6}
                editable={!loading}
              />

              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleVerifyOtp}
                disabled={loading || otp.length !== 6}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Verify OTP</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.linkButton}
                onPress={handleChangePhone}
                disabled={loading}
              >
                <Text style={styles.linkButtonText}>Change Phone Number</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // Styles remain unchanged
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  phoneInput: {
    width: '100%',
    marginBottom: 20,
  },
  phoneInputText: {
    backgroundColor: '#f5f5f5',
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  linkButton: {
    padding: 10,
  },
  linkButtonText: {
    color: '#007bff',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default RegisterScreen;
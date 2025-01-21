import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';

const ProfileSettingsScreen = () => {
  const navigation = useNavigation();

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Logout", 
          onPress: async() => {
            // Add your logout logic here
            // For example: auth.signOut()
            try {
              await auth().signOut();
              navigation.navigate('Register');
            } catch (error) {
              console.error('Error signing out:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  const settingsOptions = [
    {
      id: 'editProfile',
      title: 'Edit Profile',
      description: 'Update your personal information',
      icon: 'person-outline',
      screen: 'EditProfile'
    },
    {
      id: 'address',
      title: 'Address',
      description: 'Manage your addresses',
      icon: 'location-outline',
      screen: 'Addresses'
    },
    {
      id: 'communication',
      title: 'Old Communication',
      description: 'View previous communications',
      icon: 'chatbox-outline',
      screen: 'CommunicationScreen'
    },
    {
      id: 'wearable',
      title: 'Connect to Wearable',
      description: 'Connect your fitness devices',
      icon: 'watch-outline',
      screen: 'WearableScreen'
    },
    {
      id: 'terms',
      title: 'Terms & Conditions',
      description: 'Read our terms of service',
      icon: 'document-text-outline',
      screen: 'Terms'
    },
    {
      id: 'privacy',
      title: 'Privacy Policy',
      description: 'View our privacy policy',
      icon: 'shield-outline',
      screen: 'PrivacyPolicy'
    },
    {
      id: 'refund',
      title: 'Cancellation/Refund Policy',
      description: 'View our refund policies',
      icon: 'cash-outline',
      screen: 'RefundPolicy'
    },
    {
      id: 'about',
      title: 'About',
      description: 'Learn more about us',
      icon: 'information-circle-outline',
      screen: 'About'
    },
    {
      id: 'contact',
      title: 'Contact Us',
      description: 'Get in touch with our team',
      icon: 'mail-outline',
      screen: 'Contact'
    },
    {
      id: 'deleteAccount',
      title: 'Delete Account',
      description: 'Permanently delete your account',
      icon: 'trash-outline',
      screen: 'DeleteAccountScreen',
      isDestructive: true
    },
    {
      id: 'logout',
      title: 'Logout',
      description: 'Sign out of your account',
      icon: 'log-out-outline',
      isDestructive: true,
      onPress: handleLogout
    }
  ];

  const handleOptionPress = (option) => {
    if (option.onPress) {
      option.onPress();
    } else {
      navigation.navigate(option.screen);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
    
      <ScrollView style={styles.scrollView}>
        <View style={styles.settingsContainer}>
          {settingsOptions.map((option, index) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.settingItem,
                index === settingsOptions.length - 1 && styles.lastItem,
                (option.isDestructive) && styles.destructiveItem
              ]}
              onPress={() => handleOptionPress(option)}
            >
              <View style={styles.settingContent}>
                <View style={[
                  styles.iconContainer,
                  option.isDestructive && styles.destructiveIcon
                ]}>
                  <Ionicons
                    name={option.icon}
                    size={24}
                    color={option.isDestructive ? '#ff4444' : '#1a2980'}
                  />
                </View>
                <View style={styles.textContainer}>
                  <Text style={[
                    styles.settingTitle,
                    option.isDestructive && styles.destructiveText
                  ]}>
                    {option.title}
                  </Text>
                  <Text style={[
                    styles.settingDescription,
                    option.isDestructive && styles.destructiveText
                  ]}>
                    {option.description}
                  </Text>
                </View>
              </View>
              <Ionicons
                name="chevron-forward"
                size={24}
                color={option.isDestructive ? '#ff4444' : '#999'}
              />
            </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginRight: 40,
  },
  scrollView: {
    flex: 1,
  },
  settingsContainer: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e6f0ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  destructiveIcon: {
    backgroundColor: '#ffe6e6',
  },
  textContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
  },
  destructiveItem: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  destructiveText: {
    color: '#ff4444',
  },
});

export default ProfileSettingsScreen;
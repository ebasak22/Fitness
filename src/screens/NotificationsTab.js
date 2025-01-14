import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const NotificationsTab = ({ userData }) => {
  const navigation = useNavigation();

  const getDaysRemaining = () => {
    if (!userData?.membershipEndDate) return null;
    const endDate = new Date(userData.membershipEndDate);
    const today = new Date();
    return Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
  };

  const handleRenewClick = () => {
    // Navigate using React Navigation
    navigation.navigate('MembershipPlans');
  };

  const renderNotification = () => {
    const daysRemaining = getDaysRemaining();

    if (userData?.membershipEndDate && new Date(userData.membershipEndDate) < new Date()) {
      return (
        <View style={[styles.card, styles.expiredCard]}>
          <View style={styles.notificationContent}>
            <View style={styles.textContainer}>
              <Text style={styles.title}>Plan Expiry Alert</Text>
              <Text style={styles.message}>
                Your current package has expired. All application based services will be blocked within 3 days.
              </Text>
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={handleRenewClick}
            >
              <Text style={styles.buttonText}>Renew Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    if (daysRemaining <= 5 && daysRemaining > 1) {
      return (
        <View style={[styles.card, styles.warningCard]}>
          <View style={styles.notificationContent}>
            <View style={styles.textContainer}>
              <Text style={styles.title}>Plan Expiry Alert</Text>
              <Text style={styles.message}>
                Your plan will expire within {daysRemaining} days, renew to have uninterrupted services
              </Text>
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={handleRenewClick}
            >
              <Text style={styles.buttonText}>Renew Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    if (daysRemaining === 1) {
      return (
        <View style={[styles.card, styles.urgentCard]}>
          <View style={styles.notificationContent}>
            <View style={styles.textContainer}>
              <Text style={styles.title}>Plan Expiry Alert</Text>
              <Text style={styles.message}>
                Your plan will expire tomorrow, renew now to avoid service interruption
              </Text>
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={handleRenewClick}
            >
              <Text style={styles.buttonText}>Renew Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return null;
  };

  return (
    <View style={styles.container}>
      {renderNotification()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  card: {
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    padding: 15,
  },
  expiredCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#dc3545',
  },
  warningCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  urgentCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#dc3545',
  },
  notificationContent: {
    flexDirection: 'column',
  },
  textContainer: {
    flex: 1,
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#dc3545',
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: '#666',
  },
  button: {
    backgroundColor: '#28a745',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
    alignSelf: 'stretch',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default NotificationsTab;
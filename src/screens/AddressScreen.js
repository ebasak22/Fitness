import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const AddressScreen = () => {
  const navigation = useNavigation();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAddresses();

    // Subscribe to address updates
    const user = auth().currentUser;
    if (user) {
      const unsubscribe = firestore()
        .collection('users')
        .doc(user.phoneNumber)
        .collection('addresses')
        .onSnapshot(
          snapshot => {
            const addressList = [];
            snapshot.forEach(doc => {
              addressList.push({
                id: doc.id,
                ...doc.data()
              });
            });
            setAddresses(addressList);
            setLoading(false);
          },
          error => {
            console.error("Error fetching addresses: ", error);
            Alert.alert('Error', 'Failed to load addresses');
            setLoading(false);
          }
        );

      return () => unsubscribe();
    }
  }, []);

  const fetchAddresses = async () => {
    try {
      const user = auth().currentUser;
      if (!user) {
        navigation.replace('Register');
        return;
      }

      const addressesSnapshot = await firestore()
        .collection('users')
        .doc(user.phoneNumber)
        .get();

      const addressList = [];
      addressesSnapshot.forEach(doc => {
        addressList.push({
          id: doc.id,
          ...doc.data()
        });
      });

      setAddresses(addressList);
    } catch (error) {
      console.error("Error fetching addresses: ", error);
      Alert.alert('Error', 'Failed to load addresses');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      const user = auth().currentUser;
      await firestore()
        .collection('users')
        .doc(user.phoneNumber)
        .collection('addresses')
        .doc(addressId)
        .delete();

      Alert.alert('Success', 'Address deleted successfully');
    } catch (error) {
      console.error("Error deleting address: ", error);
      Alert.alert('Error', 'Failed to delete address');
    }
  };

  const AddressCard = ({ address }) => (
    <View style={styles.addressCard}>
      <View style={styles.addressInfo}>
        <Text style={styles.addressType}>{address.type}</Text>
        <Text style={styles.addressText}>
          {address.street}, {address.city}
        </Text>
        <Text style={styles.addressText}>
          {address.state}, {address.pinCode}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteAddress(address.id)}
      >
        <Ionicons name="trash-outline" size={20} color="#ef4444" />
      </TouchableOpacity>
    </View>
  );

  const NoAddressesView = () => (
    <View style={styles.noAddressContainer}>
      <View style={styles.iconContainer}>
        <Ionicons name="location-outline" size={40} color="#6b46c1" />
      </View>
      <Text style={styles.noAddressText}>No addresses found</Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Addresses</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6b46c1" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Addresses</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        {addresses.length === 0 ? (
          <NoAddressesView />
        ) : (
          addresses.map(address => (
            <AddressCard key={address.id} address={address} />
          ))
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('ShippingAddressDetail')}
      >
        <Ionicons name="add-outline" size={24} color="#fff" />
        <Text style={styles.addButtonText}>Add New Address</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // ... (keeping existing styles)
  container: {
    flex: 1,
    backgroundColor: '#f8f9ff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#6b46c1',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    marginRight: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 20,
    paddingBottom: 100,
  },
  // Adding new styles for address cards
  addressCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addressInfo: {
    flex: 1,
  },
  addressType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b46c1',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 2,
  },
  deleteButton: {
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Keeping existing styles
  noAddressContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(107, 70, 193, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  noAddressText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4b5563',
  },
  addButton: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
    backgroundColor: '#6b46c1',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6b46c1',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
});

export default AddressScreen;
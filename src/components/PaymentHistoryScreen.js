import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  ActivityIndicator 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function PaymentHistoryScreen() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const token = await AsyncStorage.getItem('token'); // Using AsyncStorage instead of localStorage
      
      const response = await fetch('http://localhost:3000/payments', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setPayments(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching payment records:', error);
      setLoading(false);
    }
  };

  const renderPaymentItem = ({ item }) => (
    <View style={styles.paymentRow}>
      <View style={styles.rowSection}>
        <Text style={styles.label}>Order ID:</Text>
        <Text style={styles.value}>{item.order_id}</Text>
      </View>
      
      <View style={styles.rowSection}>
        <Text style={styles.label}>Payment ID:</Text>
        <Text style={styles.value}>{item.payment_id}</Text>
      </View>

      <View style={styles.rowSection}>
        <Text style={styles.label}>Amount:</Text>
        <Text style={styles.value}>{item.amount / 100}</Text>
      </View>

      <View style={styles.rowSection}>
        <Text style={styles.label}>Currency:</Text>
        <Text style={styles.value}>{item.currency}</Text>
      </View>

      <View style={styles.rowSection}>
        <Text style={styles.label}>Status:</Text>
        <Text style={[
          styles.value, 
          item.status === 'success' ? styles.successStatus : styles.pendingStatus
        ]}>
          {item.status}
        </Text>
      </View>

      <View style={styles.rowSection}>
        <Text style={styles.label}>Date:</Text>
        <Text style={styles.value}>
          {new Date(item.created_at).toLocaleString()}
        </Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Payment History</Text>
      <FlatList
        data={payments}
        renderItem={renderPaymentItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    padding: 16,
  },
  paymentRow: {
    backgroundColor: '#ffffff',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  rowSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
  value: {
    fontSize: 14,
    color: '#333',
  },
  successStatus: {
    color: '#4CAF50',
  },
  pendingStatus: {
    color: '#FFC107',
  },
});

export default PaymentHistoryScreen;
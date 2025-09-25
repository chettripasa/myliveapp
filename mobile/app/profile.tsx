import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const API_URL = 'http://localhost:3000';

export default function ProfileScreen() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        router.replace('/auth');
        return;
      }
      try {
        const res = await fetch(`${API_URL}/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.id) setUser(data);
        else {
          Alert.alert('Session expired', 'Please login again.');
          await AsyncStorage.removeItem('token');
          router.replace('/auth');
        }
      } catch {
        Alert.alert('Network error');
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" /></View>;
  if (!user) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <View style={styles.card}>
        <Text selectable>{JSON.stringify(user, null, 2)}</Text>
      </View>
      <Button title="Logout" onPress={async () => {
        await AsyncStorage.removeItem('token');
        router.replace('/auth');
      }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  card: {
    width: '100%',
    backgroundColor: '#f4f4f4',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';


export default function Profile({ navigation }) {
  const [userData, setUserData] = useState(null);

  // ดึงข้อมูลจาก AsyncStorage
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedData = await AsyncStorage.getItem('userData');
        if (storedData) {
          setUserData(JSON.parse(storedData)); // แปลง JSON กลับเป็น Object
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    loadUserData();
  }, []);

    // ฟังก์ชันสำหรับ Logout
    const handleLogout = async () => {
      try {
        await AsyncStorage.removeItem('userData'); // ลบข้อมูลออกจาก AsyncStorage
        navigation.replace('Login'); // นำทางกลับไปหน้า Login
      } catch (error) {
        console.error('Error during logout:', error);
      }
    };

  return (
    <View style={styles.container}>
      {userData ? (
        <>
           {userData.image ? ( // ตรวจสอบว่ามี image หรือไม่
            <Image
              source={{ uri: userData.image }}
              style={styles.profileImage}
            />
          ) : (
            <Ionicons name="person-circle-outline" size={100} color="gray" /> // ใช้ไอคอนแทน
          )}
          <Text style={styles.title}>{userData.fullname}</Text>
          <Text style={styles.subtitle}>Role: {userData.role}</Text>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={styles.title}>Loading...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: 'gray',
  },
  logoutButton: {
    backgroundColor: '#FF5A5F',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

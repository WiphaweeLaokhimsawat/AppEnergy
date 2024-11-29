import { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet, TouchableOpacity,Image } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImportFile from './ImportFile'; 


// Components for each tab
function Overview() {
  return (
    <View style={styles.container}>
      <Text>homepage</Text>
    </View>
  );
}

function PlaceholderScreen({ name }) {
  return (
    <View style={styles.container}>
      <Text>{name}</Text>
    </View>
  );
}


const Stack = createStackNavigator();

function HomeStack() {
  const [userData, setUserData] = useState(null);

  // ดึงข้อมูลผู้ใช้จาก AsyncStorage
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
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Overview"
        component={Overview}
        options={({ navigation }) => ({
          headerTitle: 'Home',
          headerTitleAlign: 'center', // จัด Title ให้อยู่ตรงกลาง
          headerRight: () => (
            <TouchableOpacity
              style={{ marginRight: 15 }}
              onPress={() => navigation.navigate('Profile')} // นำทางไปหน้า Profile
            >
              {userData && userData.image ? ( // ตรวจสอบว่ามี userData และ image หรือไม่
                <Image
                source={{ uri: userData.image }}

                  style={styles.headerProfileImage}
                />
              ) : (
                <Ionicons
                  name="person-circle-outline"
                  size={28}
                  color="black"
                />
              )}
            </TouchableOpacity>
          ),
        })}
      />
    </Stack.Navigator>
  );
}
// Bottom Tab Navigator
const Tab = createBottomTabNavigator();

export default function HomePage() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Graph') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Emissions') {
            iconName = focused ? 'stats-chart' : 'stats-chart-outline';
          } else if (route.name === 'Goal') {
            iconName = focused ? 'ribbon' : 'ribbon-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'green',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Graph" component={HomeStack} />
      <Tab.Screen
        name="Emissions"
        component={ImportFile}
      />
      <Tab.Screen
        name="Goal"
        children={() => <PlaceholderScreen name="Goal Screen" />}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  headerProfileImage: {
    width: 28, // กำหนดขนาดรูปใน Header
    height: 28,
    borderRadius: 14, // ทำให้รูปเป็นวงกลม
  },
});

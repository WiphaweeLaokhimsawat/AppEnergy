import { useState,useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  Button,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function Login({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [users, setUsers] = useState([]); // เก็บข้อมูลผู้ใช้ที่ดึงมา

  const [isModalVisible, setModalVisible] = useState(false); // สำหรับควบคุม modal
  const [modalMessage, setModalMessage] = useState(''); // ข้อความใน modal

  const toggleModal = (message) => {
    setModalMessage(message);
    setModalVisible(!isModalVisible);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/users'); // ใช้ axios.get แทน fetch
        setUsers(response.data); // เก็บข้อมูลผู้ใช้ใน state
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleLogin = async () => {
    try {
      // ส่งข้อมูล username และ password ไปยัง API
      const response = await axios.post('http://127.0.0.1:5000/login', {
        user: username, // ต้องมั่นใจว่าส่งค่า `username` เป็น `user`
        password: password,

        
        
      });
      console.log('Login response:', response.data);
      
      const userData = {
        fullname: response.data.fullname,
        user: response.data.user,
        role: response.data.role,
        image: response.data.image || '',
      };
      await AsyncStorage.setItem('userData', JSON.stringify(userData)); 
      console.log('AsyncStorage imported successfully:', userData);
     // ตรวจสอบ role ของผู้ใช้ที่ล็อกอิน
    if (response.data.role === 'admin') {
      // นำทางไปหน้า Home หาก role เป็น admin
      navigation.replace('Home', {
        fullname: response.data.fullname,
        user: response.data.user,
        role: response.data.role,
        image:response.data.image || '',
      });
    } else if (response.data.role === 'customer') {
      // นำทางไปหน้า Login (หรือน่าจะเป็นหน้าอื่น เช่น CustomerDashboard) หาก role เป็น customer
      navigation.replace('Profile', {
        fullname: response.data.fullname,
        user: response.data.user,
        role: response.data.role,
        image:response.data.image || '',
      });
    } else {
      alert('Invalid role');
    }
  } catch (error) {
    // หากเกิดข้อผิดพลาด ให้แสดงข้อความ
    console.error('Login error:', error.response?.data || error.message);
    toggleModal('Invalid username or password');
  }
  };
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image
          source={{
            uri: 'https://cdn.discordapp.com/attachments/898233597239099402/1311498691374219284/logo.png?ex=674913d6&is=6747c256&hm=77ab1dba69a37b38a19ad9e59f72fad86143a999c1097343854c19580c1986fa& ',
          }} // ใส่ URL โลโก้ของคุณ
          style={styles.logo}
        />
        <Text style={styles.title}>THAI NIPPON RUBBER</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Username"
          placeholderTextColor="#888888"
          value={username}
          onChangeText={(text) => setUsername(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Password"
          placeholderTextColor="#888888"
          secureTextEntry
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}>
          <Text style={styles.buttonText}>LOGIN</Text>
        </TouchableOpacity>
      </View>
      {/* Modal สำหรับแสดงข้อความ */}
      <Modal isVisible={isModalVisible}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>{modalMessage}</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D0EFFF', // สีพื้นหลังฟ้าอ่อน
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    height: '40%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 10,
    marginTop: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0056A8', // สีข้อความ "THAI NIPPON RUBBER"
    marginBottom: 20,
  }, 
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#3ACF58', // สีเขียวของปุ่ม
    paddingVertical: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',

  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 15,
    textAlign: 'center', 
  },
  closeButton: {
    backgroundColor: '#ff595e',
    padding: 10,
    borderRadius: 5,
    width: '50%',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

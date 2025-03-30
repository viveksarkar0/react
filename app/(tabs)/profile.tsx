import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Settings, Heart, LogOut } from 'lucide-react-native';
import { Link } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

export default function ProfileScreen() {
  const { logout } = useAuth();
  const [error, setError] = useState('');
  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      setError('Registration failed. Please try again.');
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500' }}
          style={styles.profileImage}
        />
        <Text style={styles.name}>John Doe</Text>
        <Text style={styles.email}>john.doe@example.com</Text>
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.menuSection}>
        <TouchableOpacity style={styles.menuItem}>
          <Settings size={24} color="#000" />
          <Text style={styles.menuText}>Settings</Text>
        </TouchableOpacity>
        <Link href={'/(tabs)/favorites'}>
        <TouchableOpacity style={styles.menuItem}>
          <Heart size={24} color="#000" />
          <Text style={styles.menuText}>Favorites</Text>
        </TouchableOpacity>
        </Link>
     
        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
          <LogOut size={24} color="#000" />
          <Text style={styles.menuText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    padding: 32,
    borderBottomWidth: 1,
    borderBottomColor: '#f4f4f4',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  editButton: {
    backgroundColor: '#000',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  menuSection: {
    padding: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f4f4f4',
  },
  menuText: {
    fontSize: 16,
    marginLeft: 16,
  },
});
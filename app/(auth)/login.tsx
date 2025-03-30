import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      await login(email, password);
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800' }}
          style={styles.headerImage}
        />
        <View style={styles.overlay} />
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to continue shopping</Text>
      </View>

      <View style={styles.form}>
        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholderTextColor="#666"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#666"
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>

        <Link href="/register" asChild>
          <TouchableOpacity style={styles.linkButton}>
            <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
          </TouchableOpacity>
        </Link>
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
    height: 300,
    justifyContent: 'flex-end',
    padding: 20,
  },
  headerImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  title: {
    fontSize: 32,
    color: '#fff',
    fontFamily: 'Inter_700Bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    fontFamily: 'Inter_400Regular',
    opacity: 0.8,
  },
  form: {
    flex: 1,
    padding: 20,
    marginTop: 20,
  },
  input: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 12,
    marginBottom: 16,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
  },
  button: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  linkButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  linkText: {
    color: '#666',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  error: {
    color: '#ff4444',
    marginBottom: 16,
    textAlign: 'center',
    fontFamily: 'Inter_400Regular',
  },
});
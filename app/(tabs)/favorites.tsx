import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import { users } from '@/services/api';

interface Product {
  _id: string;
  name: string;
  images: string[];
  brand: string;
  category: string;
  description: string;
  price: number;
}

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const response = await users.getFavorites();
      console.log('Favorites Response:', response.data); // Debugging

      // Ensure we access the correct products array
      const products = response.data?.products ?? [];
      setFavorites(products);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (favorites.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No favorite products found.</Text>
      </View>
    );
  }
  const BASE_URL = 'http://192.168.29.144:4000';
  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image
              source={{
                uri: item.images?.length
                  ? `${BASE_URL}${item.images[0]}`
                  : 'https://via.placeholder.com/80',
              }}
              style={styles.image}
            />

            <View style={styles.details}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.category}>{item.category}</Text>
              <Text style={styles.price}>${item.price}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  text: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    textAlign: 'center',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  details: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
  },
  category: {
    fontSize: 14,
    color: '#666',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

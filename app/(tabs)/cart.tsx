import { useEffect, useState } from 'react';
import { 
  View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator, Alert, FlatList 
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Heart, Trash } from 'lucide-react-native';
import { products, users } from '@/services/api';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming, 
  Easing
} from 'react-native-reanimated';

const baseUrl = 'https://your-backend-url.com';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
}

interface CartItem {
  _id: string;
  product: Product;
  quantity: number;
}

export default function CartScreen() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await users.getCart();
      if (Array.isArray(response.data.items)) {
        setCartItems(response.data.items);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchCart();
  }, []);

  const removeItem = async (itemId: string) => {
    try {
      await users.removeFromCart(itemId);
      await fetchCart();
    } catch (error) {
      Alert.alert("Error", "Could not remove item from cart.");
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (cartItems.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Heart size={80} color="#aaa" />
        <Text style={styles.emptyText}>Your cart is empty.</Text>
      </View>
    );
  }
  const BASE_URL = "http://192.168.29.144:4000";


 
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛒 Your Cart</Text>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <Image
              source={{ uri: `${baseUrl}${item.product.image}:"https://via.placeholder.com/200"` }}
              style={styles.image}
            />
            <View style={styles.details}>
              <Text style={styles.name}>{item.product.name}</Text>
              <Text style={styles.price}>${item.product.price} x {item.quantity}</Text>
            </View>
            <TouchableOpacity 
              style={styles.removeButton} 
              onPress={() => removeItem(item._id)}
            >
              <Trash size={20} color="#ff3b30" />
            </TouchableOpacity>
          </View>
        )}
      />
      <TouchableOpacity style={styles.checkoutButton}>
        <Text style={styles.checkoutText}>Proceed to Checkout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#bbb',
    marginTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#fff',
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#1e1e1e',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 12,
    marginRight: 12,
  },
  details: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#fff',
  },
  price: {
    fontSize: 16,
    color: '#bbb',
  },
  removeButton: {
    padding: 8,
    borderRadius: 5,
  },
  checkoutButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  checkoutText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});
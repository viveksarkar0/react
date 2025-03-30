import { useEffect, useState } from 'react';
import { 
  View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator, Alert 
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Heart } from 'lucide-react-native';
import { products, users } from '@/services/api';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming, 
  Easing
} from 'react-native-reanimated';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
}

export default function ProductScreen() {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [product, setProduct] = useState<Product | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cartLoading, setCartLoading] = useState(false);

  const imageOpacity = useSharedValue(0);
  const imageScale = useSharedValue(0.8);
  const contentTranslateY = useSharedValue(50);
  const buttonScale = useSharedValue(1);
  
  useEffect(() => {
    imageOpacity.value = withTiming(1, { duration: 1000, easing: Easing.out(Easing.exp) });
    imageScale.value = withSpring(1, { damping: 10, stiffness: 100 });
    contentTranslateY.value = withSpring(0, { damping: 12, stiffness: 80 });
  }, []);

  const animatedImage = useAnimatedStyle(() => ({
    opacity: imageOpacity.value,
    transform: [{ scale: imageScale.value }],
  }));

  const animatedContent = useAnimatedStyle(() => ({
    transform: [{ translateY: contentTranslateY.value }],
  }));

  const animatedButton = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const animatedHeart = useAnimatedStyle(() => ({
    transform: [{ scale: isFavorite ? withSpring(1.2) : withSpring(1) }],
  }));

  const handlePressIn = () => (buttonScale.value = withTiming(0.95));
  const handlePressOut = () => (buttonScale.value = withSpring(1));

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await products.getById(id);
        setProduct(response.data);
        const favoriteResponse = await users.getFavorites();
        setIsFavorite(favoriteResponse.data.includes(id));
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);

  const handleFavorite = async () => {
    if (!id) return;
    try {
      const response = await users.toggleFavorite(id);
      if (response.status === 200) {
        setIsFavorite((prev) => !prev);
      }
    } catch (error) {
      Alert.alert("Error", "Could not update favorite status.");
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      setCartLoading(true);
      if (id) {
        await users.addToCart(id, 1);
      } else {
        throw new Error("Product ID is undefined.");
      }
      Alert.alert("Success", "Product added to cart!");
    } catch (error) {
      Alert.alert("Error", "Could not add product to cart.");
    } finally {
      setCartLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.centeredContainer}>
        <Text>Product not found</Text>
      </View>
    );
  }
  const BASE_URL = "http://192.168.29.144:4000";

  const imageUrl = product.image ? `${BASE_URL}${product.image}` : "https://via.placeholder.com/200";
  return (
    <ScrollView style={styles.container}>
      <Animated.Image source={{ uri: imageUrl }} style={[styles.image, animatedImage]} />
  
      <Animated.View style={[styles.content, animatedContent]}>
        <View style={styles.header}>
          <View>
            <Text style={styles.category}>{product.category}</Text>
            <Text style={styles.name}>{product.name}</Text>
            <Text style={styles.price}>${product.price}</Text>
          </View>
          <TouchableOpacity style={styles.favoriteButton} onPress={handleFavorite}>
            <Animated.View style={animatedHeart}>
              <Heart size={24} color={isFavorite ? '#ff4444' : '#fff'} fill={isFavorite ? '#ff4444' : 'none'} />
            </Animated.View>
          </TouchableOpacity>
        </View>
  
        <Text style={styles.descriptionTitle}>Description</Text>
        <Text style={styles.description}>{product.description}</Text>
  
        <TouchableOpacity 
          style={styles.addToCartButton} 
          onPress={handleAddToCart} 
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={cartLoading}
        >
          <Animated.View style={animatedButton}>
            {cartLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.addToCartText}>Add to Cart</Text>}
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // Dark aesthetic background
  },
  image: {
    width: '100%',
    height: 400,
    resizeMode: 'cover',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  content: {
    padding: 20,
    backgroundColor: 'rgba(255,255,255,0.1)', // Glassmorphism effect
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20,
    shadowColor: '#fff',
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  category: {
    fontSize: 14,
    color: '#bbb',
    marginBottom: 4,
    fontFamily: 'Inter_400Regular',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  name: {
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
    color: '#fff',
  },
  price: {
    fontSize: 22,
    fontFamily: 'Inter_600SemiBold',
    color: '#ddd',
    marginTop: 4,
  },
  favoriteButton: {
    padding: 12,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  descriptionTitle: {
    fontSize: 20,
    fontFamily: 'Inter_600SemiBold',
    marginTop: 16,
    marginBottom: 6,
    color: '#fff',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#bbb',
    fontFamily: 'Inter_400Regular',
  },
  addToCartButton: {
    backgroundColor: '#ff4444',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#ff4444',
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  addToCartText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212', // Match the dark aesthetic background
  },
});

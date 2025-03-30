import { useEffect, useState } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TextInput, Image, TouchableOpacity, ActivityIndicator
} from 'react-native';
import { Search } from 'lucide-react-native';
import { Link } from 'expo-router';
import { products } from '@/services/api';

type Product = {
  _id: string;
  name: string;
  price: number;
  image: string;
  category: string;
};

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [productList, setProductList] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await products.getAll();
      setProductList(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = productList.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const BASE_URL = "http://192.168.29.144:4000";

  const renderProduct = ({ item }: { item: Product }) => {
    const imageUrl = item.image ? `${BASE_URL}${item.image}` : "https://via.placeholder.com/200";
    return (
      <Link href={`/product/${item._id}`} asChild>
        <TouchableOpacity style={styles.productCard}>
          <Image source={{ uri: imageUrl }} style={styles.productImage} />
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productPrice}>${item.price}</Text>
          </View>
        </TouchableOpacity>
      </Link>
    );
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Search size={20} color="#fff" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          placeholderTextColor="#ddd"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item._id}
        numColumns={2}
        contentContainerStyle={styles.productGrid}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 10,
    marginBottom: 16,
    marginTop: 30,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
  },
  productGrid: {
    paddingBottom: 16,
  },
  productCard: {
    flex: 1,
    margin: 8,
    backgroundColor: '#333',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  productImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  productInfo: {
    padding: 10,
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffcc00',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
});

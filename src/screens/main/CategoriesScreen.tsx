import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import BottomNavigation from '../../components/BottomNavigation';

const { width } = Dimensions.get('window');

// Kategori verileri - Türkçe
const categories = [
  { id: '1', name: 'Giyim', itemCount: 1856, icon: 'shirt' },
    { id: '2', name: 'Elektronik', itemCount: 845, icon: 'phone-portrait' },
  { id: '3', name: 'Kozmetik', itemCount: 286, icon: 'color-palette-outline' },
  { id: '4', name: 'Mücevher', itemCount: 465, icon: 'diamond-outline' },
  { id: '5', name: 'Müzik Aletleri', itemCount: 149, icon: 'musical-notes-outline' },
  { id: '6', name: 'Fitness', itemCount: 562, icon: 'fitness-outline' },
  { id: '7', name: 'Oyuncak', itemCount: 823, icon: 'game-controller-outline' },
  { id: '8', name: 'Mutfak', itemCount: 845, icon: 'restaurant-outline' },
  { id: '9', name: 'Spor', itemCount: 286, icon: 'football-outline' },
  { id: '10', name: 'Ayakkabı', itemCount: 225, icon: 'footsteps-outline' },
  { id: '11', name: 'Sağlık Bakımı', itemCount: 89, icon: 'medical-outline' },
  { id: '12', name: 'Ofis Ürünleri', itemCount: 845, icon: 'briefcase-outline' },
];

const CategoriesScreen: React.FC = () => {
  const navigation = useNavigation();

  const renderCategoryItem = (item: any, index: number) => {
    const isEven = index % 2 === 0;
    return (
      <TouchableOpacity 
        key={item.id} 
        style={[styles.categoryCard, { marginRight: isEven ? 8 : 0, marginLeft: isEven ? 0 : 8 }]}
        activeOpacity={0.7}
      >
        <View style={styles.categoryImageContainer}>
          <View style={styles.categoryIconContainer}>
            <Ionicons name={item.icon as any} size={32} color="#FFD700" />
          </View>
        </View>
        <View style={styles.categoryContent}>
          <Text style={styles.categoryName}>{item.name}</Text>
          <Text style={styles.categoryItemCount}>{item.itemCount} Ürün</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderCategoryPairs = () => {
    const pairs = [];
    for (let i = 0; i < categories.length; i += 2) {
      pairs.push(
        <View key={i} style={styles.categoryRow}>
          {renderCategoryItem(categories[i], i)}
          {categories[i + 1] && renderCategoryItem(categories[i + 1], i + 1)}
        </View>
      );
    }
    return pairs;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Kategoriler</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Categories Grid */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.categoriesContainer}>
          {renderCategoryPairs()}
        </View>
      </ScrollView>

      <BottomNavigation activeTab="categories" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
  },
  backButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 24,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginTop: 10,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    paddingTop: 32,
  },
  categoryRow: {
    flexDirection: 'row',
    marginBottom: 24,
    justifyContent: 'space-between',
  },
  categoryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },
  categoryImageContainer: {
    height: 120,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  categoryIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryContent: {
    padding: 12,
    alignItems: 'flex-start',
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 4,
  },
  categoryItemCount: {
    fontSize: 12,
    fontWeight: '500',
    color: '#707070',
  },

});

export default CategoriesScreen;
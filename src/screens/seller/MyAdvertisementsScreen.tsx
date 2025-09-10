import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import {
  fetchMyAdvertisements,
  pauseAdvertisement,
  resumeAdvertisement,
  deleteAdvertisement,
  updateAdvertisementStats,
} from '../../store/slices/advertisementSlice';
import { Advertisement } from '../../types';

interface MyAdvertisementsScreenProps {
  navigation: any;
}

const MyAdvertisementsScreen: React.FC<MyAdvertisementsScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { myAdvertisements, isLoading, error } = useSelector(
    (state: RootState) => state.advertisement
  );
  const { user } = useSelector((state: RootState) => state.auth);

  const [selectedTab, setSelectedTab] = useState<'all' | 'active' | 'paused' | 'completed'>('all');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user) {
      dispatch(fetchMyAdvertisements(user.id));
    }
  }, [dispatch, user]);

  const onRefresh = async () => {
    if (user) {
      setRefreshing(true);
      await dispatch(fetchMyAdvertisements(user.id));
      setRefreshing(false);
    }
  };

  const getFilteredAdvertisements = () => {
    let filtered = myAdvertisements;

    if (selectedTab !== 'all') {
      if (selectedTab === 'completed') {
        filtered = filtered.filter(ad => new Date(ad.endDate) < new Date());
      } else {
        filtered = filtered.filter(ad => ad.status === selectedTab);
      }
    }

    return filtered.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  };

  const getStatusColor = (ad: Advertisement) => {
    if (new Date(ad.endDate) < new Date()) return '#8E8E93';
    switch (ad.status) {
      case 'active': return '#34C759';
      case 'paused': return '#FF9500';
      default: return '#8E8E93';
    }
  };

  const getStatusText = (ad: Advertisement) => {
    if (new Date(ad.endDate) < new Date()) return 'Tamamlandı';
    switch (ad.status) {
      case 'active': return 'Aktif';
      case 'paused': return 'Duraklatıldı';
      default: return 'Bilinmiyor';
    }
  };

  const getRemainingDays = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const handlePauseResume = (ad: Advertisement) => {
    const action = ad.status === 'active' ? 'duraklat' : 'devam ettir';
    Alert.alert(
      'Reklam Durumu',
      `Bu reklamı ${action}mak istediğinizden emin misiniz?`,
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: action === 'duraklat' ? 'Duraklat' : 'Devam Ettir',
          onPress: () => {
            if (ad.status === 'active') {
              dispatch(pauseAdvertisement(ad.id));
            } else {
              dispatch(resumeAdvertisement(ad.id));
            }
          },
        },
      ]
    );
  };

  const handleDelete = (ad: Advertisement) => {
    Alert.alert(
      'Reklamı Sil',
      'Bu reklamı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: () => {
            dispatch(deleteAdvertisement(ad.id));
          },
        },
      ]
    );
  };

  const calculateCTR = (clicks: number, impressions: number) => {
    if (impressions === 0) return 0;
    return ((clicks / impressions) * 100).toFixed(2);
  };

  const renderTabButton = (tab: typeof selectedTab, title: string, count: number) => (
    <TouchableOpacity
      key={tab}
      style={[
        styles.tabButton,
        selectedTab === tab && styles.activeTabButton,
      ]}
      onPress={() => setSelectedTab(tab)}
    >
      <Text style={[
        styles.tabButtonText,
        selectedTab === tab && styles.activeTabButtonText,
      ]}>
        {title}
      </Text>
      {count > 0 && (
        <View style={styles.tabBadge}>
          <Text style={styles.tabBadgeText}>{count}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderAdvertisementItem = ({ item }: { item: Advertisement }) => {
    const isCompleted = new Date(item.endDate) < new Date();
    const remainingDays = getRemainingDays(item.endDate.toISOString());
    const ctr = calculateCTR(item.clicks, item.impressions);

    return (
      <View style={styles.adCard}>
        <View style={styles.adHeader}>
          <View style={styles.adInfo}>
            <Text style={styles.adTitle} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.adDescription} numberOfLines={2}>
              {item.description}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item) }]}>
            <Text style={styles.statusText}>{getStatusText(item)}</Text>
          </View>
        </View>

        <View style={styles.adStats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{item.impressions.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Gösterim</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{item.clicks.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Tıklama</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>%{ctr}</Text>
            <Text style={styles.statLabel}>CTR</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{item.spent.toFixed(2)} TL</Text>
            <Text style={styles.statLabel}>Harcanan</Text>
          </View>
        </View>

        <View style={styles.adProgress}>
          <View style={styles.progressInfo}>
            <Text style={styles.progressText}>
              {isCompleted ? 'Tamamlandı' : `${remainingDays} gün kaldı`}
            </Text>
            <Text style={styles.budgetText}>
              {item.spent.toFixed(2)} / {item.budget.toFixed(2)} TL
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${Math.min((item.spent / item.budget) * 100, 100)}%`,
                  backgroundColor: isCompleted ? '#8E8E93' : '#007AFF',
                },
              ]}
            />
          </View>
        </View>

        <View style={styles.adActions}>
          <TouchableOpacity
            style={styles.detailButton}
            onPress={() => navigation.navigate('AdvertisementDetail', { adId: item.id })}
          >
            <Ionicons name="analytics-outline" size={16} color="#007AFF" />
            <Text style={styles.detailButtonText}>Detay</Text>
          </TouchableOpacity>

          {!isCompleted && (
            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: item.status === 'active' ? '#FF9500' : '#34C759' },
              ]}
              onPress={() => handlePauseResume(item)}
            >
              <Ionicons
                name={item.status === 'active' ? 'pause' : 'play'}
                size={16}
                color="#FFF"
              />
              <Text style={styles.actionButtonText}>
                {item.status === 'active' ? 'Duraklat' : 'Devam Et'}
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDelete(item)}
          >
            <Ionicons name="trash-outline" size={16} color="#FFF" />
            <Text style={styles.actionButtonText}>Sil</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const filteredAds = getFilteredAdvertisements();
  const adCounts = {
    all: myAdvertisements.length,
    active: myAdvertisements.filter(ad => ad.status === 'active' && new Date(ad.endDate) >= new Date()).length,
    paused: myAdvertisements.filter(ad => ad.status === 'paused').length,
    completed: myAdvertisements.filter(ad => new Date(ad.endDate) < new Date()).length,
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFD700" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reklamlarım</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('ProductSelection')}
        >
          <Ionicons name="add" size={24} color="#FFD700" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsContainer}
        contentContainerStyle={styles.tabsContent}
      >
        {renderTabButton('all', 'Tümü', adCounts.all)}
        {renderTabButton('active', 'Aktif', adCounts.active)}
        {renderTabButton('paused', 'Duraklatıldı', adCounts.paused)}
        {renderTabButton('completed', 'Tamamlandı', adCounts.completed)}
      </ScrollView>

      {/* Advertisements List */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFD700" />
          <Text style={styles.loadingText}>Reklamlar yükleniyor...</Text>
        </View>
      ) : filteredAds.length > 0 ? (
        <FlatList
          data={filteredAds}
          renderItem={renderAdvertisementItem}
          keyExtractor={(item) => item.id}
          style={styles.adsList}
          contentContainerStyle={styles.adsContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="megaphone-outline" size={64} color="#CCC" />
          <Text style={styles.emptyTitle}>Reklam Bulunamadı</Text>
          <Text style={styles.emptyDescription}>
            {selectedTab === 'all' 
              ? 'Henüz hiç reklamınız bulunmuyor. İlk reklamınızı oluşturun!'
              : `"${selectedTab}" durumunda reklam bulunmuyor.`
            }
          </Text>
          <TouchableOpacity
            style={styles.createAdButton}
            onPress={() => navigation.navigate('ProductSelection')}
          >
            <Ionicons name="add" size={20} color="#FFF" />
            <Text style={styles.createAdButtonText}>Reklam Oluştur</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#000000',
    borderBottomWidth: 1,
    borderBottomColor: '#FFD700',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFD700',
  },
  addButton: {
    padding: 8,
  },
  tabsContainer: {
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  tabsContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  activeTabButton: {
    backgroundColor: '#FFD700',
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  activeTabButtonText: {
    color: '#000000',
  },
  tabBadge: {
    marginLeft: 6,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBadgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  adsList: {
    flex: 1,
  },
  adsContent: {
    padding: 16,
  },
  adCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  adHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  adInfo: {
    flex: 1,
    marginRight: 12,
  },
  adTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  adDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '500',
  },
  adStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F0F0F0',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  adProgress: {
    marginBottom: 12,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  progressText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  budgetText: {
    fontSize: 12,
    color: '#666',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E5E5E5',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  adActions: {
    flexDirection: 'row',
    gap: 8,
  },
  detailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#007AFF',
    gap: 4,
  },
  detailButtonText: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 4,
  },
  actionButtonText: {
    fontSize: 12,
    color: '#FFF',
    fontWeight: '500',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  separator: {
    height: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  createAdButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD700',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  createAdButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
});

export default MyAdvertisementsScreen;
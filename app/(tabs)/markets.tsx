import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  RefreshControl,
} from 'react-native';
import { 
  Search, 
  TrendingUp, 
  TrendingDown,
  Star,
  Filter 
} from 'lucide-react-native';

interface MarketData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  type: 'stock' | 'crypto' | 'forex' | 'mutual_fund';
  isWatchlist: boolean;
}

export default function MarketsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [marketData, setMarketData] = useState<MarketData[]>([
    {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      price: 175.25,
      change: 2.85,
      changePercent: 1.65,
      type: 'stock',
      isWatchlist: true,
    },
    {
      symbol: 'GOOGL',
      name: 'Alphabet Inc.',
      price: 138.50,
      change: -1.25,
      changePercent: -0.89,
      type: 'stock',
      isWatchlist: false,
    },
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      price: 42500,
      change: 1250,
      changePercent: 3.03,
      type: 'crypto',
      isWatchlist: true,
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      price: 2650,
      change: -45,
      changePercent: -1.67,
      type: 'crypto',
      isWatchlist: false,
    },
    {
      symbol: 'EUR/USD',
      name: 'Euro to Dollar',
      price: 1.0875,
      change: 0.0025,
      changePercent: 0.23,
      type: 'forex',
      isWatchlist: true,
    },
    {
      symbol: 'GBP/USD',
      name: 'British Pound to Dollar',
      price: 1.2745,
      change: -0.0015,
      changePercent: -0.12,
      type: 'forex',
      isWatchlist: false,
    },
    {
      symbol: 'HDFC_EQ',
      name: 'HDFC Equity Fund',
      price: 285.75,
      change: 3.25,
      changePercent: 1.15,
      type: 'mutual_fund',
      isWatchlist: false,
    },
    {
      symbol: 'SBI_BLUE',
      name: 'SBI Bluechip Fund',
      price: 156.80,
      change: -0.95,
      changePercent: -0.60,
      type: 'mutual_fund',
      isWatchlist: true,
    },
  ]);

  const categories = [
    { id: 'all', name: 'All' },
    { id: 'stock', name: 'Stocks' },
    { id: 'crypto', name: 'Crypto' },
    { id: 'forex', name: 'Forex' },
    { id: 'mutual_fund', name: 'Mutual Funds' },
  ];

  const filteredData = marketData.filter(item => {
    const matchesSearch = item.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.type === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setMarketData(prevData =>
        prevData.map(item => ({
          ...item,
          price: item.price * (0.98 + Math.random() * 0.04),
          change: (Math.random() - 0.5) * item.price * 0.02,
          changePercent: (Math.random() - 0.5) * 4,
        }))
      );
      setRefreshing(false);
    }, 1000);
  };

  const toggleWatchlist = (symbol: string) => {
    setMarketData(prevData =>
      prevData.map(item =>
        item.symbol === symbol ? { ...item, isWatchlist: !item.isWatchlist } : item
      )
    );
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'stock':
        return '#3B82F6';
      case 'crypto':
        return '#F59E0B';
      case 'forex':
        return '#8B5CF6';
      case 'mutual_fund':
        return '#10B981';
      default:
        return '#666';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Markets</Text>
        <TouchableOpacity>
          <Filter size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Search size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search markets..."
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryContainer}
        contentContainerStyle={styles.categoryContent}
      >
        {categories.map(category => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              selectedCategory === category.id && styles.categoryButtonActive
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Text style={[
              styles.categoryButtonText,
              selectedCategory === category.id && styles.categoryButtonTextActive
            ]}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        style={styles.marketList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredData.map((item, index) => (
          <TouchableOpacity key={index} style={styles.marketItem}>
            <View style={styles.marketItemLeft}>
              <View style={styles.symbolContainer}>
                <View style={[styles.typeIndicator, { backgroundColor: getTypeColor(item.type) }]} />
                <View>
                  <Text style={styles.symbol}>{item.symbol}</Text>
                  <Text style={styles.name}>{item.name}</Text>
                </View>
              </View>
            </View>

            <View style={styles.marketItemCenter}>
              <Text style={styles.price}>
                ${item.price.toLocaleString('en-US', { 
                  minimumFractionDigits: item.type === 'forex' ? 4 : 2, 
                  maximumFractionDigits: item.type === 'forex' ? 4 : 2 
                })}
              </Text>
              <View style={styles.changeContainer}>
                {item.change >= 0 ? (
                  <TrendingUp size={12} color="#00D4AA" />
                ) : (
                  <TrendingDown size={12} color="#FF4757" />
                )}
                <Text style={[
                  styles.change,
                  { color: item.change >= 0 ? '#00D4AA' : '#FF4757' }
                ]}>
                  {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)} ({item.changePercent >= 0 ? '+' : ''}{item.changePercent.toFixed(2)}%)
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.watchlistButton}
              onPress={() => toggleWatchlist(item.symbol)}
            >
              <Star
                size={20}
                color={item.isWatchlist ? '#F59E0B' : '#666'}
                fill={item.isWatchlist ? '#F59E0B' : 'transparent'}
              />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0B',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  searchContainer: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1B',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
  },
  categoryContainer: {
    marginBottom: 16,
  },
  categoryContent: {
    paddingHorizontal: 24,
    gap: 12,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: '#1A1A1B',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  categoryButtonActive: {
    backgroundColor: '#00D4AA',
    borderColor: '#00D4AA',
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  categoryButtonTextActive: {
    color: '#000',
  },
  marketList: {
    flex: 1,
    paddingHorizontal: 24,
  },
  marketItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1B',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  marketItemLeft: {
    flex: 1,
  },
  symbolContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  typeIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  symbol: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  name: {
    fontSize: 12,
    color: '#666',
  },
  marketItemCenter: {
    alignItems: 'flex-end',
    marginRight: 16,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  change: {
    fontSize: 12,
    fontWeight: '600',
  },
  watchlistButton: {
    padding: 4,
  },
});
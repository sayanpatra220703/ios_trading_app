import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  Search,
  ShoppingCart,
  Minus 
} from 'lucide-react-native';

interface Asset {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  type: 'stock' | 'crypto' | 'forex' | 'mutual_fund';
}

export default function TradingScreen() {
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [orderType, setOrderType] = useState<'buy' | 'sell'>('buy');
  const [quantity, setQuantity] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const assets: Asset[] = [
    {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      price: 175.25,
      change: 2.85,
      changePercent: 1.65,
      type: 'stock',
    },
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      price: 42500,
      change: 1250,
      changePercent: 3.03,
      type: 'crypto',
    },
    {
      symbol: 'EUR/USD',
      name: 'Euro to Dollar',
      price: 1.0875,
      change: 0.0025,
      changePercent: 0.23,
      type: 'forex',
    },
    {
      symbol: 'HDFC_EQ',
      name: 'HDFC Equity Fund',
      price: 285.75,
      change: 3.25,
      changePercent: 1.15,
      type: 'mutual_fund',
    },
  ];

  const filteredAssets = assets.filter(asset =>
    asset.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePlaceOrder = () => {
    if (!selectedAsset || !quantity) {
      Alert.alert('Error', 'Please select an asset and enter quantity');
      return;
    }

    const totalValue = parseFloat(quantity) * selectedAsset.price;
    
    Alert.alert(
      'Confirm Order',
      `${orderType.toUpperCase()} ${quantity} ${selectedAsset.symbol} for $${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            Alert.alert('Success', `Order placed successfully!`);
            setQuantity('');
            setSelectedAsset(null);
          },
        },
      ]
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
        <Text style={styles.title}>Trading</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Search size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search assets to trade..."
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView style={styles.assetList}>
        <Text style={styles.sectionTitle}>Available Assets</Text>
        
        {filteredAssets.map((asset, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.assetItem,
              selectedAsset?.symbol === asset.symbol && styles.assetItemSelected
            ]}
            onPress={() => setSelectedAsset(asset)}
          >
            <View style={styles.assetInfo}>
              <View style={styles.assetHeader}>
                <View style={[styles.typeIndicator, { backgroundColor: getTypeColor(asset.type) }]} />
                <Text style={styles.assetSymbol}>{asset.symbol}</Text>
              </View>
              <Text style={styles.assetName}>{asset.name}</Text>
            </View>
            
            <View style={styles.assetPrice}>
              <Text style={styles.priceText}>
                ${asset.price.toLocaleString('en-US', { 
                  minimumFractionDigits: asset.type === 'forex' ? 4 : 2, 
                  maximumFractionDigits: asset.type === 'forex' ? 4 : 2 
                })}
              </Text>
              <View style={styles.changeContainer}>
                {asset.change >= 0 ? (
                  <TrendingUp size={12} color="#00D4AA" />
                ) : (
                  <TrendingDown size={12} color="#FF4757" />
                )}
                <Text style={[
                  styles.changeText,
                  { color: asset.change >= 0 ? '#00D4AA' : '#FF4757' }
                ]}>
                  {asset.changePercent >= 0 ? '+' : ''}{asset.changePercent.toFixed(2)}%
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {selectedAsset && (
        <View style={styles.orderPanel}>
          <Text style={styles.orderTitle}>Place Order: {selectedAsset.symbol}</Text>
          
          <View style={styles.orderTypeButtons}>
            <TouchableOpacity
              style={[
                styles.orderTypeButton,
                orderType === 'buy' && styles.buyButtonActive
              ]}
              onPress={() => setOrderType('buy')}
            >
              <ShoppingCart size={20} color={orderType === 'buy' ? '#000' : '#00D4AA'} />
              <Text style={[
                styles.orderTypeText,
                orderType === 'buy' && styles.orderTypeTextActive
              ]}>
                BUY
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.orderTypeButton,
                orderType === 'sell' && styles.sellButtonActive
              ]}
              onPress={() => setOrderType('sell')}
            >
              <Minus size={20} color={orderType === 'sell' ? '#000' : '#FF4757'} />
              <Text style={[
                styles.orderTypeText,
                orderType === 'sell' && styles.orderTypeTextActive
              ]}>
                SELL
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.quantityContainer}>
            <Text style={styles.quantityLabel}>Quantity</Text>
            <TextInput
              style={styles.quantityInput}
              value={quantity}
              onChangeText={setQuantity}
              placeholder="Enter quantity"
              placeholderTextColor="#666"
              keyboardType="numeric"
            />
          </View>

          {quantity && (
            <View style={styles.orderSummary}>
              <Text style={styles.summaryText}>
                Total: ${(parseFloat(quantity) * selectedAsset.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.placeOrderButton,
              orderType === 'buy' ? styles.buyButton : styles.sellButton
            ]}
            onPress={handlePlaceOrder}
          >
            <DollarSign size={20} color="#000" />
            <Text style={styles.placeOrderText}>
              {orderType === 'buy' ? 'Place Buy Order' : 'Place Sell Order'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0B',
  },
  header: {
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
  assetList: {
    flex: 1,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  assetItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1A1A1B',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  assetItemSelected: {
    borderColor: '#00D4AA',
    backgroundColor: '#0A1A15',
  },
  assetInfo: {
    flex: 1,
  },
  assetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  typeIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  assetSymbol: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  assetName: {
    fontSize: 14,
    color: '#666',
  },
  assetPrice: {
    alignItems: 'flex-end',
  },
  priceText: {
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
  changeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  orderPanel: {
    backgroundColor: '#1A1A1B',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  orderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  orderTypeButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  orderTypeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0A0A0B',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  buyButtonActive: {
    backgroundColor: '#00D4AA',
    borderColor: '#00D4AA',
  },
  sellButtonActive: {
    backgroundColor: '#FF4757',
    borderColor: '#FF4757',
  },
  orderTypeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  orderTypeTextActive: {
    color: '#000',
  },
  quantityContainer: {
    marginBottom: 16,
  },
  quantityLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  quantityInput: {
    height: 48,
    backgroundColor: '#0A0A0B',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#333',
  },
  orderSummary: {
    backgroundColor: '#0A0A0B',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  summaryText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  placeOrderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  buyButton: {
    backgroundColor: '#00D4AA',
  },
  sellButton: {
    backgroundColor: '#FF4757',
  },
  placeOrderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
});
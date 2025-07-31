import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Eye, EyeOff, TrendingUp, TrendingDown, DollarSign, ChartBar as BarChart3, Plus } from 'lucide-react-native';

interface HoldingData {
  symbol: string;
  name: string;
  quantity: number;
  currentPrice: number;
  purchasePrice: number;
  type: 'stock' | 'crypto' | 'forex' | 'mutual_fund';
}

export default function PortfolioScreen() {
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [holdings, setHoldings] = useState<HoldingData[]>([
    {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      quantity: 10,
      currentPrice: 175.25,
      purchasePrice: 150.00,
      type: 'stock',
    },
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      quantity: 0.5,
      currentPrice: 42500,
      purchasePrice: 35000,
      type: 'crypto',
    },
    {
      symbol: 'EUR/USD',
      name: 'Euro to Dollar',
      quantity: 1000,
      currentPrice: 1.0875,
      purchasePrice: 1.0650,
      type: 'forex',
    },
    {
      symbol: 'HDFC_EQ',
      name: 'HDFC Equity Fund',
      quantity: 500,
      currentPrice: 285.75,
      purchasePrice: 265.50,
      type: 'mutual_fund',
    },
  ]);

  const totalPortfolioValue = holdings.reduce((total, holding) => {
    return total + (holding.quantity * holding.currentPrice);
  }, 0);

  const totalGainLoss = holdings.reduce((total, holding) => {
    const currentValue = holding.quantity * holding.currentPrice;
    const purchaseValue = holding.quantity * holding.purchasePrice;
    return total + (currentValue - purchaseValue);
  }, 0);

  const gainLossPercentage = (totalGainLoss / (totalPortfolioValue - totalGainLoss)) * 100;

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate price updates
    setTimeout(() => {
      setHoldings(prevHoldings =>
        prevHoldings.map(holding => ({
          ...holding,
          currentPrice: holding.currentPrice * (0.98 + Math.random() * 0.04),
        }))
      );
      setRefreshing(false);
    }, 1000);
  };

  const getHoldingGainLoss = (holding: HoldingData) => {
    const currentValue = holding.quantity * holding.currentPrice;
    const purchaseValue = holding.quantity * holding.purchasePrice;
    return currentValue - purchaseValue;
  };

  const getHoldingGainLossPercentage = (holding: HoldingData) => {
    const gainLoss = getHoldingGainLoss(holding);
    const purchaseValue = holding.quantity * holding.purchasePrice;
    return (gainLoss / purchaseValue) * 100;
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
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>Good morning</Text>
        <Text style={styles.userName}>John Doe</Text>
      </View>

      <View style={styles.portfolioCard}>
        <View style={styles.portfolioHeader}>
          <Text style={styles.portfolioLabel}>Portfolio Value</Text>
          <TouchableOpacity onPress={() => setBalanceVisible(!balanceVisible)}>
            {balanceVisible ? (
              <Eye size={20} color="#666" />
            ) : (
              <EyeOff size={20} color="#666" />
            )}
          </TouchableOpacity>
        </View>
        
        <Text style={styles.portfolioValue}>
          {balanceVisible ? `$${totalPortfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '••••••'}
        </Text>
        
        <View style={styles.gainLossContainer}>
          {totalGainLoss >= 0 ? (
            <TrendingUp size={16} color="#00D4AA" />
          ) : (
            <TrendingDown size={16} color="#FF4757" />
          )}
          <Text style={[
            styles.gainLossText,
            { color: totalGainLoss >= 0 ? '#00D4AA' : '#FF4757' }
          ]}>
            {balanceVisible ? 
              `${totalGainLoss >= 0 ? '+' : ''}$${Math.abs(totalGainLoss).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (${gainLossPercentage >= 0 ? '+' : ''}${gainLossPercentage.toFixed(2)}%)` 
              : '••••••'
            }
          </Text>
        </View>
      </View>

      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Plus size={20} color="#00D4AA" />
          <Text style={styles.actionButtonText}>Add Money</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <DollarSign size={20} color="#00D4AA" />
          <Text style={styles.actionButtonText}>Withdraw</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <BarChart3 size={20} color="#00D4AA" />
          <Text style={styles.actionButtonText}>Analytics</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Holdings</Text>
        
        {holdings.map((holding, index) => {
          const gainLoss = getHoldingGainLoss(holding);
          const gainLossPercentage = getHoldingGainLossPercentage(holding);
          
          return (
            <TouchableOpacity key={index} style={styles.holdingCard}>
              <View style={styles.holdingHeader}>
                <View style={styles.holdingInfo}>
                  <View style={styles.holdingSymbolContainer}>
                    <View style={[styles.typeIndicator, { backgroundColor: getTypeColor(holding.type) }]} />
                    <Text style={styles.holdingSymbol}>{holding.symbol}</Text>
                  </View>
                  <Text style={styles.holdingName}>{holding.name}</Text>
                </View>
                <View style={styles.holdingValues}>
                  <Text style={styles.holdingPrice}>
                    ${holding.currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </Text>
                  <View style={styles.holdingGainLoss}>
                    <Text style={[
                      styles.holdingGainLossText,
                      { color: gainLoss >= 0 ? '#00D4AA' : '#FF4757' }
                    ]}>
                      {gainLoss >= 0 ? '+' : ''}${Math.abs(gainLoss).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </Text>
                    <Text style={[
                      styles.holdingGainLossPercentage,
                      { color: gainLoss >= 0 ? '#00D4AA' : '#FF4757' }
                    ]}>
                      ({gainLossPercentage >= 0 ? '+' : ''}{gainLossPercentage.toFixed(2)}%)
                    </Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.holdingDetails}>
                <Text style={styles.holdingQuantity}>
                  Qty: {holding.quantity.toLocaleString()}
                </Text>
                <Text style={styles.holdingValue}>
                  Value: ${(holding.quantity * holding.currentPrice).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
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
  greeting: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  portfolioCard: {
    margin: 24,
    marginTop: 0,
    padding: 24,
    backgroundColor: '#1A1A1B',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  portfolioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  portfolioLabel: {
    fontSize: 16,
    color: '#666',
  },
  portfolioValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  gainLossContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  gainLossText: {
    fontSize: 16,
    fontWeight: '600',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1A1A1B',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginHorizontal: 4,
    gap: 8,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    padding: 24,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  holdingCard: {
    backgroundColor: '#1A1A1B',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  holdingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  holdingInfo: {
    flex: 1,
  },
  holdingSymbolContainer: {
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
  holdingSymbol: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  holdingName: {
    fontSize: 14,
    color: '#666',
  },
  holdingValues: {
    alignItems: 'flex-end',
  },
  holdingPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  holdingGainLoss: {
    alignItems: 'flex-end',
  },
  holdingGainLossText: {
    fontSize: 14,
    fontWeight: '600',
  },
  holdingGainLossPercentage: {
    fontSize: 12,
  },
  holdingDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  holdingQuantity: {
    fontSize: 14,
    color: '#666',
  },
  holdingValue: {
    fontSize: 14,
    color: '#666',
  },
});
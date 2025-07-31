import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { 
  Plus, 
  Calendar, 
  DollarSign,
  TrendingUp,
  Settings,
  Pause,
  Play,
  X 
} from 'lucide-react-native';

interface SIPPlan {
  id: string;
  fundName: string;
  amount: number;
  frequency: 'monthly' | 'quarterly' | 'yearly';
  startDate: string;
  status: 'active' | 'paused';
  totalInvested: number;
  currentValue: number;
  returns: number;
}

interface MutualFund {
  symbol: string;
  name: string;
  nav: number;
  returns1Y: number;
  category: string;
}

export default function SIPScreen() {
  const [sipPlans, setSipPlans] = useState<SIPPlan[]>([
    {
      id: '1',
      fundName: 'HDFC Equity Fund',
      amount: 5000,
      frequency: 'monthly',
      startDate: '2024-01-15',
      status: 'active',
      totalInvested: 15000,
      currentValue: 16250,
      returns: 8.33,
    },
    {
      id: '2',
      fundName: 'SBI Bluechip Fund',
      amount: 3000,
      frequency: 'monthly',
      startDate: '2023-06-10',
      status: 'active',
      totalInvested: 21000,
      currentValue: 23500,
      returns: 11.90,
    },
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedFund, setSelectedFund] = useState<MutualFund | null>(null);
  const [newSIPData, setNewSIPData] = useState({
    amount: '',
    frequency: 'monthly' as 'monthly' | 'quarterly' | 'yearly',
    startDate: new Date().toISOString().split('T')[0],
  });

  const mutualFunds: MutualFund[] = [
    {
      symbol: 'HDFC_EQ',
      name: 'HDFC Equity Fund',
      nav: 285.75,
      returns1Y: 15.2,
      category: 'Large Cap',
    },
    {
      symbol: 'SBI_BLUE',
      name: 'SBI Bluechip Fund',
      nav: 156.80,
      returns1Y: 12.8,
      category: 'Large Cap',
    },
    {
      symbol: 'AXIS_MID',
      name: 'Axis Midcap Fund',
      nav: 98.45,
      returns1Y: 18.5,
      category: 'Mid Cap',
    },
    {
      symbol: 'ICICI_FLEX',
      name: 'ICICI Prudential Flexicap Fund',
      nav: 234.60,
      returns1Y: 14.7,
      category: 'Flexi Cap',
    },
  ];

  const totalSIPInvestment = sipPlans.reduce((total, plan) => total + plan.totalInvested, 0);
  const totalCurrentValue = sipPlans.reduce((total, plan) => total + plan.currentValue, 0);
  const totalReturns = totalCurrentValue - totalSIPInvestment;
  const totalReturnsPercentage = (totalReturns / totalSIPInvestment) * 100;

  const handleCreateSIP = () => {
    if (!selectedFund || !newSIPData.amount) {
      Alert.alert('Error', 'Please select a fund and enter amount');
      return;
    }

    const newSIP: SIPPlan = {
      id: Date.now().toString(),
      fundName: selectedFund.name,
      amount: parseFloat(newSIPData.amount),
      frequency: newSIPData.frequency,
      startDate: newSIPData.startDate,
      status: 'active',
      totalInvested: 0,
      currentValue: 0,
      returns: 0,
    };

    setSipPlans([...sipPlans, newSIP]);
    setShowCreateModal(false);
    setSelectedFund(null);
    setNewSIPData({
      amount: '',
      frequency: 'monthly',
      startDate: new Date().toISOString().split('T')[0],
    });

    Alert.alert('Success', 'SIP plan created successfully!');
  };

  const toggleSIPStatus = (id: string) => {
    setSipPlans(prevPlans =>
      prevPlans.map(plan =>
        plan.id === id
          ? { ...plan, status: plan.status === 'active' ? 'paused' : 'active' }
          : plan
      )
    );
  };

  const getFrequencyText = (frequency: string) => {
    switch (frequency) {
      case 'monthly':
        return 'Monthly';
      case 'quarterly':
        return 'Quarterly';
      case 'yearly':
        return 'Yearly';
      default:
        return frequency;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>SIP Investments</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowCreateModal(true)}
        >
          <Plus size={20} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Total SIP Portfolio</Text>
          <Text style={styles.summaryValue}>
            ${totalCurrentValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Text>
          <View style={styles.summaryDetails}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Invested</Text>
              <Text style={styles.summaryAmount}>
                ${totalSIPInvestment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Returns</Text>
              <Text style={[
                styles.summaryAmount,
                { color: totalReturns >= 0 ? '#00D4AA' : '#FF4757' }
              ]}>
                {totalReturns >= 0 ? '+' : ''}${Math.abs(totalReturns).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({totalReturnsPercentage >= 0 ? '+' : ''}{totalReturnsPercentage.toFixed(2)}%)
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Active SIP Plans</Text>
          
          {sipPlans.map(plan => (
            <View key={plan.id} style={styles.sipCard}>
              <View style={styles.sipHeader}>
                <View style={styles.sipInfo}>
                  <Text style={styles.sipFundName}>{plan.fundName}</Text>
                  <Text style={styles.sipAmount}>
                    ${plan.amount.toLocaleString()} / {getFrequencyText(plan.frequency)}
                  </Text>
                </View>
                <View style={styles.sipActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => toggleSIPStatus(plan.id)}
                  >
                    {plan.status === 'active' ? (
                      <Pause size={16} color="#666" />
                    ) : (
                      <Play size={16} color="#00D4AA" />
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <Settings size={16} color="#666" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.sipDetails}>
                <View style={styles.sipStat}>
                  <Text style={styles.statLabel}>Invested</Text>
                  <Text style={styles.statValue}>
                    ${plan.totalInvested.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </Text>
                </View>
                <View style={styles.sipStat}>
                  <Text style={styles.statLabel}>Current Value</Text>
                  <Text style={styles.statValue}>
                    ${plan.currentValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </Text>
                </View>
                <View style={styles.sipStat}>
                  <Text style={styles.statLabel}>Returns</Text>
                  <Text style={[
                    styles.statValue,
                    { color: plan.returns >= 0 ? '#00D4AA' : '#FF4757' }
                  ]}>
                    {plan.returns >= 0 ? '+' : ''}{plan.returns.toFixed(2)}%
                  </Text>
                </View>
              </View>

              <View style={styles.sipStatus}>
                <View style={[
                  styles.statusIndicator,
                  { backgroundColor: plan.status === 'active' ? '#00D4AA' : '#F59E0B' }
                ]} />
                <Text style={styles.statusText}>
                  {plan.status === 'active' ? 'Active' : 'Paused'}
                </Text>
                <Text style={styles.startDate}>
                  Started: {new Date(plan.startDate).toLocaleDateString()}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <Modal
        visible={showCreateModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCreateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create New SIP</Text>
              <TouchableOpacity onPress={() => setShowCreateModal(false)}>
                <X size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={styles.sectionTitle}>Select Mutual Fund</Text>
              {mutualFunds.map((fund, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.fundOption,
                    selectedFund?.symbol === fund.symbol && styles.fundOptionSelected
                  ]}
                  onPress={() => setSelectedFund(fund)}
                >
                  <View style={styles.fundInfo}>
                    <Text style={styles.fundName}>{fund.name}</Text>
                    <Text style={styles.fundCategory}>{fund.category}</Text>
                  </View>
                  <View style={styles.fundStats}>
                    <Text style={styles.fundNav}>NAV: ${fund.nav}</Text>
                    <Text style={[
                      styles.fundReturns,
                      { color: fund.returns1Y >= 0 ? '#00D4AA' : '#FF4757' }
                    ]}>
                      1Y: {fund.returns1Y >= 0 ? '+' : ''}{fund.returns1Y.toFixed(1)}%
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}

              {selectedFund && (
                <>
                  <Text style={styles.sectionTitle}>SIP Details</Text>
                  
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Monthly Amount ($)</Text>
                    <TextInput
                      style={styles.input}
                      value={newSIPData.amount}
                      onChangeText={(text) => setNewSIPData({ ...newSIPData, amount: text })}
                      placeholder="Enter amount"
                      placeholderTextColor="#666"
                      keyboardType="numeric"
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Frequency</Text>
                    <View style={styles.frequencyButtons}>
                      {(['monthly', 'quarterly', 'yearly'] as const).map(freq => (
                        <TouchableOpacity
                          key={freq}
                          style={[
                            styles.frequencyButton,
                            newSIPData.frequency === freq && styles.frequencyButtonActive
                          ]}
                          onPress={() => setNewSIPData({ ...newSIPData, frequency: freq })}
                        >
                          <Text style={[
                            styles.frequencyButtonText,
                            newSIPData.frequency === freq && styles.frequencyButtonTextActive
                          ]}>
                            {getFrequencyText(freq)}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.createButton}
                    onPress={handleCreateSIP}
                  >
                    <Calendar size={20} color="#000" />
                    <Text style={styles.createButtonText}>Create SIP</Text>
                  </TouchableOpacity>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  addButton: {
    width: 40,
    height: 40,
    backgroundColor: '#00D4AA',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  summaryCard: {
    backgroundColor: '#1A1A1B',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#333',
  },
  summaryTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  summaryDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  summaryAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  sipCard: {
    backgroundColor: '#1A1A1B',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  sipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  sipInfo: {
    flex: 1,
  },
  sipFundName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  sipAmount: {
    fontSize: 14,
    color: '#00D4AA',
    fontWeight: '600',
  },
  sipActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    backgroundColor: '#0A0A0B',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sipDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  sipStat: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  sipStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  startDate: {
    fontSize: 12,
    color: '#666',
    marginLeft: 'auto',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1A1A1B',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  modalBody: {
    padding: 24,
  },
  fundOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0A0A0B',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  fundOptionSelected: {
    borderColor: '#00D4AA',
    backgroundColor: '#0A1A15',
  },
  fundInfo: {
    flex: 1,
  },
  fundName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  fundCategory: {
    fontSize: 14,
    color: '#666',
  },
  fundStats: {
    alignItems: 'flex-end',
  },
  fundNav: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  fundReturns: {
    fontSize: 12,
    fontWeight: '600',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  input: {
    height: 48,
    backgroundColor: '#0A0A0B',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#333',
  },
  frequencyButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  frequencyButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#0A0A0B',
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  frequencyButtonActive: {
    backgroundColor: '#00D4AA',
    borderColor: '#00D4AA',
  },
  frequencyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  frequencyButtonTextActive: {
    color: '#000',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00D4AA',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    marginTop: 16,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
});
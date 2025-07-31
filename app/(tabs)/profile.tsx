import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { router } from 'expo-router';
import { User, Settings, Shield, Bell, CircleHelp as HelpCircle, LogOut, ChevronRight, Moon, Globe, CreditCard } from 'lucide-react-native';

export default function ProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(true);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  const profileData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    kycStatus: 'Verified',
    accountType: 'Premium',
  };

  const menuItems = [
    {
      title: 'Account Settings',
      icon: User,
      onPress: () => Alert.alert('Coming Soon', 'Account settings feature coming soon!'),
    },
    {
      title: 'Security & Privacy',
      icon: Shield,
      onPress: () => Alert.alert('Coming Soon', 'Security settings feature coming soon!'),
    },
    {
      title: 'Payment Methods',
      icon: CreditCard,
      onPress: () => Alert.alert('Coming Soon', 'Payment methods feature coming soon!'),
    },
    {
      title: 'Language & Region',
      icon: Globe,
      onPress: () => Alert.alert('Coming Soon', 'Language settings feature coming soon!'),
    },
    {
      title: 'Help & Support',
      icon: HelpCircle,
      onPress: () => Alert.alert('Coming Soon', 'Help & support feature coming soon!'),
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      <View style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <User size={32} color="#FFFFFF" />
          </View>
          <View style={styles.kycBadge}>
            <Text style={styles.kycText}>KYC</Text>
          </View>
        </View>
        
        <View style={styles.profileInfo}>
          <Text style={styles.name}>{profileData.name}</Text>
          <Text style={styles.email}>{profileData.email}</Text>
          <Text style={styles.phone}>{profileData.phone}</Text>
          <View style={styles.statusContainer}>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{profileData.accountType}</Text>
            </View>
            <View style={[
              styles.kycStatusBadge,
              { backgroundColor: profileData.kycStatus === 'Verified' ? '#00D4AA' : '#F59E0B' }
            ]}>
              <Text style={styles.kycStatusText}>{profileData.kycStatus}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        
        <View style={styles.preferenceItem}>
          <View style={styles.preferenceLeft}>
            <Bell size={20} color="#FFFFFF" />
            <Text style={styles.preferenceText}>Push Notifications</Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: '#333', true: '#00D4AA' }}
            thumbColor={notificationsEnabled ? '#FFFFFF' : '#666'}
          />
        </View>

        <View style={styles.preferenceItem}>
          <View style={styles.preferenceLeft}>
            <Moon size={20} color="#FFFFFF" />
            <Text style={styles.preferenceText}>Dark Mode</Text>
          </View>
          <Switch
            value={darkModeEnabled}
            onValueChange={setDarkModeEnabled}
            trackColor={{ false: '#333', true: '#00D4AA' }}
            thumbColor={darkModeEnabled ? '#FFFFFF' : '#666'}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={item.onPress}
          >
            <View style={styles.menuItemLeft}>
              <item.icon size={20} color="#FFFFFF" />
              <Text style={styles.menuItemText}>{item.title}</Text>
            </View>
            <ChevronRight size={20} color="#666" />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color="#FF4757" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>TradeMax Pro v1.0.0</Text>
        <Text style={styles.footerSubtext}>
          Securities trading is subject to market risks. Please read all terms and conditions carefully.
        </Text>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  profileCard: {
    margin: 24,
    marginTop: 0,
    padding: 24,
    backgroundColor: '#1A1A1B',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#333',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    backgroundColor: '#333',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  kycBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: '#00D4AA',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  kycText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000',
  },
  profileInfo: {
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginBottom: 2,
  },
  phone: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  statusContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  statusBadge: {
    backgroundColor: '#8B5CF6',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  kycStatusBadge: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  kycStatusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
  },
  section: {
    margin: 24,
    marginTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  preferenceItem: {
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
  preferenceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  preferenceText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  menuItem: {
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
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuItemText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1A1A1B',
    borderRadius: 12,
    padding: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: '#FF4757',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF4757',
  },
  footer: {
    padding: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  footerSubtext: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 16,
  },
});
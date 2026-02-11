import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';

import SignupScreen from './src/screens/SignupScreen';
import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import MainTradingScreen from './src/screens/MainTradingScreen';
import WalletScreen from './src/screens/WalletScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SupportScreen from './src/screens/SupportScreen';
import CopyTradeScreen from './src/screens/CopyTradeScreen';
import IBScreen from './src/screens/IBScreen';
import AccountsScreen from './src/screens/AccountsScreen';
import OrderBookScreen from './src/screens/OrderBookScreen';
import InstructionsScreen from './src/screens/InstructionsScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import ChallengeRulesScreen from './src/screens/ChallengeRulesScreen';
import BuyChallengeScreen from './src/screens/BuyChallengeScreen';
import ForceUpdateScreen from './src/screens/ForceUpdateScreen';
import { API_URL } from './src/config';
import Constants from 'expo-constants';

const Stack = createNativeStackNavigator();

// Inner app component that can use theme
const AppContent = () => {
  const { colors, isDark } = useTheme();
  
  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.bgPrimary }
        }}
      >
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="MainTrading" component={MainTradingScreen} />
        <Stack.Screen name="Wallet" component={WalletScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Support" component={SupportScreen} />
        <Stack.Screen name="CopyTrade" component={CopyTradeScreen} />
        <Stack.Screen name="IB" component={IBScreen} />
        <Stack.Screen name="Accounts" component={AccountsScreen} />
        <Stack.Screen name="OrderBook" component={OrderBookScreen} />
        <Stack.Screen name="Instructions" component={InstructionsScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="ChallengeRules" component={ChallengeRulesScreen} />
        <Stack.Screen name="BuyChallenge" component={BuyChallengeScreen} />
      </Stack.Navigator>
    </>
  );
};

const APP_VERSION = Constants.expoConfig?.version || '2.0.0';

const compareVersions = (v1, v2) => {
  const parts1 = v1.split('.').map(Number);
  const parts2 = v2.split('.').map(Number);
  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const a = parts1[i] || 0;
    const b = parts2[i] || 0;
    if (a < b) return -1;
    if (a > b) return 1;
  }
  return 0;
};

export default function App() {
  const [needsUpdate, setNeedsUpdate] = useState(false);
  const [updateUrl, setUpdateUrl] = useState('');
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    checkAppVersion();
  }, []);

  const checkAppVersion = async () => {
    try {
      const res = await fetch(`${API_URL}/app-version`);
      const data = await res.json();
      if (data.success && data.forceUpdate && data.minVersion) {
        if (compareVersions(APP_VERSION, data.minVersion) < 0) {
          setNeedsUpdate(true);
          setUpdateUrl(data.updateUrl || '');
        }
      }
    } catch (e) {
      // If version check fails, allow app to continue
      console.log('Version check failed:', e.message);
    }
    setChecking(false);
  };

  if (checking) {
    return (
      <View style={{ flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#dc2626" />
      </View>
    );
  }

  if (needsUpdate) {
    return <ForceUpdateScreen updateUrl={updateUrl} />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#000000' }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AuthProvider>
            <NavigationContainer
            theme={{
              dark: true,
              colors: {
                primary: '#d4af37',
                background: '#000000',
                card: '#000000',
                text: '#ffffff',
                border: '#1a1a1a',
                notification: '#d4af37',
              },
              fonts: {
                regular: { fontFamily: 'System', fontWeight: '400' },
                medium: { fontFamily: 'System', fontWeight: '500' },
                bold: { fontFamily: 'System', fontWeight: '700' },
                heavy: { fontFamily: 'System', fontWeight: '900' },
              },
            }}
          >
            <AppContent />
            </NavigationContainer>
          </AuthProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

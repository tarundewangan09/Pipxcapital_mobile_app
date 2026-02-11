import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ForceUpdateScreen = ({ updateUrl }) => {
  const handleUpdate = () => {
    if (updateUrl) {
      Linking.openURL(updateUrl);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image 
          source={require('../../assets/pipX logo.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
        
        <View style={styles.iconContainer}>
          <Ionicons name="cloud-download-outline" size={64} color="#dc2626" />
        </View>
        
        <Text style={styles.title}>Update Required</Text>
        <Text style={styles.subtitle}>
          A new version of PipXcapital is available. Please update to continue using the app.
        </Text>

        <TouchableOpacity style={styles.updateBtn} onPress={handleUpdate}>
          <Ionicons name="download-outline" size={20} color="#fff" />
          <Text style={styles.updateBtnText}>Download Update</Text>
        </TouchableOpacity>

        <Text style={styles.note}>
          Your current version is outdated and no longer supported.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  content: {
    alignItems: 'center',
    maxWidth: 320,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 20,
    marginBottom: 24,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#dc262620',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    color: '#999',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  updateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#dc2626',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 12,
    width: '100%',
    marginBottom: 20,
  },
  updateBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  note: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
  },
});

export default ForceUpdateScreen;

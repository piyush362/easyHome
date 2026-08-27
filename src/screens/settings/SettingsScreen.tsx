import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, StatusBar} from 'react-native';
import type {RootStackScreenProps} from '../../navigation/types';
import {useAppSelector} from '../../store';

export default function SettingsScreen({
  navigation,
}: RootStackScreenProps<'Settings'>) {
  const settings = useAppSelector(state => state.settings.appearance);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.emoji}>⚙️</Text>
        <Text style={styles.mainText}>Settings & Personalization</Text>
        <Text style={styles.subText}>
          Theme: {settings.theme} • Text: {settings.textSize} • Icons:{' '}
          {settings.iconSize}
        </Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Coming in Phase 11 & 14</Text>
        </View>

        <TouchableOpacity
          style={styles.showcaseButton}
          onPress={() => navigation.navigate('ComponentShowcase')}
          activeOpacity={0.8}>
          <Text style={styles.showcaseButtonText}>
            🎨 Open Design System Showcase →
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    paddingVertical: 8,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  backText: {
    fontSize: 16,
    color: '#4A90D9',
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A2E',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  mainText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 8,
    textAlign: 'center',
  },
  subText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  badge: {
    backgroundColor: '#EBF5FF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  badgeText: {
    color: '#4A90D9',
    fontWeight: '600',
    fontSize: 14,
  },
  showcaseButton: {
    marginTop: 24,
    backgroundColor: '#0284C7',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 14,
    alignItems: 'center',
    width: '100%',
  },
  showcaseButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

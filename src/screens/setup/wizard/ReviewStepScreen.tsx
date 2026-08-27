import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, StatusBar} from 'react-native';
import type {FamilySetupScreenProps} from '../../../navigation/types';

export default function ReviewStepScreen({
  navigation,
}: FamilySetupScreenProps<'Review'>) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.content}>
        <Text style={styles.emoji}>📋</Text>
        <Text style={styles.title}>Review Setup</Text>
        <Text style={styles.subtitle}>Step 8 of 8: Confirm Configuration</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Review Summary Coming in Phase 10</Text>
        </View>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}>
          <Text style={styles.secondaryButtonText}>← Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate('Complete')}
          activeOpacity={0.8}>
          <Text style={styles.primaryButtonText}>Finish Setup ✓</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    justifyContent: 'space-between',
    padding: 24,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {fontSize: 56, marginBottom: 12},
  title: {fontSize: 28, fontWeight: '700', color: '#1A1A2E', marginBottom: 8},
  subtitle: {fontSize: 16, color: '#6B7280', marginBottom: 16},
  badge: {
    backgroundColor: '#EBF5FF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  badgeText: {color: '#4A90D9', fontWeight: '600', fontSize: 14},
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 16,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#4A90D9',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  primaryButtonText: {color: '#FFFFFF', fontSize: 16, fontWeight: '600'},
  secondaryButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
  },
  secondaryButtonText: {color: '#4B5563', fontSize: 16, fontWeight: '600'},
});

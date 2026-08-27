import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, StatusBar} from 'react-native';
import type {FamilySetupScreenProps} from '../../../navigation/types';

export default function WelcomeStepScreen({
  navigation,
}: FamilySetupScreenProps<'Welcome'>) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.content}>
        <Text style={styles.emoji}>🧙‍♂️</Text>
        <Text style={styles.title}>Family Setup</Text>
        <Text style={styles.subtitle}>
          Set up and customize your parent's phone in a few simple steps.
        </Text>

        <View style={styles.stepBadge}>
          <Text style={styles.stepBadgeText}>Step 1 of 8: Welcome</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>What we will configure:</Text>
          <Text style={styles.infoItem}>• Parent's name & photo</Text>
          <Text style={styles.infoItem}>• Favorite family contacts</Text>
          <Text style={styles.infoItem}>• Key apps on home screen</Text>
          <Text style={styles.infoItem}>• Visual themes and large text</Text>
          <Text style={styles.infoItem}>• Medicine & daily reminders</Text>
          <Text style={styles.infoItem}>• Emergency SOS & PIN protection</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate('ParentProfile')}
          activeOpacity={0.8}>
          <Text style={styles.primaryButtonText}>Get Started →</Text>
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
  emoji: {
    fontSize: 56,
    marginBottom: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  stepBadge: {
    backgroundColor: '#EBF5FF',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginBottom: 24,
  },
  stepBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A90D9',
  },
  infoBox: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 12,
  },
  infoItem: {
    fontSize: 15,
    color: '#4B5563',
    marginBottom: 6,
  },
  footer: {
    paddingTop: 16,
  },
  primaryButton: {
    backgroundColor: '#4A90D9',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, StatusBar} from 'react-native';
import type {FamilySetupScreenProps} from '../../../navigation/types';
import {useAppDispatch, setSetupCompleted} from '../../../store';

export default function CompleteStepScreen({
  navigation,
}: FamilySetupScreenProps<'Complete'>) {
  const dispatch = useAppDispatch();

  const handleFinish = () => {
    dispatch(setSetupCompleted(true));
    navigation.replace('Home');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.content}>
        <Text style={styles.emoji}>🎉</Text>
        <Text style={styles.title}>All Set!</Text>
        <Text style={styles.subtitle}>
          EasyHome is customized and ready for your parent to use.
        </Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Setup Complete</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleFinish}
          activeOpacity={0.8}>
          <Text style={styles.primaryButtonText}>Go to Home 🏠</Text>
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
  emoji: {fontSize: 64, marginBottom: 16},
  title: {fontSize: 32, fontWeight: '700', color: '#1A1A2E', marginBottom: 8},
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  badge: {
    backgroundColor: '#E8F5E9',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  badgeText: {color: '#2E7D32', fontWeight: '600', fontSize: 14},
  footer: {paddingTop: 16},
  primaryButton: {
    backgroundColor: '#4A90D9',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  primaryButtonText: {color: '#FFFFFF', fontSize: 18, fontWeight: '600'},
});

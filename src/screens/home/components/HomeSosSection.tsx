import React from 'react';
import {View, StyleSheet} from 'react-native';
import {ShieldAlert} from 'lucide-react-native';
import {EHText, EHCard, EHButton} from '../../../components';

export interface HomeSosSectionProps {
  onSosPress: () => void;
}

export function HomeSosSection({onSosPress}: HomeSosSectionProps) {
  return (
    <EHCard style={styles.frostedContainer} elevation="low">
      {/* Frosted Container Header */}
      <View style={styles.headerRow}>
        <EHText variant="heading2" weight="700">
          Emergency & Safety
        </EHText>
      </View>

      <EHButton
        label="EMERGENCY HELP / SOS"
        icon={<ShieldAlert size={24} color="#FFFFFF" />}
        variant="danger"
        onPress={onSosPress}
        style={styles.sosButton}
      />
    </EHCard>
  );
}

const styles = StyleSheet.create({
  frostedContainer: {
    padding: 16,
    borderRadius: 20,
    marginVertical: 6,
  },
  headerRow: {
    marginBottom: 12,
    paddingHorizontal: 2,
  },
  sosButton: {
    minHeight: 64,
  },
});

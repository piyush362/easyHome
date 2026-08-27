import React from 'react';
import {StyleSheet} from 'react-native';
import {ShieldAlert} from 'lucide-react-native';
import {EHButton, EHSection} from '../../../components';

export interface HomeSosSectionProps {
  onSosPress: () => void;
}

export function HomeSosSection({onSosPress}: HomeSosSectionProps) {
  return (
    <EHSection title="Safety & Support">
      <EHButton
        label="EMERGENCY HELP / SOS"
        icon={<ShieldAlert size={22} color="#FFFFFF" />}
        variant="danger"
        onPress={onSosPress}
        style={styles.sosButton}
      />
    </EHSection>
  );
}

const styles = StyleSheet.create({
  sosButton: {
    minHeight: 64,
  },
});

import React from 'react';
import {View, StyleSheet} from 'react-native';
import {ShieldAlert, Lock, ArrowRight, ArrowLeft} from 'lucide-react-native';
import type {FamilySetupScreenProps} from '../../../navigation/types';
import {useTheme} from '../../../theme';
import {
  ScreenWrapper,
  HeaderNavigation,
  EHText,
  EHCard,
  EHButton,
} from '../../../components';

export default function SafetyStepScreen({
  navigation,
}: FamilySetupScreenProps<'Safety'>) {
  const {colors, spacing} = useTheme();

  return (
    <ScreenWrapper
      headerComponent={
        <HeaderNavigation
          label="Safety & Security"
          subtitle="Step 7 of 8: Protection & SOS"
          onBack={() => navigation.goBack()}
        />
      }>
      <View style={[styles.container, {padding: spacing.md}]}>
        <EHCard style={styles.card} elevation="low">
          <View style={styles.cardHeader}>
            <ShieldAlert size={28} color={colors.primary} />
            <EHText variant="heading2" weight="700">
              Emergency SOS & Settings PIN
            </EHText>
          </View>
          <EHText variant="body" color={colors.textSecondary}>
            Configure 1-tap SOS calls, emergency location broadcast, and prevent
            accidental settings changes with a 4-digit family PIN.
          </EHText>
        </EHCard>

        {/* Action buttons */}
        <View style={styles.btnRow}>
          <EHButton
            label="Back"
            icon={<ArrowLeft size={18} color={colors.textPrimary} />}
            variant="outline"
            onPress={() => navigation.goBack()}
            style={styles.halfBtn}
          />
          <EHButton
            label="Next: Review"
            icon={<ArrowRight size={18} color="#FFFFFF" />}
            variant="primary"
            onPress={() => navigation.navigate('Review')}
            style={styles.halfBtn}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  card: {
    padding: 20,
    gap: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  halfBtn: {
    flex: 1,
    minHeight: 56,
  },
});

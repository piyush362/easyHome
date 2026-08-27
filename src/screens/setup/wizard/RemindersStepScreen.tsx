import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Pill, Clock, ArrowRight, ArrowLeft} from 'lucide-react-native';
import type {FamilySetupScreenProps} from '../../../navigation/types';
import {useTheme} from '../../../theme';
import {useAppSelector} from '../../../store';
import {
  ScreenWrapper,
  HeaderNavigation,
  EHText,
  EHCard,
  EHButton,
} from '../../../components';

export default function RemindersStepScreen({
  navigation,
}: FamilySetupScreenProps<'Reminders'>) {
  const {colors, spacing} = useTheme();
  const reminders = useAppSelector(state => state.reminders.reminders);

  return (
    <ScreenWrapper
      headerComponent={
        <HeaderNavigation
          label="Daily Reminders"
          subtitle="Step 6 of 8: Medicine & Alerts"
          onBack={() => navigation.goBack()}
        />
      }>
      <View style={[styles.container, {padding: spacing.md}]}>
        <EHCard style={styles.card} elevation="low">
          <EHText variant="heading2" weight="700">
            Active Reminders ({reminders.length})
          </EHText>

          {reminders.length === 0 ? (
            <View style={styles.emptyState}>
              <EHText variant="body" color={colors.textSecondary} align="center">
                No reminders scheduled yet. You can add medicines and alerts in Settings anytime.
              </EHText>
            </View>
          ) : (
            reminders.map(rem => (
              <View key={rem.id} style={styles.reminderRow}>
                <View
                  style={[
                    styles.iconBox,
                    {backgroundColor: colors.primaryLight},
                  ]}>
                  <Clock size={20} color={colors.primary} />
                </View>
                <View style={styles.reminderInfo}>
                  <EHText variant="body" weight="700">
                    {rem.title}
                  </EHText>
                  <EHText variant="caption" color={colors.textSecondary}>
                    {rem.time} • {rem.description || 'Scheduled reminder'}
                  </EHText>
                </View>
              </View>
            ))
          )}
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
            label="Next: Safety"
            icon={<ArrowRight size={18} color="#FFFFFF" />}
            variant="primary"
            onPress={() => navigation.navigate('Safety')}
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
    padding: 18,
    gap: 14,
  },
  emptyState: {
    paddingVertical: 12,
  },
  reminderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reminderInfo: {
    flex: 1,
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

import React from 'react';
import {View, StyleSheet} from 'react-native';
import {CheckCircle2, ArrowRight, ArrowLeft} from 'lucide-react-native';
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

export default function ReviewStepScreen({
  navigation,
}: FamilySetupScreenProps<'Review'>) {
  const {colors, spacing} = useTheme();
  const parent = useAppSelector(state => state.parent.profile);
  const familyCount = useAppSelector(state => state.family.members.length);
  const remindersCount = useAppSelector(state => state.reminders.reminders.length);
  const theme = useAppSelector(state => state.settings.appearance.theme);

  return (
    <ScreenWrapper
      headerComponent={
        <HeaderNavigation
          label="Review Setup"
          subtitle="Step 8 of 8: Verification"
          onBack={() => navigation.goBack()}
        />
      }>
      <View style={[styles.container, {padding: spacing.md}]}>
        <EHCard style={styles.card} elevation="low">
          <EHText variant="heading2" weight="700">
            Configuration Summary
          </EHText>
          <EHText variant="body">
            • Parent: {parent?.name || 'Grandma Mary'}
          </EHText>
          <EHText variant="body">
            • Family Contacts: {familyCount} members
          </EHText>
          <EHText variant="body">
            • Active Reminders: {remindersCount} reminders
          </EHText>
          <EHText variant="body">
            • Active Theme: {theme.toUpperCase()}
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
            label="Finish Setup"
            icon={<CheckCircle2 size={18} color="#FFFFFF" />}
            variant="primary"
            onPress={() => navigation.navigate('Complete')}
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

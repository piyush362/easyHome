import React from 'react';
import {View, StyleSheet} from 'react-native';
import {LayoutGrid, ArrowRight, ArrowLeft, Check} from 'lucide-react-native';
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

export default function ImportantAppsStepScreen({
  navigation,
}: FamilySetupScreenProps<'ImportantApps'>) {
  const {colors, spacing} = useTheme();
  const installedApps = useAppSelector(state => state.apps.installedApps);

  return (
    <ScreenWrapper
      headerComponent={
        <HeaderNavigation
          label="Important Apps"
          subtitle="Step 4 of 8: Quick Access Apps"
          onBack={() => navigation.goBack()}
        />
      }>
      <View style={[styles.container, {padding: spacing.md}]}>
        <EHCard style={styles.infoCard} elevation="low">
          <View style={styles.cardHeader}>
            <LayoutGrid size={28} color={colors.primary} />
            <EHText variant="heading2" weight="700">
              Apps Ready for Quick Access
            </EHText>
          </View>
          <EHText variant="body" color={colors.textSecondary}>
            {installedApps.length > 0
              ? `${installedApps.length} apps discovered and available on device.`
              : 'All installed applications will be accessible from the App Drawer.'}
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
            label="Next: Theme"
            icon={<ArrowRight size={18} color="#FFFFFF" />}
            variant="primary"
            onPress={() => navigation.navigate('Appearance')}
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
  infoCard: {
    padding: 20,
    gap: 10,
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

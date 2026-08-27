import React from 'react';
import {View, StyleSheet} from 'react-native';
import {User, ArrowRight, ArrowLeft} from 'lucide-react-native';
import type {FamilySetupScreenProps} from '../../../navigation/types';
import {useTheme} from '../../../theme';
import {useAppSelector} from '../../../store';
import {
  ScreenWrapper,
  HeaderNavigation,
  EHText,
  EHCard,
  EHAvatar,
  EHButton,
} from '../../../components';

export default function ParentProfileStepScreen({
  navigation,
}: FamilySetupScreenProps<'ParentProfile'>) {
  const {colors, spacing} = useTheme();
  const parent = useAppSelector(state => state.parent.profile);

  return (
    <ScreenWrapper
      headerComponent={
        <HeaderNavigation
          label="Parent Profile"
          subtitle="Step 2 of 8: Name & Photo"
          onBack={() => navigation.goBack()}
        />
      }>
      <View style={[styles.container, {padding: spacing.md}]}>
        <EHCard style={styles.profileCard} elevation="low">
          <EHAvatar source={parent?.photo} name={parent?.name || 'Parent'} size={96} />
          <EHText variant="heading1" weight="700" style={styles.nameText}>
            {parent?.name || 'Grandma Mary'}
          </EHText>
          <EHText variant="body" color={colors.textSecondary}>
            Primary phone user profile
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
            label="Next: Family"
            icon={<ArrowRight size={18} color="#FFFFFF" />}
            variant="primary"
            onPress={() => navigation.navigate('FamilyMembers')}
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
  profileCard: {
    alignItems: 'center',
    padding: 24,
  },
  nameText: {
    marginTop: 16,
    marginBottom: 4,
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

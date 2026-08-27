import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Users, ArrowRight, ArrowLeft, Plus} from 'lucide-react-native';
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

export default function FamilyMembersStepScreen({
  navigation,
}: FamilySetupScreenProps<'FamilyMembers'>) {
  const {colors, spacing} = useTheme();
  const familyMembers = useAppSelector(state => state.family.members);

  return (
    <ScreenWrapper
      headerComponent={
        <HeaderNavigation
          label="Family Members"
          subtitle="Step 3 of 8: Loved Ones"
          onBack={() => navigation.goBack()}
        />
      }>
      <View style={[styles.container, {padding: spacing.md}]}>
        <EHCard style={styles.listCard} elevation="low">
          <EHText variant="heading2" weight="700" style={styles.cardTitle}>
            Current Family Contacts ({familyMembers.length})
          </EHText>

          {familyMembers.map(m => (
            <View key={m.id} style={styles.memberRow}>
              <EHAvatar source={m.photo} name={m.name} size={48} />
              <View style={styles.memberInfo}>
                <EHText variant="body" weight="700">
                  {m.name}
                </EHText>
                <EHText variant="caption" color={colors.textSecondary}>
                  {m.relationship} • {m.phoneNumber}
                </EHText>
              </View>
            </View>
          ))}
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
            label="Next: Apps"
            icon={<ArrowRight size={18} color="#FFFFFF" />}
            variant="primary"
            onPress={() => navigation.navigate('ImportantApps')}
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
  listCard: {
    padding: 18,
    gap: 14,
  },
  cardTitle: {
    marginBottom: 4,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  memberInfo: {
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

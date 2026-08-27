import React from 'react';
import {View, StyleSheet} from 'react-native';
import {CheckCircle2, Home, Sparkles} from 'lucide-react-native';
import type {FamilySetupScreenProps} from '../../../navigation/types';
import {useAppDispatch, setSetupCompleted} from '../../../store';
import {useTheme} from '../../../theme';
import {
  ScreenWrapper,
  HeaderNavigation,
  EHText,
  EHCard,
  EHButton,
} from '../../../components';

export default function CompleteStepScreen({
  navigation,
}: FamilySetupScreenProps<'Complete'>) {
  const {colors, spacing} = useTheme();
  const dispatch = useAppDispatch();

  const handleFinish = () => {
    dispatch(setSetupCompleted(true));
    navigation.replace('Home');
  };

  return (
    <ScreenWrapper
      headerComponent={
        <HeaderNavigation
          label="Setup Complete"
          subtitle="Ready to use EasyHome"
          disableBack={true}
        />
      }>
      <View style={[styles.container, {padding: spacing.md}]}>
        <EHCard style={styles.centerCard} elevation="low">
          <View
            style={[
              styles.iconCircle,
              {backgroundColor: colors.successLight},
            ]}>
            <CheckCircle2 size={42} color={colors.success} />
          </View>
          <EHText variant="heading1" weight="800" align="center">
            All Set!
          </EHText>
          <EHText
            variant="body"
            color={colors.textSecondary}
            align="center"
            style={styles.desc}>
            EasyHome is personalized, protected, and ready for your parent to use
            every day.
          </EHText>
        </EHCard>

        {/* Action button */}
        <EHButton
          label="Go to Home Screen"
          icon={<Home size={18} color="#FFFFFF" />}
          variant="primary"
          onPress={handleFinish}
          style={styles.actionBtn}
        />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  centerCard: {
    alignItems: 'center',
    padding: 28,
  },
  iconCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  desc: {
    marginTop: 8,
    lineHeight: 22,
  },
  actionBtn: {
    marginTop: 8,
    minHeight: 56,
  },
});

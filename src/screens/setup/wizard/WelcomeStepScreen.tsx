import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Heart, Sparkles, ArrowRight, CheckCircle2} from 'lucide-react-native';
import type {FamilySetupScreenProps} from '../../../navigation/types';
import {useTheme} from '../../../theme';
import {
  ScreenWrapper,
  HeaderNavigation,
  EHText,
  EHCard,
  EHButton,
} from '../../../components';

export default function WelcomeStepScreen({
  navigation,
}: FamilySetupScreenProps<'Welcome'>) {
  const {colors, spacing} = useTheme();

  const configItems = [
    "Parent's name & personal profile",
    'Family contacts for 1-tap calls & WhatsApp',
    'Essential apps on the home screen',
    'High-contrast themes and large text',
    'Daily medicine & water reminders',
    'Emergency SOS & PIN safety protection',
  ];

  return (
    <ScreenWrapper
      headerComponent={
        <HeaderNavigation
          label="Family Setup"
          subtitle="Step 1 of 8: Welcome"
          disableBack={true}
        />
      }>
      <View style={[styles.container, {padding: spacing.md}]}>
        {/* Intro Card */}
        <EHCard style={styles.introCard} elevation="low">
          <View
            style={[
              styles.iconCircle,
              {backgroundColor: colors.primaryLight},
            ]}>
            <Heart size={36} color={colors.primary} />
          </View>
          <EHText variant="heading1" weight="800" align="center">
            Welcome to EasyHome
          </EHText>
          <EHText
            variant="body"
            color={colors.textSecondary}
            align="center"
            style={styles.introDesc}>
            Set up and customize your parent's phone in a few simple steps so they
            stay connected without confusion.
          </EHText>
        </EHCard>

        {/* Checklist Card */}
        <EHCard style={styles.checklistCard}>
          <EHText variant="heading2" weight="700" style={styles.listTitle}>
            What we will configure:
          </EHText>
          {configItems.map((item, index) => (
            <View key={index} style={styles.checkItem}>
              <CheckCircle2 size={18} color={colors.success} style={styles.checkIcon} />
              <EHText variant="body" style={styles.itemText}>
                {item}
              </EHText>
            </View>
          ))}
        </EHCard>

        {/* Action button */}
        <EHButton
          label="Get Started"
          icon={<ArrowRight size={18} color="#FFFFFF" />}
          variant="primary"
          onPress={() => navigation.navigate('ParentProfile')}
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
  introCard: {
    alignItems: 'center',
    padding: 24,
  },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  introDesc: {
    marginTop: 8,
    lineHeight: 22,
  },
  checklistCard: {
    padding: 18,
    gap: 12,
  },
  listTitle: {
    marginBottom: 4,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  itemText: {
    flex: 1,
    lineHeight: 22,
  },
  actionBtn: {
    marginTop: 8,
    minHeight: 56,
  },
});

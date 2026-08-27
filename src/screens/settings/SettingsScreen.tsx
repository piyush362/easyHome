import React from 'react';
import {View, StyleSheet} from 'react-native';
import {
  Palette,
  Sparkles,
  Smartphone,
  Sliders,
  ChevronRight,
  LayoutGrid,
  Users,
  ShieldAlert,
} from 'lucide-react-native';
import type {RootStackScreenProps} from '../../navigation/types';
import {useTheme} from '../../theme';
import {
  ScreenWrapper,
  HeaderNavigation,
  EHText,
  EHListItem,
  EHSection,
} from '../../components';

export default function SettingsScreen({
  navigation,
}: RootStackScreenProps<'Settings'>) {
  const {colors, spacing} = useTheme();

  return (
    <ScreenWrapper
      headerComponent={
        <HeaderNavigation
          label="Settings"
          onBack={() => navigation.goBack()}
        />
      }>
      <View style={[styles.container, {padding: spacing.md}]}>
        {/* 1. Personalization */}
        <EHSection title="Personalization">
          <EHListItem
            title="Theme & Appearance"
            left={<Palette size={22} color={colors.primary} />}
            right={<ChevronRight size={20} color={colors.textMuted} />}
            onPress={() => navigation.navigate('ThemeSettings')}
          />
          <EHListItem
            title="App Drawer & Layout"
            left={<LayoutGrid size={22} color={colors.primary} />}
            right={<ChevronRight size={20} color={colors.textMuted} />}
            onPress={() => navigation.navigate('AppDrawerSettings')}
          />
        </EHSection>

        {/* 2. Family & Safety */}
        <EHSection title="Family & Safety">
          <EHListItem
            title="Family Contacts"
            left={<Users size={22} color={colors.primary} />}
            right={<ChevronRight size={20} color={colors.textMuted} />}
            onPress={() => navigation.navigate('Family')}
          />
          <EHListItem
            title="Emergency SOS Contacts"
            left={<ShieldAlert size={22} color={colors.error} />}
            right={<ChevronRight size={20} color={colors.textMuted} />}
            onPress={() => navigation.navigate('Family')}
          />
        </EHSection>

        {/* 3. System & Launcher */}
        <EHSection title="System & Launcher">
          <EHListItem
            title="Default Launcher Setup"
            left={<Smartphone size={22} color={colors.primary} />}
            right={<ChevronRight size={20} color={colors.textMuted} />}
            onPress={() => navigation.navigate('LauncherSetup')}
          />
          <EHListItem
            title="Setup Wizard"
            left={<Sliders size={22} color={colors.primary} />}
            right={<ChevronRight size={20} color={colors.textMuted} />}
            onPress={() => navigation.navigate('FamilySetup')}
          />
          <EHListItem
            title="Design System Showcase"
            left={<Sparkles size={22} color={colors.primary} />}
            right={<ChevronRight size={20} color={colors.textMuted} />}
            onPress={() => navigation.navigate('ComponentShowcase')}
          />
        </EHSection>

        {/* 4. Footer */}
        <View style={styles.footer}>
          <EHText variant="caption" color={colors.textMuted} align="center">
            EasyHome v1.0.0
          </EHText>
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 24,
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});

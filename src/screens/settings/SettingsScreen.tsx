import React from 'react';
import {View, StyleSheet, NativeModules, Linking} from 'react-native';
import {
  Palette,
  Sparkles,
  Smartphone,
  Sliders,
  ChevronRight,
  LayoutGrid,
  Users,
  ShieldAlert,
  Bell,
  LayoutTemplate,
  Home,
  Settings as SettingsIcon,
} from 'lucide-react-native';
import type {RootStackScreenProps} from '../../navigation/types';
import {useTheme} from '../../theme';
import {
  ScreenWrapper,
  HeaderNavigation,
  EHText,
  EHListItem,
  EHSection,
  EHButton,
} from '../../components';

const {LauncherModule} = NativeModules;

export default function SettingsScreen({
  navigation,
}: RootStackScreenProps<'Settings'>) {
  const {colors, spacing} = useTheme();

  const handleChangeLauncher = async () => {
    try {
      if (LauncherModule?.openHomeSettings) {
        await LauncherModule.openHomeSettings();
      } else if (LauncherModule?.requestSetDefaultLauncher) {
        await LauncherModule.requestSetDefaultLauncher();
      } else {
        Linking.openSettings();
      }
    } catch (error) {
      Linking.openSettings();
    }
  };

  const handleOpenAppSettings = () => {
    Linking.openSettings();
  };

  return (
    <ScreenWrapper
      headerComponent={
        <HeaderNavigation
          label="Settings"
          onBack={() => navigation.goBack()}
        />
      }>
      <ScrollViewContent style={[styles.container, {padding: spacing.md}]}>
        {/* 1. Personalization */}
        <EHSection title="Personalization">
          <EHListItem
            title="Theme & Appearance"
            left={<Palette size={22} color={colors.primary} />}
            right={<ChevronRight size={20} color={colors.textMuted} />}
            onPress={() => navigation.navigate('ThemeSettings')}
          />
          <EHListItem
            title="Home Screen"
            left={<LayoutTemplate size={22} color={colors.primary} />}
            right={<ChevronRight size={20} color={colors.textMuted} />}
            onPress={() => navigation.navigate('HomeScreenSettings')}
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
            title="Daily Reminders"
            left={<Bell size={22} color={colors.primary} />}
            right={<ChevronRight size={20} color={colors.textMuted} />}
            onPress={() => navigation.navigate('ReminderList')}
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

        {/* 4. Developer */}
        <EHSection title="Developer">
          <EHButton
            label="Change Default Launcher"
            variant="primary"
            icon={<Home size={20} color="#FFFFFF" />}
            onPress={handleChangeLauncher}
            style={styles.actionBtn}
          />
          <EHButton
            label="Open App Info & Permissions"
            variant="outline"
            icon={<SettingsIcon size={18} color={colors.primary} />}
            onPress={handleOpenAppSettings}
            style={styles.actionBtn}
          />
        </EHSection>

        {/* 5. Footer */}
        <View style={styles.footer}>
          <EHText variant="caption" color={colors.textMuted} align="center">
            EasyHome v1.0.0
          </EHText>
        </View>
      </ScrollViewContent>
    </ScreenWrapper>
  );
}

const ScrollViewContent = View;

const styles = StyleSheet.create({
  container: {
    gap: 24,
    paddingBottom: 32,
  },
  quickActionsContainer: {
    gap: 12,
    marginTop: 8,
  },
  actionBtn: {
    minHeight: 52,
  },
  footer: {
    paddingVertical: 12,
    alignItems: 'center',
  },
});

import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Linking,
  NativeModules,
} from 'react-native';
import {
  Palette,
  LayoutTemplate,
  LayoutGrid,
  Users,
  Bell,
  ShieldAlert,
  Smartphone,
  ExternalLink,
  ChevronRight,
  Sun,
  Moon,
} from 'lucide-react-native';
import {useTheme} from '../../../theme';
import {EHText, EHCard, EHListItem, EHSection, EHButton} from '../../../components';
import {useAppDispatch, setAppearanceMode} from '../../../store';

const {LauncherModule} = NativeModules;

export interface HomeV2SettingsViewProps {
  onNavigateTo: (screen: string) => void;
}

export function HomeV2SettingsView({
  onNavigateTo,
}: HomeV2SettingsViewProps) {
  const {colors, isDark} = useTheme();
  const dispatch = useAppDispatch();

  const handleToggleAppearance = () => {
    dispatch(setAppearanceMode(isDark ? 'light' : 'dark'));
  };

  const handleChangeLauncher = async () => {
    try {
      if (LauncherModule?.openHomeSettings) {
        await LauncherModule.openHomeSettings();
      } else if (LauncherModule?.requestSetDefaultLauncher) {
        await LauncherModule.requestSetDefaultLauncher();
      } else {
        Linking.openSettings();
      }
    } catch {
      Linking.openSettings();
    }
  };

  return (
    <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}>
      {/* Header Banner */}
      <EHCard style={styles.headerCard} elevation="low">
        <EHText variant="heading1" weight="800">
          Launcher Settings
        </EHText>
        <EHText variant="caption" color={colors.textSecondary}>
          Customize layout, appearance, and family contacts
        </EHText>
      </EHCard>

      {/* Quick Theme Toggle Card */}
      <EHCard style={styles.themeToggleCard} elevation="low">
        <View style={styles.themeToggleRow}>
          <View style={styles.themeTextCol}>
            <EHText variant="body" weight="700">
              {isDark ? 'Dark Mode (Night)' : 'Light Mode (Day)'}
            </EHText>
            <EHText variant="caption" color={colors.textSecondary}>
              Tap to switch color theme
            </EHText>
          </View>
          <EHButton
            label={isDark ? 'Day' : 'Night'}
            icon={isDark ? <Sun size={16} color="#F59E0B" /> : <Moon size={16} color="#6366F1" />}
            variant="outline"
            onPress={handleToggleAppearance}
            style={styles.themeBtn}
          />
        </View>
      </EHCard>

      {/* 1. Personalization Section */}
      <EHSection title="Personalization">
        <EHListItem
          title="Color Theme & Wallpapers"
          left={<Palette size={22} color={colors.primary} />}
          right={<ChevronRight size={20} color={colors.textMuted} />}
          onPress={() => onNavigateTo('ThemeSettings')}
        />
        <EHListItem
          title="Home Screen Layout"
          left={<LayoutTemplate size={22} color={colors.primary} />}
          right={<ChevronRight size={20} color={colors.textMuted} />}
          onPress={() => onNavigateTo('HomeScreenSettings')}
        />
        <EHListItem
          title="App Drawer & Columns"
          left={<LayoutGrid size={22} color={colors.primary} />}
          right={<ChevronRight size={20} color={colors.textMuted} />}
          onPress={() => onNavigateTo('AppDrawerSettings')}
        />
      </EHSection>

      {/* 2. Family & Safety Section */}
      <EHSection title="Family & Safety">
        <EHListItem
          title="Family Contacts"
          left={<Users size={22} color={colors.primary} />}
          right={<ChevronRight size={20} color={colors.textMuted} />}
          onPress={() => onNavigateTo('Family')}
        />
        <EHListItem
          title="Daily Medication Reminders"
          left={<Bell size={22} color={colors.primary} />}
          right={<ChevronRight size={20} color={colors.textMuted} />}
          onPress={() => onNavigateTo('ReminderList')}
        />
      </EHSection>

      {/* 3. System & Launcher Default Section */}
      <EHSection title="System">
        <EHListItem
          title="Set Default Home App"
          subtitle="Keep EasyHome as permanent home launcher"
          left={<Smartphone size={22} color={colors.primary} />}
          right={<ChevronRight size={20} color={colors.textMuted} />}
          onPress={handleChangeLauncher}
        />
        <EHListItem
          title="Android Device Settings"
          left={<ExternalLink size={22} color={colors.textSecondary} />}
          right={<ChevronRight size={20} color={colors.textMuted} />}
          onPress={() => Linking.openSettings()}
        />
      </EHSection>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 16,
    gap: 12,
  },
  headerCard: {
    padding: 16,
    borderRadius: 22,
    marginBottom: 4,
  },
  themeToggleCard: {
    padding: 14,
    borderRadius: 18,
  },
  themeToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  themeTextCol: {
    flex: 1,
    gap: 2,
  },
  themeBtn: {
    minHeight: 38,
    paddingHorizontal: 14,
  },
});

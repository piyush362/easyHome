import React from 'react';
import {View, StyleSheet} from 'react-native';
import {
  Clock,
  ChevronRight,
  LayoutGrid,
} from 'lucide-react-native';
import type {RootStackScreenProps} from '../../navigation/types';
import {useAppSelector} from '../../store';
import {useTheme} from '../../theme';
import {
  ScreenWrapper,
  HeaderNavigation,
  EHText,
  EHListItem,
  EHSection,
} from '../../components';

export default function HomeScreenSettingsScreen({
  navigation,
}: RootStackScreenProps<'HomeScreenSettings'>) {
  const {colors, spacing} = useTheme();
  const currentClockStyle =
    useAppSelector(state => state.settings.appearance.clockStyle) || 'frosted';
  const currentLayout =
    useAppSelector(state => state.settings.appearance.appListLayout) ||
    'vertical';
  const currentGrid =
    useAppSelector(state => state.settings.appearance.drawerGrid) || '4x5';

  const clockStyleLabels: Record<string, string> = {
    frosted: 'Frosted Glass',
    minimal: 'Minimal Floating',
    classic: 'Classic Dual-Tone',
  };

  return (
    <ScreenWrapper
      headerComponent={
        <HeaderNavigation
          label="Home Screen"
          onBack={() => navigation.goBack()}
        />
      }>
      <View style={[styles.container, {padding: spacing.md}]}>
        {/* 1. App Drawer & Layout link */}
        <EHSection title="Applications & Drawer">
          <EHListItem
            title="App Drawer & Grid"
            subtitle={`${currentLayout === 'paginated' ? 'OneUI Swiper' : 'Vertical Scroll'} • ${currentGrid} Grid`}
            left={<LayoutGrid size={22} color={colors.primary} />}
            right={<ChevronRight size={20} color={colors.textMuted} />}
            onPress={() => navigation.navigate('AppDrawerSettings')}
          />
        </EHSection>

        {/* 2. Header & Clock */}
        <EHSection title="Header & Clock">
          <EHListItem
            title="Clock Style"
            left={<Clock size={22} color={colors.primary} />}
            right={
              <View style={styles.rightRow}>
                <EHText
                  variant="caption"
                  color={colors.textSecondary}
                  weight="600">
                  {clockStyleLabels[currentClockStyle] || 'Frosted Glass'}
                </EHText>
                <ChevronRight size={20} color={colors.textMuted} />
              </View>
            }
            onPress={() => navigation.navigate('ClockSettings')}
          />
        </EHSection>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 24,
  },
  rightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
});

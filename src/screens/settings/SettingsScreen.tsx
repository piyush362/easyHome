import React from 'react';
import {View, StyleSheet} from 'react-native';
import {
  Palette,
  Sparkles,
  Smartphone,
  Sliders,
  ChevronRight,
  Sun,
  Moon,
  LayoutGrid,
  Circle,
  Square,
} from 'lucide-react-native';
import type {RootStackScreenProps} from '../../navigation/types';
import {
  useAppSelector,
  useAppDispatch,
  setTheme,
  setAppearanceMode,
  setDrawerColumns,
  setDrawerIconShape,
} from '../../store';
import {useTheme} from '../../theme';
import {
  ScreenWrapper,
  HeaderNavigation,
  EHText,
  EHCard,
  EHListItem,
  EHSection,
  EHButton,
} from '../../components';
import {ColorTheme, DrawerColumns, IconShape} from '../../types/models';

export default function SettingsScreen({
  navigation,
}: RootStackScreenProps<'Settings'>) {
  const {colors, spacing, themeName, appearance} = useTheme();
  const dispatch = useAppDispatch();
  const settings = useAppSelector(state => state.settings.appearance);

  const activeColumns: DrawerColumns = settings.drawerColumns || 5;
  const activeShape: IconShape = settings.drawerIconShape || 'circle';

  const themes: ColorTheme[] = ['ocean', 'green', 'rose', 'warm', 'blue', 'dark'];
  const columnOptions: DrawerColumns[] = [3, 4, 5];
  const shapeOptions: {id: IconShape; label: string}[] = [
    {id: 'circle', label: 'Circle'},
    {id: 'rounded', label: 'Rounded'},
    {id: 'square', label: 'Square'},
  ];

  return (
    <ScreenWrapper
      headerComponent={
        <HeaderNavigation
          label="Settings"
          subtitle="Themes, layout & preferences"
          onBack={() => navigation.goBack()}
        />
      }>
      <View style={[styles.container, {padding: spacing.md}]}>
        {/* Appearance Summary Card */}
        <EHCard style={styles.summaryCard} elevation="low">
          <View style={styles.summaryRow}>
            <View
              style={[
                styles.summaryIconBox,
                {backgroundColor: colors.primaryLight},
              ]}>
              <Palette size={26} color={colors.primary} />
            </View>
            <View style={styles.summaryTextCol}>
              <EHText variant="body" weight="700">
                Theme: {themeName.toUpperCase()} ({appearance.toUpperCase()})
              </EHText>
              <EHText variant="caption" color={colors.textSecondary}>
                App Drawer: {activeColumns} items/row • Shape: {activeShape}
              </EHText>
            </View>
          </View>
        </EHCard>

        {/* 1. App Drawer Customization */}
        <EHSection
          title="App Drawer Customization"
          subtitle="Customize grid density and icon shapes for the app list">
          <EHCard style={styles.cardPadding} elevation="low">
            {/* Grid Density */}
            <View style={styles.sectionHeaderRow}>
              <LayoutGrid size={20} color={colors.primary} />
              <EHText variant="body" weight="700">
                Items per Row (Min 3 — Max 5)
              </EHText>
            </View>
            <View style={styles.btnRow}>
              {columnOptions.map(cols => (
                <EHButton
                  key={cols}
                  label={`${cols} per Row`}
                  variant={activeColumns === cols ? 'primary' : 'outline'}
                  onPress={() => dispatch(setDrawerColumns(cols))}
                  style={styles.flexBtn}
                />
              ))}
            </View>

            {/* Icon Shape */}
            <View style={[styles.sectionHeaderRow, styles.marginTop14]}>
              <Circle size={20} color={colors.primary} />
              <EHText variant="body" weight="700">
                App Icon Shape
              </EHText>
            </View>
            <View style={styles.btnRow}>
              {shapeOptions.map(shape => (
                <EHButton
                  key={shape.id}
                  label={shape.label}
                  variant={activeShape === shape.id ? 'primary' : 'outline'}
                  onPress={() => dispatch(setDrawerIconShape(shape.id))}
                  style={styles.flexBtn}
                />
              ))}
            </View>
          </EHCard>
        </EHSection>

        {/* 2. Visual Theme & Appearance Mode */}
        <EHSection
          title="Color Theme & Appearance"
          subtitle="Choose high-contrast colors and light or dark mode">
          <EHCard style={styles.cardPadding} elevation="low">
            <EHText variant="body" weight="700" style={styles.labelMargin}>
              Color Palette
            </EHText>
            <View style={styles.btnGrid}>
              {themes.map(t => (
                <EHButton
                  key={t}
                  label={t.toUpperCase()}
                  variant={themeName === t ? 'primary' : 'outline'}
                  onPress={() => dispatch(setTheme(t))}
                  style={styles.themeBtn}
                />
              ))}
            </View>

            <EHText variant="body" weight="700" style={styles.marginTop14}>
              Appearance Mode
            </EHText>
            <View style={styles.btnRow}>
              <EHButton
                label="Light Mode"
                icon={<Sun size={18} color={appearance === 'light' ? '#FFFFFF' : colors.primary} />}
                variant={appearance === 'light' ? 'primary' : 'outline'}
                onPress={() => dispatch(setAppearanceMode('light'))}
                style={styles.flexBtn}
              />
              <EHButton
                label="Dark Mode"
                icon={<Moon size={18} color={appearance === 'dark' ? '#FFFFFF' : colors.primary} />}
                variant={appearance === 'dark' ? 'primary' : 'outline'}
                onPress={() => dispatch(setAppearanceMode('dark'))}
                style={styles.flexBtn}
              />
            </View>
          </EHCard>
        </EHSection>

        {/* 3. System & Launcher */}
        <EHSection title="System & Launcher">
          <EHListItem
            title="Launcher Setup & Permissions"
            subtitle="Set EasyHome as default launcher & check status"
            left={<Smartphone size={22} color={colors.primary} />}
            right={<ChevronRight size={20} color={colors.textMuted} />}
            onPress={() => navigation.navigate('LauncherSetup')}
          />
          <EHListItem
            title="Setup Wizard"
            subtitle="Re-run the step-by-step phone configuration"
            left={<Sliders size={22} color={colors.primary} />}
            right={<ChevronRight size={20} color={colors.textMuted} />}
            onPress={() => navigation.navigate('FamilySetup')}
          />
          <EHListItem
            title="Design System Showcase"
            subtitle="Test all 10 accessible components, buttons, and tokens"
            left={<Sparkles size={22} color={colors.primary} />}
            right={<ChevronRight size={20} color={colors.textMuted} />}
            onPress={() => navigation.navigate('ComponentShowcase')}
          />
        </EHSection>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  summaryCard: {
    padding: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  summaryTextCol: {
    flex: 1,
  },
  cardPadding: {
    padding: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  labelMargin: {
    marginBottom: 8,
  },
  marginTop14: {
    marginTop: 14,
    marginBottom: 8,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 8,
  },
  btnGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  themeBtn: {
    flexGrow: 1,
    minWidth: 90,
  },
  flexBtn: {
    flex: 1,
    minHeight: 46,
  },
});

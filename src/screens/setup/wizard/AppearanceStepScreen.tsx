import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Palette, ArrowRight, ArrowLeft, Sun, Moon} from 'lucide-react-native';
import type {FamilySetupScreenProps} from '../../../navigation/types';
import {useTheme} from '../../../theme';
import {useAppSelector, useAppDispatch, setTheme, setAppearanceMode} from '../../../store';
import {
  ScreenWrapper,
  HeaderNavigation,
  EHText,
  EHCard,
  EHButton,
} from '../../../components';
import {ColorTheme} from '../../../types/models';

export default function AppearanceStepScreen({
  navigation,
}: FamilySetupScreenProps<'Appearance'>) {
  const {colors, spacing, themeName, appearance} = useTheme();
  const dispatch = useAppDispatch();
  const themes: ColorTheme[] = ['ocean', 'green', 'rose', 'warm', 'blue', 'dark'];

  return (
    <ScreenWrapper
      headerComponent={
        <HeaderNavigation
          label="Appearance & Themes"
          subtitle="Step 5 of 8: Visual Preferences"
          onBack={() => navigation.goBack()}
        />
      }>
      <View style={[styles.container, {padding: spacing.md}]}>
        <EHCard style={styles.card} elevation="low">
          <EHText variant="heading2" weight="700">
            Select Color Palette
          </EHText>
          <View style={styles.themeGrid}>
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

          <EHText variant="heading2" weight="700" style={styles.subHeading}>
            Appearance Mode
          </EHText>
          <View style={styles.btnRow}>
            <EHButton
              label="Light"
              icon={<Sun size={18} color={appearance === 'light' ? '#FFF' : colors.primary} />}
              variant={appearance === 'light' ? 'primary' : 'outline'}
              onPress={() => dispatch(setAppearanceMode('light'))}
              style={styles.halfBtn}
            />
            <EHButton
              label="Dark"
              icon={<Moon size={18} color={appearance === 'dark' ? '#FFF' : colors.primary} />}
              variant={appearance === 'dark' ? 'primary' : 'outline'}
              onPress={() => dispatch(setAppearanceMode('dark'))}
              style={styles.halfBtn}
            />
          </View>
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
            label="Next: Reminders"
            icon={<ArrowRight size={18} color="#FFFFFF" />}
            variant="primary"
            onPress={() => navigation.navigate('Reminders')}
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
  card: {
    padding: 18,
    gap: 12,
  },
  themeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  themeBtn: {
    flexGrow: 1,
    minWidth: 90,
  },
  subHeading: {
    marginTop: 8,
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

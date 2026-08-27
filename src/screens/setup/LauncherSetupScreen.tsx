import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  StyleSheet,
  NativeModules,
  AppState,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Smartphone,
} from 'lucide-react-native';
import type {RootStackScreenProps} from '../../navigation/types';
import {useAppDispatch, setIsDefault as setLauncherDefaultAction} from '../../store';
import {useTheme} from '../../theme';
import {
  ScreenWrapper,
  HeaderNavigation,
  EHText,
  EHCard,
  EHButton,
} from '../../components';

const {LauncherModule} = NativeModules;

export default function LauncherSetupScreen({
  navigation,
}: RootStackScreenProps<'LauncherSetup'>) {
  const {colors, spacing} = useTheme();
  const dispatch = useAppDispatch();
  const [isDefault, setIsDefault] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  const checkLauncherStatus = useCallback(async () => {
    try {
      setLoading(true);
      const result = await LauncherModule.isDefaultLauncher();
      setIsDefault(result);
      dispatch(setLauncherDefaultAction(Boolean(result)));
    } catch (error: any) {
      console.warn('Failed to check launcher status:', error);
      Alert.alert('Error', 'Failed to check launcher status: ' + error?.message);
      setIsDefault(false);
      dispatch(setLauncherDefaultAction(false));
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  // Check launcher status on mount
  useEffect(() => {
    checkLauncherStatus();
  }, [checkLauncherStatus]);

  // Re-check when app returns to foreground
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
        checkLauncherStatus();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [checkLauncherStatus]);

  const handleSetDefault = async () => {
    try {
      await LauncherModule.requestSetDefaultLauncher();
    } catch (error: any) {
      console.warn('Failed to set default launcher:', error);
      Alert.alert(
        'Could not set launcher',
        'Please go to Settings → Apps → Default Apps → Home App and select EasyHome.\n\nError: ' +
          error?.message,
      );
    }
  };

  const handleOpenSettings = async () => {
    try {
      await LauncherModule.openHomeSettings();
    } catch (error: any) {
      console.warn('Failed to open settings:', error);
      Alert.alert(
        'Could not open settings',
        'Please go to Settings → Apps → Default Apps → Home App manually.\n\nError: ' +
          error?.message,
      );
    }
  };

  return (
    <ScreenWrapper
      headerComponent={
        <HeaderNavigation
          label="Launcher Setup"
          subtitle="System default home app"
          onBack={() => navigation.goBack()}
        />
      }>
      <View style={[styles.container, {padding: spacing.md}]}>
        {loading ? (
          <View style={styles.centerBox}>
            <ActivityIndicator size="large" color={colors.primary} />
            <EHText variant="body" style={styles.loaderText}>
              Checking default launcher status...
            </EHText>
          </View>
        ) : (
          <>
            {/* Status Card */}
            <EHCard
              style={styles.statusCard}
              elevation="low">
              <View style={styles.statusRow}>
                {isDefault ? (
                  <View
                    style={[
                      styles.iconCircle,
                      {backgroundColor: colors.successLight},
                    ]}>
                    <CheckCircle2 size={32} color={colors.success} />
                  </View>
                ) : (
                  <View
                    style={[
                      styles.iconCircle,
                      {backgroundColor: colors.warningLight},
                    ]}>
                    <AlertCircle size={32} color={colors.warning} />
                  </View>
                )}

                <View style={styles.statusTextCol}>
                  <EHText variant="heading2" weight="700">
                    {isDefault
                      ? 'EasyHome is Default'
                      : 'Not Set as Default Launcher'}
                  </EHText>
                  <EHText variant="caption" color={colors.textSecondary}>
                    {isDefault
                      ? 'Pressing the physical Home button will always bring you back to EasyHome.'
                      : 'Set EasyHome as default so pressing Home button returns here.'}
                  </EHText>
                </View>
              </View>
            </EHCard>

            {/* Explanatory Info Card */}
            <EHCard style={styles.infoCard}>
              <View style={styles.infoRow}>
                <ShieldCheck size={24} color={colors.primary} style={styles.shieldIcon} />
                <EHText variant="body" style={styles.infoText}>
                  Setting EasyHome as the default home app creates a protected,
                  peaceful environment where parents cannot accidentally exit or get lost.
                </EHText>
              </View>
            </EHCard>

            {/* Action buttons */}
            <View style={styles.buttonStack}>
              {isDefault ? (
                <EHButton
                  label="Continue to Home"
                  icon={<Smartphone size={18} color="#FFFFFF" />}
                  variant="primary"
                  onPress={() => navigation.replace('Home')}
                  style={styles.actionBtn}
                />
              ) : (
                <>
                  <EHButton
                    label="Set as Default Launcher"
                    icon={<Smartphone size={18} color="#FFFFFF" />}
                    variant="primary"
                    onPress={handleSetDefault}
                    style={styles.actionBtn}
                  />

                  <EHButton
                    label="Open System Settings"
                    icon={<ExternalLink size={18} color={colors.primary} />}
                    variant="outline"
                    onPress={handleOpenSettings}
                    style={styles.actionBtn}
                  />
                </>
              )}
            </View>
          </>
        )}
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  centerBox: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loaderText: {
    marginTop: 16,
  },
  statusCard: {
    padding: 18,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  statusTextCol: {
    flex: 1,
  },
  infoCard: {
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  shieldIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  infoText: {
    flex: 1,
    lineHeight: 22,
  },
  buttonStack: {
    gap: 12,
    marginTop: 8,
  },
  actionBtn: {
    minHeight: 56,
  },
});

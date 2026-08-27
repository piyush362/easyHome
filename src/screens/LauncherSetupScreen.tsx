import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  NativeModules,
  AppState,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

const {LauncherModule} = NativeModules;

type RootStackParamList = {
  LauncherSetup: undefined;
  MinimalHome: undefined;
};

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'LauncherSetup'>;
};

export default function LauncherSetupScreen({navigation}: Props) {
  const [isDefault, setIsDefault] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  const checkLauncherStatus = useCallback(async () => {
    try {
      setLoading(true);
      const result = await LauncherModule.isDefaultLauncher();
      setIsDefault(result);
    } catch (error) {
      console.warn('Failed to check launcher status:', error);
      setIsDefault(false);
    } finally {
      setLoading(false);
    }
  }, []);

  // Check launcher status on mount
  useEffect(() => {
    checkLauncherStatus();
  }, [checkLauncherStatus]);

  // Re-check when app returns to foreground (user may have changed launcher in settings)
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
      await LauncherModule.openDefaultLauncherSettings();
    } catch (error) {
      console.warn('Failed to open launcher settings:', error);
    }
  };

  const handleContinue = () => {
    navigation.replace('MinimalHome');
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <ActivityIndicator size="large" color="#4A90D9" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* App Title */}
      <Text style={styles.title}>EasyHome</Text>
      <Text style={styles.subtitle}>
        A simpler phone for the people you love.
      </Text>

      {/* Launcher Status */}
      <View style={styles.statusContainer}>
        {isDefault ? (
          <>
            <Text style={styles.statusIcon}>✓</Text>
            <Text style={styles.statusText}>
              EasyHome is your default launcher.
            </Text>
          </>
        ) : (
          <>
            <Text style={styles.statusIcon}>○</Text>
            <Text style={styles.statusText}>
              EasyHome is not your default launcher.
            </Text>
          </>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        {isDefault ? (
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleContinue}
            activeOpacity={0.8}>
            <Text style={styles.primaryButtonText}>Continue</Text>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleSetDefault}
              activeOpacity={0.8}>
              <Text style={styles.primaryButtonText}>
                Set EasyHome as Default Launcher
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleSetDefault}
              activeOpacity={0.8}>
              <Text style={styles.secondaryButtonText}>
                Open Launcher Settings
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 48,
    textAlign: 'center',
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  statusIcon: {
    fontSize: 48,
    color: '#4A90D9',
    marginBottom: 16,
  },
  statusText: {
    fontSize: 18,
    color: '#374151',
    textAlign: 'center',
    lineHeight: 26,
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  primaryButton: {
    backgroundColor: '#4A90D9',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
  },
  secondaryButtonText: {
    color: '#4A90D9',
    fontSize: 18,
    fontWeight: '600',
  },
});

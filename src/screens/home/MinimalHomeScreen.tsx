import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  NativeModules,
  StatusBar,
  BackHandler,
} from 'react-native';

const {LauncherModule} = NativeModules;

export default function MinimalHomeScreen() {
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [isDefault, setIsDefault] = useState<boolean | null>(null);

  // Prevent exiting on root home screen
  useEffect(() => {
    const onBackPress = () => true;
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      onBackPress,
    );
    return () => subscription.remove();
  }, []);

  // Update the clock every second
  const updateTime = useCallback(() => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes.toString().padStart(2, '0');

    setCurrentTime(`${displayHours}:${displayMinutes} ${ampm}`);

    const days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    const dayName = days[now.getDay()];
    const monthName = months[now.getMonth()];
    const date = now.getDate();

    setCurrentDate(`${dayName}, ${monthName} ${date}`);
  }, []);

  useEffect(() => {
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [updateTime]);

  // Check launcher status
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const result = await LauncherModule.isDefaultLauncher();
        setIsDefault(result);
      } catch {
        setIsDefault(null);
      }
    };
    checkStatus();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Clock */}
      <View style={styles.clockContainer}>
        <Text style={styles.time}>{currentTime}</Text>
        <Text style={styles.date}>{currentDate}</Text>
      </View>

      {/* Home Indicator */}
      <View style={styles.homeIndicator}>
        <Text style={styles.homeIcon}>🏠</Text>
        <Text style={styles.homeText}>You are home</Text>
      </View>

      {/* Launcher Status */}
      <View style={styles.statusBadge}>
        <Text style={styles.statusText}>
          {isDefault === true
            ? '✓ EasyHome is your default launcher'
            : isDefault === false
              ? '○ Not the default launcher'
              : 'Checking launcher status...'}
        </Text>
      </View>

      {/* Phase 1 Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerTitle}>EasyHome</Text>
        <Text style={styles.footerSubtitle}>Phase 1 — Launcher Foundation</Text>
        <Text style={styles.footerHint}>
          Press the Home button to test launcher behavior
        </Text>
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
  clockContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  time: {
    fontSize: 56,
    fontWeight: '300',
    color: '#1A1A2E',
    letterSpacing: 2,
  },
  date: {
    fontSize: 20,
    color: '#6B7280',
    marginTop: 8,
  },
  homeIndicator: {
    alignItems: 'center',
    marginBottom: 32,
  },
  homeIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  homeText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#374151',
  },
  statusBadge: {
    backgroundColor: '#EBF5FF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 48,
  },
  statusText: {
    fontSize: 14,
    color: '#4A90D9',
    fontWeight: '500',
  },
  footer: {
    position: 'absolute',
    bottom: 48,
    alignItems: 'center',
  },
  footerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A2E',
  },
  footerSubtitle: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 4,
  },
  footerHint: {
    fontSize: 12,
    color: '#D1D5DB',
    marginTop: 8,
    fontStyle: 'italic',
  },
});

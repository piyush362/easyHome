import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  BackHandler,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import type {RootStackScreenProps} from '../../navigation/types';
import {useAppSelector} from '../../store';

export default function HomeScreen({navigation}: RootStackScreenProps<'Home'>) {
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const appearance = useAppSelector(state => state.settings.appearance);
  const homeActions = useAppSelector(state => state.home.actions);

  // Prevent exiting launcher when pressing Back on the Home screen
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        return true; // Consume event on Home screen
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => subscription.remove();
    }, []),
  );

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

    setCurrentDate(
      `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}`,
    );
  }, []);

  useEffect(() => {
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [updateTime]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Clock & Date Widget */}
        <View style={styles.clockCard}>
          <Text style={styles.timeText}>{currentTime}</Text>
          <Text style={styles.dateText}>{currentDate}</Text>
        </View>

        {/* Quick Navigation Cards */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Navigation</Text>
        </View>

        <View style={styles.grid}>
          <TouchableOpacity
            style={[styles.navCard, {backgroundColor: '#E8F5E9'}]}
            onPress={() => navigation.navigate('Family')}
            activeOpacity={0.8}>
            <Text style={styles.cardEmoji}>❤️</Text>
            <Text style={styles.cardTitle}>Family</Text>
            <Text style={styles.cardSubtitle}>Call & WhatsApp</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navCard, {backgroundColor: '#E3F2FD'}]}
            onPress={() => navigation.navigate('Apps')}
            activeOpacity={0.8}>
            <Text style={styles.cardEmoji}>📱</Text>
            <Text style={styles.cardTitle}>All Apps</Text>
            <Text style={styles.cardSubtitle}>Apps on Phone</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navCard, {backgroundColor: '#FFF3E0'}]}
            onPress={() => navigation.navigate('Settings')}
            activeOpacity={0.8}>
            <Text style={styles.cardEmoji}>⚙️</Text>
            <Text style={styles.cardTitle}>Settings</Text>
            <Text style={styles.cardSubtitle}>Theme & Sizes</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navCard, {backgroundColor: '#F3E5F5'}]}
            onPress={() => navigation.navigate('FamilySetup')}
            activeOpacity={0.8}>
            <Text style={styles.cardEmoji}>🧙‍♂️</Text>
            <Text style={styles.cardTitle}>Setup Wizard</Text>
            <Text style={styles.cardSubtitle}>Configure Phone</Text>
          </TouchableOpacity>
        </View>

        {/* Home Actions Summary */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Enabled Home Actions</Text>
          <Text style={styles.infoDesc}>
            {homeActions.filter(a => a.enabled).length} actions active • Theme:{' '}
            {appearance.theme}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.launcherStatusBtn}
          onPress={() => navigation.navigate('LauncherSetup')}
          activeOpacity={0.8}>
          <Text style={styles.launcherStatusText}>
            ⚙️ Launcher Setup & Status
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollContent: {
    padding: 24,
    paddingTop: 48,
    alignItems: 'center',
  },
  clockCard: {
    alignItems: 'center',
    marginBottom: 32,
  },
  timeText: {
    fontSize: 52,
    fontWeight: '300',
    color: '#1A1A2E',
    letterSpacing: 2,
  },
  dateText: {
    fontSize: 18,
    color: '#6B7280',
    marginTop: 6,
  },
  sectionHeader: {
    width: '100%',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A2E',
  },
  grid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  navCard: {
    width: '47%',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  cardEmoji: {
    fontSize: 36,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
  },
  infoCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },
  infoDesc: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 4,
  },
  launcherStatusBtn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
  },
  launcherStatusText: {
    fontSize: 14,
    color: '#4B5563',
    fontWeight: '500',
  },
});

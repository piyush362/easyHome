import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import Swiper from 'react-native-swiper';
import {
  Sun,
  Sparkles,
  Bell,
  Clock,
  Pill,
  Calendar,
  ChevronRight,
  Plus,
} from 'lucide-react-native';
import {useTheme} from '../../../theme';
import {EHText, EHCard} from '../../../components';
import {Reminder} from '../../../types/models';

export interface HomeV2ClockWidgetProps {
  parentName?: string;
  currentTime: string;
  currentDate: string;
  weatherTemp?: string;
  weatherCondition?: string;
  reminders?: Reminder[];
  onOpenReminders?: () => void;
}

export function HomeV2ClockWidget({
  parentName,
  currentTime,
  currentDate,
  weatherTemp = '29°C',
  weatherCondition = 'Sunny',
  reminders = [],
  onOpenReminders,
}: HomeV2ClockWidgetProps) {
  const {colors, isDark, borderRadius} = useTheme();

  // Find next enabled reminder
  const activeReminders = reminders.filter(r => r.enabled);
  const nextReminder = activeReminders.length > 0 ? activeReminders[0] : null;

  return (
    <EHCard style={styles.cardContainer} elevation="low">
      <Swiper
        loop={false}
        showsPagination={true}
        paginationStyle={styles.pagination}
        dotStyle={[
          styles.dot,
          {
            backgroundColor: isDark
              ? 'rgba(255, 255, 255, 0.2)'
              : 'rgba(0, 0, 0, 0.15)',
          },
        ]}
        activeDotStyle={[styles.activeDot, {backgroundColor: colors.primary}]}
        style={styles.swiper}>
        {/* Slide 1: Clock & Date Widget */}
        <View style={styles.slide}>
          <View style={styles.topRow}>
            {/* Date and Greeting */}
            <View style={styles.dateCol}>
              {parentName ? (
                <View style={styles.greetingRow}>
                  <Sparkles size={12} color={colors.primary} />
                  <EHText variant="caption" color={colors.primary} weight="600">
                    Hello, {parentName}
                  </EHText>
                </View>
              ) : null}
              <EHText
                variant="body"
                weight="600"
                color={colors.textPrimary}
                style={styles.dayDateText}>
                {currentDate}
              </EHText>
            </View>

            {/* Weather Pill */}
            <View
              style={[
                styles.weatherPill,
                {
                  backgroundColor: isDark
                    ? 'rgba(255, 255, 255, 0.08)'
                    : 'rgba(234, 179, 8, 0.12)',
                  borderColor: isDark
                    ? 'rgba(255, 255, 255, 0.12)'
                    : 'rgba(234, 179, 8, 0.25)',
                  borderRadius: borderRadius.round,
                },
              ]}>
              <Sun size={14} color={colors.warning} style={styles.weatherIcon} />
              <EHText variant="caption" weight="600" color={colors.textPrimary}>
                {weatherTemp}
              </EHText>
            </View>
          </View>

          {/* Clock Digits */}
          <View style={styles.clockRow}>
            <EHText
              variant="heading1"
              weight="700"
              style={[styles.clockDigits, {color: colors.textPrimary}]}>
              {currentTime}
            </EHText>
          </View>
        </View>

        {/* Slide 2: Live Reminders Update */}
        <TouchableOpacity
          style={styles.slide}
          activeOpacity={0.8}
          onPress={onOpenReminders}
          accessibilityRole="button"
          accessibilityLabel="View daily reminders">
          <View style={styles.reminderHeaderRow}>
            <View style={styles.reminderTagRow}>
              <Bell size={13} color={colors.primary} />
              <EHText variant="caption" weight="700" color={colors.primary}>
                {nextReminder ? 'UPCOMING REMINDER' : 'DAILY REMINDERS'}
              </EHText>
            </View>
            <View style={styles.reminderViewAll}>
              <EHText variant="caption" color={colors.textSecondary} weight="500">
                View All
              </EHText>
              <ChevronRight size={13} color={colors.textSecondary} />
            </View>
          </View>

          {nextReminder ? (
            <View style={styles.reminderContentRow}>
              <View
                style={[
                  styles.reminderIconBox,
                  {
                    backgroundColor: isDark
                      ? 'rgba(239, 68, 68, 0.18)'
                      : '#FEE2E2',
                  },
                ]}>
                {nextReminder.type === 'medicine' ? (
                  <Pill size={18} color="#EF4444" />
                ) : (
                  <Clock size={18} color="#EF4444" />
                )}
              </View>
              <View style={styles.reminderTextCol}>
                <EHText
                  variant="body"
                  weight="700"
                  numberOfLines={1}
                  style={styles.reminderTitle}>
                  {nextReminder.title}
                </EHText>
                <EHText
                  variant="caption"
                  color={colors.textSecondary}
                  numberOfLines={1}>
                  {nextReminder.time} •{' '}
                  {nextReminder.recurring ? 'Daily' : 'One-time'}
                </EHText>
              </View>
            </View>
          ) : (
            <View style={styles.noReminderRow}>
              <View
                style={[
                  styles.reminderIconBox,
                  {
                    backgroundColor: isDark
                      ? 'rgba(16, 185, 129, 0.18)'
                      : '#DCFCE7',
                  },
                ]}>
                <Calendar size={18} color="#10B981" />
              </View>
              <View style={styles.reminderTextCol}>
                <EHText variant="body" weight="700" style={styles.reminderTitle}>
                  No Pending Reminders
                </EHText>
                <EHText
                  variant="caption"
                  color={colors.textSecondary}
                  numberOfLines={1}>
                  Tap to add medication or health alerts
                </EHText>
              </View>
            </View>
          )}
        </TouchableOpacity>
      </Swiper>
    </EHCard>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    height: 104,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  swiper: {
    height: '100%',
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 6,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  dateCol: {
    flex: 1,
    gap: 1,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dayDateText: {
    fontSize: 14,
    lineHeight: 18,
  },
  weatherPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderWidth: 1,
  },
  weatherIcon: {
    marginRight: 4,
  },
  clockRow: {
    marginTop: 2,
  },
  clockDigits: {
    fontSize: 36,
    lineHeight: 40,
    letterSpacing: 0.5,
  },
  pagination: {
    bottom: -2,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginHorizontal: 3,
  },
  activeDot: {
    width: 14,
    height: 5,
    borderRadius: 2.5,
    marginHorizontal: 3,
  },
  reminderHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  reminderTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  reminderViewAll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  reminderContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  noReminderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  reminderIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reminderTextCol: {
    flex: 1,
    gap: 2,
  },
  reminderTitle: {
    fontSize: 14,
    lineHeight: 18,
  },
});

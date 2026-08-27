import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import {Clock, Pill} from 'lucide-react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import type {RootStackScreenProps} from '../../navigation/types';
import {
  useAppDispatch,
  useAppSelector,
  toggleReminderEnabled,
} from '../../store';
import {useTheme} from '../../theme';
import {
  ScreenWrapper,
  HeaderNavigation,
  EHText,
  EHCard,
  EHButton,
} from '../../components';
import {Reminder, ReminderType} from '../../types/models';
import {ReminderService} from '../../services';

const FILTER_TABS: {id: 'all' | ReminderType; label: string; emoji: string}[] = [
  {id: 'all', label: 'All', emoji: '📋'},
  {id: 'medicine', label: 'Medicine', emoji: '💊'},
  {id: 'doctor', label: 'Doctor', emoji: '🩺'},
  {id: 'water', label: 'Water', emoji: '💧'},
  {id: 'exercise', label: 'Walk', emoji: '🚶'},
];

export default function ReminderListScreen({
  navigation,
}: RootStackScreenProps<'ReminderList'>) {
  const {colors, spacing, isDark} = useTheme();
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const reminders = useAppSelector(state => state.reminders.reminders);

  const [activeFilter, setActiveFilter] = useState<'all' | ReminderType>('all');

  const filteredReminders =
    activeFilter === 'all'
      ? reminders
      : reminders.filter(r => r.type === activeFilter);

  const handleToggle = (reminder: Reminder) => {
    dispatch(toggleReminderEnabled(reminder.id));
    const updatedReminder = {...reminder, enabled: !reminder.enabled};
    ReminderService.schedule(updatedReminder);
  };

  return (
    <ScreenWrapper
      disableScroll={true}
      headerComponent={
        <HeaderNavigation
          label="Daily Reminders"
          onBack={() => navigation.goBack()}
        />
      }>
      <View style={styles.screenContainer}>
        {/* 1. FIXED TABS AT TOP */}
        <View
          style={[styles.fixedTabsContainer, {paddingHorizontal: spacing.md}]}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScroll}>
            {FILTER_TABS.map(tab => {
              const isSelected = activeFilter === tab.id;
              return (
                <TouchableOpacity
                  key={tab.id}
                  onPress={() => setActiveFilter(tab.id)}
                  activeOpacity={0.75}
                  style={[
                    styles.filterChip,
                    {
                      backgroundColor: isSelected
                        ? colors.primary
                        : colors.surface,
                      borderColor: isSelected ? colors.primary : colors.border,
                    },
                  ]}>
                  <EHText
                    variant="caption"
                    weight="700"
                    style={styles.chipText}
                    color={isSelected ? '#FFFFFF' : colors.textPrimary}>
                    {tab.emoji} {tab.label}
                  </EHText>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* 2. SCROLLABLE REMINDERS LIST */}
        {filteredReminders.length === 0 ? (
          <View style={[styles.emptyWrapper, {paddingHorizontal: spacing.md}]}>
            <EHCard style={styles.emptyCard} elevation="low">
              <View
                style={[
                  styles.emptyIconCircle,
                  {backgroundColor: colors.primaryLight},
                ]}>
                <Pill size={32} color={colors.primary} />
              </View>
              <EHText variant="heading2" weight="700" align="center">
                No reminders scheduled
              </EHText>
              <EHText
                variant="body"
                color={colors.textSecondary}
                align="center"
                style={styles.emptySubtitle}>
                Never miss your daily medicines, doctor appointments, or water
                hydration.
              </EHText>
            </EHCard>
          </View>
        ) : (
          <ScrollView
            style={styles.listScrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.listContent,
              {paddingHorizontal: spacing.md, paddingBottom: 16},
            ]}>
            {filteredReminders.map(reminder => {
              const displayTime = ReminderService.formatDisplayTime(
                reminder.time,
              );
              const emoji = ReminderService.getTypeEmoji(reminder.type);

              return (
                <EHCard
                  key={reminder.id}
                  style={[
                    styles.reminderCard,
                    !reminder.enabled && {opacity: 0.65},
                  ]}
                  elevation="low"
                  onPress={() =>
                    navigation.navigate('EditReminder', {
                      reminderId: reminder.id,
                    })
                  }>
                  <View style={styles.cardMainRow}>
                    {/* Category Emoji Circle */}
                    <View
                      style={[
                        styles.categoryCircle,
                        {
                          backgroundColor: reminder.enabled
                            ? colors.primaryLight
                            : isDark
                            ? 'rgba(255,255,255,0.08)'
                            : 'rgba(0,0,0,0.06)',
                        },
                      ]}>
                      <EHText style={styles.emojiText}>{emoji}</EHText>
                    </View>

                    {/* Reminder Details */}
                    <View style={styles.detailsCol}>
                      <EHText variant="body" weight="700" numberOfLines={1}>
                        {reminder.title}
                      </EHText>

                      <View style={styles.timeBadgeRow}>
                        <Clock size={14} color={colors.primary} />
                        <EHText
                          variant="caption"
                          weight="700"
                          color={colors.primary}>
                          {displayTime}
                        </EHText>
                        <EHText
                          variant="caption"
                          color={colors.textSecondary}>
                          • {reminder.recurring ? 'Every Day' : 'Once'}
                        </EHText>
                      </View>

                      {reminder.description ? (
                        <EHText
                          variant="caption"
                          color={colors.textMuted}
                          numberOfLines={1}>
                          {reminder.description}
                        </EHText>
                      ) : null}
                    </View>

                    {/* Enable / Disable Switch */}
                    <Switch
                      value={reminder.enabled}
                      onValueChange={() => handleToggle(reminder)}
                      trackColor={{
                        false: isDark ? '#334155' : '#CBD5E1',
                        true: colors.primary,
                      }}
                      thumbColor="#FFFFFF"
                    />
                  </View>
                </EHCard>
              );
            })}
          </ScrollView>
        )}

        {/* 3. FIXED BOTTOM BUTTON WITH SAFE AREA */}
        <View
          style={[
            styles.fixedBottomBar,
            {
              paddingHorizontal: spacing.md,
              paddingBottom: Math.max(insets.bottom, 16),
              backgroundColor: colors.background,
              borderColor: colors.border,
            },
          ]}>
          <EHButton
            label="+ Add New Reminder"
            variant="primary"
            onPress={() => navigation.navigate('AddReminder')}
            style={styles.addBtn}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  fixedTabsContainer: {
    paddingVertical: 8,
  },
  filterScroll: {
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipText: {
    fontSize: 13,
    lineHeight: 16,
  },
  listScrollView: {
    flex: 1,
  },
  listContent: {
    gap: 10,
    paddingTop: 4,
  },
  reminderCard: {
    padding: 16,
    borderRadius: 16,
  },
  cardMainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  categoryCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emojiText: {
    fontSize: 22,
  },
  detailsCol: {
    flex: 1,
    gap: 4,
  },
  timeBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  emptyWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  emptyCard: {
    padding: 24,
    alignItems: 'center',
    gap: 12,
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  emptySubtitle: {
    marginBottom: 8,
  },
  fixedBottomBar: {
    paddingTop: 12,
    borderTopWidth: 1,
  },
  addBtn: {
    minHeight: 54,
  },
});

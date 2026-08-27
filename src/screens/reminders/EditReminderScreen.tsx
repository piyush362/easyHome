import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import {Check, Clock, Trash2} from 'lucide-react-native';
import type {RootStackScreenProps} from '../../navigation/types';
import {
  useAppDispatch,
  useAppSelector,
  updateReminder,
  removeReminder,
} from '../../store';
import {useTheme} from '../../theme';
import {
  ScreenWrapper,
  HeaderNavigation,
  EHText,
  EHCard,
  EHButton,
  EHSection,
} from '../../components';
import {Reminder, ReminderType, ReminderRecurrence} from '../../types/models';
import {ReminderService} from '../../services';

const REMINDER_TYPES: {type: ReminderType; label: string; emoji: string}[] = [
  {type: 'medicine', label: 'Medicine', emoji: '💊'},
  {type: 'doctor', label: 'Doctor', emoji: '🩺'},
  {type: 'water', label: 'Drink Water', emoji: '💧'},
  {type: 'exercise', label: 'Walk / Exercise', emoji: '🚶'},
  {type: 'family', label: 'Family Call', emoji: '❤️'},
  {type: 'event', label: 'General Task', emoji: '⏰'},
];

const PRESET_TIMES = [
  {id: '08:00', label: 'Morning', time: '8:00 AM'},
  {id: '13:00', label: 'Afternoon', time: '1:00 PM'},
  {id: '19:00', label: 'Evening', time: '7:00 PM'},
  {id: '21:00', label: 'Night', time: '9:00 PM'},
];

export default function EditReminderScreen({
  navigation,
  route,
}: RootStackScreenProps<'EditReminder'>) {
  const {reminderId} = route.params;
  const {colors, spacing, borderRadius, isDark} = useTheme();
  const dispatch = useAppDispatch();
  const reminders = useAppSelector(state => state.reminders.reminders);

  const existingReminder = reminders.find(r => r.id === reminderId);

  const [selectedType, setSelectedType] = useState<ReminderType>(
    existingReminder?.type || 'medicine',
  );
  const [title, setTitle] = useState(existingReminder?.title || '');
  const [description, setDescription] = useState(
    existingReminder?.description || '',
  );
  const [selectedTime, setSelectedTime] = useState(
    existingReminder?.time || '08:00',
  );
  const [recurring, setRecurring] = useState(
    existingReminder?.recurring ?? true,
  );
  const [recurrencePattern, setRecurrencePattern] =
    useState<ReminderRecurrence>(
      existingReminder?.recurringPattern || 'daily',
    );

  if (!existingReminder) {
    return (
      <ScreenWrapper
        headerComponent={
          <HeaderNavigation
            label="Edit Reminder"
            onBack={() => navigation.goBack()}
          />
        }>
        <View style={[styles.container, {padding: spacing.md}]}>
          <EHCard style={styles.formCard}>
            <EHText variant="body" align="center">
              Reminder not found.
            </EHText>
            <EHButton
              label="Go Back"
              variant="outline"
              onPress={() => navigation.goBack()}
              style={styles.marginTop12}
            />
          </EHCard>
        </View>
      </ScreenWrapper>
    );
  }

  const handleSave = async () => {
    const updated: Reminder = {
      ...existingReminder,
      type: selectedType,
      title: title.trim() || existingReminder.title,
      description: description.trim(),
      time: selectedTime,
      recurring,
      recurringPattern: recurring ? recurrencePattern : null,
    };

    dispatch(updateReminder(updated));
    await ReminderService.schedule(updated);
    navigation.goBack();
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Reminder',
      `Are you sure you want to delete "${existingReminder.title}"?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            dispatch(removeReminder(existingReminder.id));
            await ReminderService.cancel(existingReminder.id);
            navigation.goBack();
          },
        },
      ],
    );
  };

  return (
    <ScreenWrapper
      headerComponent={
        <HeaderNavigation
          label="Edit Reminder"
          onBack={() => navigation.goBack()}
          rightComponent={
            <TouchableOpacity
              onPress={handleDelete}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Delete reminder">
              <Trash2 size={22} color={colors.error} />
            </TouchableOpacity>
          }
        />
      }>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.container, {padding: spacing.md}]}>
        {/* 1. Category Selector */}
        <EHSection title="1. Reminder Category">
          <View style={styles.typesGrid}>
            {REMINDER_TYPES.map(item => {
              const isSelected = selectedType === item.type;
              return (
                <TouchableOpacity
                  key={item.type}
                  activeOpacity={0.8}
                  onPress={() => setSelectedType(item.type)}
                  style={[
                    styles.typeCard,
                    {
                      backgroundColor: isSelected
                        ? isDark
                          ? 'rgba(56, 189, 248, 0.15)'
                          : 'rgba(2, 132, 199, 0.1)'
                        : colors.surface,
                      borderColor: isSelected ? colors.primary : colors.border,
                      borderWidth: isSelected ? 2 : 1,
                      borderRadius: borderRadius.md,
                    },
                  ]}>
                  <EHText style={styles.typeEmoji}>{item.emoji}</EHText>
                  <EHText variant="body" weight="700" numberOfLines={1}>
                    {item.label}
                  </EHText>
                  {isSelected && (
                    <View
                      style={[
                        styles.activeCheck,
                        {backgroundColor: colors.primary},
                      ]}>
                      <Check size={12} color="#FFFFFF" />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </EHSection>

        {/* 2. Title & Details */}
        <EHSection title="2. Title & Note">
          <EHCard style={styles.formCard} elevation="low">
            <EHText variant="caption" color={colors.textSecondary} weight="700">
              REMINDER NAME
            </EHText>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="e.g., Blood Pressure Tablet"
              placeholderTextColor={colors.textMuted}
              style={[
                styles.textInput,
                {
                  color: colors.textPrimary,
                  borderColor: colors.border,
                  backgroundColor: colors.background,
                  borderRadius: borderRadius.md,
                },
              ]}
            />

            <EHText
              variant="caption"
              color={colors.textSecondary}
              weight="700"
              style={styles.marginTop12}>
              ADDITIONAL INSTRUCTIONS (OPTIONAL)
            </EHText>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="e.g., Take with water after breakfast"
              placeholderTextColor={colors.textMuted}
              style={[
                styles.textInput,
                {
                  color: colors.textPrimary,
                  borderColor: colors.border,
                  backgroundColor: colors.background,
                  borderRadius: borderRadius.md,
                },
              ]}
            />
          </EHCard>
        </EHSection>

        {/* 3. Schedule Time */}
        <EHSection title="3. Reminder Time">
          <EHCard style={styles.formCard} elevation="low">
            <View style={styles.presetTimeRow}>
              {PRESET_TIMES.map(preset => {
                const isSelected = selectedTime === preset.id;
                return (
                  <TouchableOpacity
                    key={preset.id}
                    onPress={() => setSelectedTime(preset.id)}
                    activeOpacity={0.8}
                    style={[
                      styles.presetTimeBtn,
                      {
                        backgroundColor: isSelected
                          ? colors.primary
                          : colors.surface,
                        borderColor: isSelected
                          ? colors.primary
                          : colors.border,
                        borderRadius: borderRadius.md,
                      },
                    ]}>
                    <Clock
                      size={16}
                      color={isSelected ? '#FFFFFF' : colors.primary}
                    />
                    <EHText
                      variant="caption"
                      weight="700"
                      color={isSelected ? '#FFFFFF' : colors.textPrimary}>
                      {preset.label}
                    </EHText>
                    <EHText
                      variant="caption"
                      weight="600"
                      color={isSelected ? '#FFFFFF' : colors.textSecondary}>
                      {preset.time}
                    </EHText>
                  </TouchableOpacity>
                );
              })}
            </View>
          </EHCard>
        </EHSection>

        {/* 4. Frequency */}
        <EHSection title="4. How Often?">
          <EHCard style={styles.formCard} elevation="low">
            <View style={styles.recurrenceRow}>
              <TouchableOpacity
                onPress={() => {
                  setRecurring(true);
                  setRecurrencePattern('daily');
                }}
                activeOpacity={0.8}
                style={[
                  styles.recurrenceBtn,
                  {
                    backgroundColor:
                      recurring && recurrencePattern === 'daily'
                        ? colors.primary
                        : colors.surface,
                    borderColor:
                      recurring && recurrencePattern === 'daily'
                        ? colors.primary
                        : colors.border,
                    borderRadius: borderRadius.md,
                  },
                ]}>
                <EHText
                  variant="body"
                  weight="700"
                  color={
                    recurring && recurrencePattern === 'daily'
                      ? '#FFFFFF'
                      : colors.textPrimary
                  }>
                  Every Day
                </EHText>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setRecurring(false);
                  setRecurrencePattern(null);
                }}
                activeOpacity={0.8}
                style={[
                  styles.recurrenceBtn,
                  {
                    backgroundColor: !recurring
                      ? colors.primary
                      : colors.surface,
                    borderColor: !recurring ? colors.primary : colors.border,
                    borderRadius: borderRadius.md,
                  },
                ]}>
                <EHText
                  variant="body"
                  weight="700"
                  color={!recurring ? '#FFFFFF' : colors.textPrimary}>
                  Just Once
                </EHText>
              </TouchableOpacity>
            </View>
          </EHCard>
        </EHSection>

        {/* 5. Save & Delete Actions */}
        <View style={styles.actionButtonsCol}>
          <EHButton
            label="Save Changes"
            variant="primary"
            onPress={handleSave}
            style={styles.saveBtn}
          />
          <EHButton
            label="Delete Reminder"
            icon={<Trash2 size={18} color={colors.error} />}
            variant="outline"
            onPress={handleDelete}
            style={styles.deleteBtn}
          />
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
    paddingBottom: 40,
  },
  typesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  typeCard: {
    width: '48%',
    flexGrow: 1,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    position: 'relative',
    minHeight: 80,
  },
  typeEmoji: {
    fontSize: 26,
  },
  activeCheck: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formCard: {
    padding: 16,
  },
  textInput: {
    height: 52,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 16,
    marginTop: 6,
  },
  marginTop12: {
    marginTop: 14,
  },
  presetTimeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  presetTimeBtn: {
    width: '48%',
    flexGrow: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    gap: 2,
  },
  recurrenceRow: {
    flexDirection: 'row',
    gap: 10,
  },
  recurrenceBtn: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  actionButtonsCol: {
    marginTop: 10,
    gap: 12,
  },
  saveBtn: {
    minHeight: 56,
  },
  deleteBtn: {
    minHeight: 52,
  },
});

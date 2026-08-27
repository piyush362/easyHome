import React from 'react';
import {View, StyleSheet, Alert, Image, TouchableOpacity} from 'react-native';
import {Pill} from 'lucide-react-native';
import {useTheme} from '../../../theme';
import {EHText, EHCard, EHButton} from '../../../components';
import {Reminder} from '../../../types/models';
import {ICONS} from '../../../assets';

export interface HomeUtilitiesSectionProps {
  reminder: Reminder | null;
  torchActive: boolean;
  onTorchToggle: () => void;
  onReminderDone?: () => void;
  onReminderPress?: () => void;
}

export function HomeUtilitiesSection({
  reminder,
  torchActive,
  onTorchToggle,
  onReminderDone,
  onReminderPress,
}: HomeUtilitiesSectionProps) {
  const {colors, borderRadius, isDark} = useTheme();

  const handleReminderDone = () => {
    if (onReminderDone) {
      onReminderDone();
    } else {
      Alert.alert('Reminder Marked Done', 'Great job taking care!');
    }
  };

  return (
    <EHCard style={styles.frostedContainer} elevation="low">
      {/* Frosted Container Header */}
      <View style={styles.headerRow}>
        <EHText variant="heading2" weight="700">
          Daily Utilities
        </EHText>
      </View>

      <View style={styles.utilitiesStack}>
        {/* Medication / Reminder Tile */}
        {reminder ? (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={onReminderPress}
            style={[
              styles.reminderTile,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderRadius: borderRadius.md,
              },
            ]}>
            <View
              style={[
                styles.reminderIconCircle,
                {backgroundColor: colors.primaryLight},
              ]}>
              <Pill size={24} color={colors.primary} />
            </View>
            <View style={styles.reminderTextCol}>
              <EHText variant="caption" color={colors.primary} weight="700">
                UPCOMING REMINDER
              </EHText>
              <EHText variant="body" weight="700" numberOfLines={1}>
                {reminder.title}
              </EHText>
              <EHText variant="caption" color={colors.textSecondary}>
                Scheduled for {reminder.time}
              </EHText>
            </View>
            <EHButton
              label="Done"
              variant="outline"
              onPress={handleReminderDone}
              style={styles.reminderDoneBtn}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={onReminderPress}
            style={[
              styles.reminderTile,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderRadius: borderRadius.md,
              },
            ]}>
            <View
              style={[
                styles.reminderIconCircle,
                {backgroundColor: colors.primaryLight},
              ]}>
              <Pill size={24} color={colors.primary} />
            </View>
            <View style={styles.reminderTextCol}>
              <EHText variant="body" weight="700">
                Daily Reminders
              </EHText>
              <EHText variant="caption" color={colors.textSecondary}>
                Tap to schedule medicines or water alerts
              </EHText>
            </View>
            <EHButton
              label="+ Add"
              variant="outline"
              onPress={onReminderPress || (() => {})}
              style={styles.reminderDoneBtn}
            />
          </TouchableOpacity>
        )}

        {/* Horizontal Flashlight / Torch Card */}
        <TouchableOpacity
          style={[
            styles.torchCard,
            {
              backgroundColor: torchActive
                ? isDark
                  ? 'rgba(234, 179, 8, 0.18)'
                  : '#FEF9C3'
                : colors.surface,
              borderColor: torchActive ? colors.warning : colors.border,
              borderRadius: borderRadius.md,
            },
          ]}
          onPress={onTorchToggle}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel={torchActive ? 'Turn Torch Off' : 'Turn Torch On'}>
          {/* Torch Icon */}
          <View style={styles.torchIconWrapper}>
            <Image
              source={torchActive ? ICONS.torchOn : ICONS.torchOff}
              style={styles.torchIconImg}
              resizeMode="contain"
            />
          </View>

          {/* Torch Text Info */}
          <View style={styles.torchTextCol}>
            <EHText variant="body" weight="700">
              {torchActive ? 'Torch ON' : 'Torch OFF'}
            </EHText>
            <EHText variant="caption" color={colors.textSecondary}>
              {torchActive
                ? 'Tap to turn off flashlight'
                : 'Tap to turn on flashlight'}
            </EHText>
          </View>

          {/* Status Indicator Badge */}
          <View
            style={[
              styles.torchStatusBadge,
              {
                backgroundColor: torchActive
                  ? colors.warning
                  : isDark
                  ? 'rgba(255,255,255,0.08)'
                  : 'rgba(0,0,0,0.06)',
              },
            ]}>
            <EHText
              variant="caption"
              weight="700"
              color={
                torchActive
                  ? '#000000'
                  : colors.textMuted
              }>
              {torchActive ? 'ON' : 'OFF'}
            </EHText>
          </View>
        </TouchableOpacity>
      </View>
    </EHCard>
  );
}

const styles = StyleSheet.create({
  frostedContainer: {
    padding: 16,
    borderRadius: 20,
    marginVertical: 6,
  },
  headerRow: {
    marginBottom: 12,
    paddingHorizontal: 2,
  },
  utilitiesStack: {
    gap: 12,
  },
  reminderTile: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderWidth: 1,
    minHeight: 68,
  },
  reminderIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  reminderTextCol: {
    flex: 1,
    gap: 2,
  },
  reminderDoneBtn: {
    minHeight: 38,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  torchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderWidth: 1.5,
    minHeight: 68,
  },
  torchIconWrapper: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  torchIconImg: {
    width: 40,
    height: 40,
  },
  torchTextCol: {
    flex: 1,
    gap: 2,
  },
  torchStatusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    minWidth: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

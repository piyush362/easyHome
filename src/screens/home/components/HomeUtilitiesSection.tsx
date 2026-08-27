import React from 'react';
import {View, StyleSheet, Alert} from 'react-native';
import {Pill, Flashlight} from 'lucide-react-native';
import {useTheme} from '../../../theme';
import {EHText, EHCard, EHButton, EHIconButton, EHSection} from '../../../components';
import {Reminder} from '../../../types/models';

export interface HomeUtilitiesSectionProps {
  reminder: Reminder;
  torchActive: boolean;
  onTorchToggle: () => void;
  onReminderDone?: () => void;
}

export function HomeUtilitiesSection({
  reminder,
  torchActive,
  onTorchToggle,
  onReminderDone,
}: HomeUtilitiesSectionProps) {
  const {colors} = useTheme();

  const handleReminderDone = () => {
    if (onReminderDone) {
      onReminderDone();
    } else {
      Alert.alert('Reminder Marked Done', 'Great job taking care!');
    }
  };

  return (
    <EHSection title="Daily Utilities">
      <View style={styles.utilitiesStack}>
        {/* Medication Card */}
        <EHCard style={styles.reminderCard} elevation="low">
          <View style={styles.reminderRow}>
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
              <EHText variant="body" weight="700">
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
          </View>
        </EHCard>

        {/* Torch Tile */}
        <EHIconButton
          icon={
            <Flashlight
              size={32}
              color={torchActive ? colors.warning : colors.textPrimary}
            />
          }
          label={torchActive ? 'Torch ON' : 'Torch OFF'}
          subtitle={torchActive ? 'Tap to turn off' : 'Tap to turn on'}
          backgroundColor={torchActive ? colors.warningLight : colors.surface}
          onPress={onTorchToggle}
        />
      </View>
    </EHSection>
  );
}

const styles = StyleSheet.create({
  utilitiesStack: {
    gap: 12,
  },
  reminderCard: {
    padding: 14,
  },
  reminderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reminderIconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  reminderTextCol: {
    flex: 1,
  },
  reminderDoneBtn: {
    minHeight: 40,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
});

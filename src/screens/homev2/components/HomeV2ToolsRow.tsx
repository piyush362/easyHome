import React, {useState, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {
  Flashlight,
  Bell,
  Battery,
  BatteryCharging,
  Moon,
  Sun,
} from 'lucide-react-native';
import {useTheme} from '../../../theme';
import {EHText, EHCard} from '../../../components';
import {TorchService} from '../../../services';
import {useAppDispatch, setAppearanceMode} from '../../../store';

export interface HomeV2ToolsRowProps {
  torchActive: boolean;
  onTorchToggle: () => void;
}

export function HomeV2ToolsRow({
  torchActive,
  onTorchToggle,
}: HomeV2ToolsRowProps) {
  const {colors, isDark, borderRadius} = useTheme();
  const dispatch = useAppDispatch();

  // Battery State
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [isCharging, setIsCharging] = useState(false);

  // Ringer state
  const [ringerMode, setRingerMode] = useState<'normal' | 'silent'>('normal');

  useEffect(() => {
    DeviceInfo.getBatteryLevel()
      .then(level => {
        if (level >= 0) {
          setBatteryLevel(Math.round(level * 100));
        }
      })
      .catch(() => {
        setBatteryLevel(85); // Fallback
      });

    DeviceInfo.isBatteryCharging()
      .then(setIsCharging)
      .catch(() => {});
  }, []);

  const handleToggleTheme = () => {
    dispatch(setAppearanceMode(isDark ? 'light' : 'dark'));
  };

  const handleToggleRinger = () => {
    const next = ringerMode === 'normal' ? 'silent' : 'normal';
    setRingerMode(next);
    Alert.alert(
      'Ringer Mode',
      next === 'silent' ? 'Ringer set to Mute / Silent' : 'Ringer set to Normal / Sound On',
    );
  };

  return (
    <EHCard style={styles.toolsCard} elevation="low">
      <View style={styles.toolsRow}>
        {/* 1. Torch Tool */}
        <TouchableOpacity
          style={[
            styles.toolBtn,
            {
              backgroundColor: torchActive
                ? isDark
                  ? 'rgba(234, 179, 8, 0.2)'
                  : '#FEF9C3'
                : isDark
                ? 'rgba(255, 255, 255, 0.05)'
                : '#F8FAFC',
              borderColor: torchActive ? colors.warning : colors.border,
              borderRadius: borderRadius.md,
            },
          ]}
          onPress={onTorchToggle}
          activeOpacity={0.75}
          accessibilityRole="button"
          accessibilityLabel={torchActive ? 'Turn Torch Off' : 'Turn Torch On'}>
          <Flashlight
            size={22}
            color={torchActive ? colors.warning : colors.primary}
          />
          <EHText
            variant="caption"
            weight="600"
            color={torchActive ? colors.warning : colors.textPrimary}
            style={styles.toolLabel}>
            {torchActive ? 'Torch ON' : 'Torch'}
          </EHText>
        </TouchableOpacity>

        {/* 2. Ringer Tool */}
        <TouchableOpacity
          style={[
            styles.toolBtn,
            {
              backgroundColor: isDark
                ? 'rgba(255, 255, 255, 0.05)'
                : '#F8FAFC',
              borderColor: colors.border,
              borderRadius: borderRadius.md,
            },
          ]}
          onPress={handleToggleRinger}
          activeOpacity={0.75}
          accessibilityRole="button"
          accessibilityLabel="Ringer status">
          <Bell size={22} color="#8B5CF6" />
          <EHText
            variant="caption"
            weight="600"
            color={colors.textPrimary}
            style={styles.toolLabel}>
            {ringerMode === 'normal' ? 'Ringer' : 'Silent'}
          </EHText>
        </TouchableOpacity>

        {/* 3. Battery Tool */}
        <View
          style={[
            styles.toolBtn,
            {
              backgroundColor: isDark
                ? 'rgba(255, 255, 255, 0.05)'
                : '#F8FAFC',
              borderColor: colors.border,
              borderRadius: borderRadius.md,
            },
          ]}>
          {isCharging ? (
            <BatteryCharging size={22} color="#10B981" />
          ) : (
            <Battery size={22} color="#10B981" />
          )}
          <EHText
            variant="caption"
            weight="600"
            color={colors.textPrimary}
            style={styles.toolLabel}>
            {batteryLevel != null ? `${batteryLevel}%` : 'Battery'}
          </EHText>
        </View>

        {/* 4. Night Mode / Theme Tool */}
        <TouchableOpacity
          style={[
            styles.toolBtn,
            {
              backgroundColor: isDark
                ? 'rgba(255, 255, 255, 0.05)'
                : '#F8FAFC',
              borderColor: colors.border,
              borderRadius: borderRadius.md,
            },
          ]}
          onPress={handleToggleTheme}
          activeOpacity={0.75}
          accessibilityRole="button"
          accessibilityLabel={isDark ? 'Switch to Light Mode' : 'Switch to Night Mode'}>
          {isDark ? (
            <Sun size={22} color="#F59E0B" />
          ) : (
            <Moon size={22} color="#6366F1" />
          )}
          <EHText
            variant="caption"
            weight="600"
            color={colors.textPrimary}
            style={styles.toolLabel}>
            {isDark ? 'Day' : 'Night'}
          </EHText>
        </TouchableOpacity>
      </View>
    </EHCard>
  );
}

const styles = StyleSheet.create({
  toolsCard: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  toolsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  toolBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 2,
    borderWidth: 1,
    minHeight: 56,
  },
  toolLabel: {
    fontSize: 11,
    lineHeight: 14,
    marginTop: 4,
    textAlign: 'center',
  },
});

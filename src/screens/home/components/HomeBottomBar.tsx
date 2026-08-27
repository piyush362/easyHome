import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {LayoutGrid, Settings} from 'lucide-react-native';
import {useTheme} from '../../../theme';
import {EHText} from '../../../components';

export interface HomeBottomBarProps {
  onOpenDrawer: () => void;
  onOpenSettings: () => void;
}

export function HomeBottomBar({
  onOpenDrawer,
  onOpenSettings,
}: HomeBottomBarProps) {
  const {colors, borderRadius} = useTheme();

  return (
    <View style={styles.bottomBar}>
      <TouchableOpacity
        style={[
          styles.bottomBarBtn,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderRadius: borderRadius.lg,
          },
        ]}
        onPress={onOpenDrawer}
        activeOpacity={0.75}
        accessibilityRole="button"
        accessibilityLabel="All Apps">
        <LayoutGrid
          size={28}
          color={colors.primary}
          style={styles.bottomBarIcon}
        />
        <EHText variant="body" weight="700">
          All Apps
        </EHText>
        <EHText variant="caption" color={colors.textSecondary}>
          Swipe up or tap
        </EHText>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.bottomBarBtn,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderRadius: borderRadius.lg,
          },
        ]}
        onPress={onOpenSettings}
        activeOpacity={0.75}
        accessibilityRole="button"
        accessibilityLabel="Settings">
        <Settings
          size={28}
          color={colors.primary}
          style={styles.bottomBarIcon}
        />
        <EHText variant="body" weight="700">
          Settings
        </EHText>
        <EHText variant="caption" color={colors.textSecondary}>
          Theme & layout
        </EHText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomBar: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  bottomBarBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderWidth: 1,
  },
  bottomBarIcon: {
    marginBottom: 6,
  },
});

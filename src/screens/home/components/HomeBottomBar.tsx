import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {LayoutGrid, Settings} from 'lucide-react-native';
import {useTheme} from '../../../theme';
import {EHText, EHCard} from '../../../components';

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
    <EHCard style={styles.frostedContainer} elevation="low">
      <View style={styles.bottomBarRow}>
        <TouchableOpacity
          style={[
            styles.bottomBarBtn,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderRadius: borderRadius.md,
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
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.bottomBarBtn,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderRadius: borderRadius.md,
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
        </TouchableOpacity>
      </View>
    </EHCard>
  );
}

const styles = StyleSheet.create({
  frostedContainer: {
    padding: 12,
    borderRadius: 20,
    marginVertical: 6,
  },
  bottomBarRow: {
    flexDirection: 'row',
    gap: 12,
  },
  bottomBarBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderWidth: 1,
    minHeight: 80,
  },
  bottomBarIcon: {
    marginBottom: 6,
  },
});

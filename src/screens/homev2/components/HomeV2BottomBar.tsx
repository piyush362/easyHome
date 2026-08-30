import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Star, Home, LayoutGrid, Settings} from 'lucide-react-native';
import {useTheme} from '../../../theme';
import {EHText} from '../../../components';

export type HomeV2BottomTab = 'fav' | 'home' | 'apps' | 'settings';

export interface HomeV2BottomBarProps {
  activeTab: HomeV2BottomTab;
  onTabChange: (tab: HomeV2BottomTab) => void;
}

export function HomeV2BottomBar({
  activeTab,
  onTabChange,
}: HomeV2BottomBarProps) {
  const {colors, isDark} = useTheme();
  const insets = useSafeAreaInsets();

  // Bottom margin respects safe area on Android navigation gestures & iOS home bar
  const bottomMargin = Math.max(insets.bottom, 12);

  const tabs: Array<{
    id: HomeV2BottomTab;
    label: string;
    icon: (isActive: boolean) => React.ReactNode;
  }> = [
    {
      id: 'fav',
      label: 'Favourites',
      icon: isActive => (
        <Star
          size={22}
          color={isActive ? colors.primary : colors.textMuted}
          fill={isActive ? colors.primary : 'transparent'}
        />
      ),
    },
    {
      id: 'home',
      label: 'Home',
      icon: isActive => (
        <Home
          size={22}
          color={isActive ? colors.primary : colors.textMuted}
        />
      ),
    },
    {
      id: 'apps',
      label: 'Apps',
      icon: isActive => (
        <LayoutGrid
          size={22}
          color={isActive ? colors.primary : colors.textMuted}
        />
      ),
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: isActive => (
        <Settings
          size={22}
          color={isActive ? colors.primary : colors.textMuted}
        />
      ),
    },
  ];

  return (
    <View
      style={[
        styles.outerWrapper,
        {
          paddingBottom: Math.max(insets.bottom, 8),
          paddingTop: 4,
        },
      ]}>
      {/* iOS Glass Capsule Dock */}
      <View
        style={[
          styles.dockContainer,
          {
            backgroundColor: isDark
              ? 'rgba(30, 41, 59, 0.94)'
              : 'rgba(255, 255, 255, 0.94)',
            borderColor: isDark
              ? 'rgba(255, 255, 255, 0.18)'
              : 'rgba(0, 0, 0, 0.08)',
          },
        ]}>
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tabBtn,
                isActive && [
                  styles.activeTabCapsule,
                  {
                    backgroundColor: isDark
                      ? 'rgba(99, 102, 241, 0.22)'
                      : 'rgba(99, 102, 241, 0.12)',
                  },
                ],
              ]}
              onPress={() => onTabChange(tab.id)}
              activeOpacity={0.7}
              accessibilityRole="tab"
              accessibilityState={{selected: isActive}}
              accessibilityLabel={tab.label}>
              <View style={styles.iconBox}>{tab.icon(isActive)}</View>
              <EHText
                variant="caption"
                weight={isActive ? '700' : '500'}
                color={isActive ? colors.primary : colors.textSecondary}
                style={styles.tabLabel}>
                {tab.label}
              </EHText>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  dockContainer: {
    width: '100%',
    maxWidth: 420,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 36,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: {width: 0, height: 6},
        shadowOpacity: 0.15,
        shadowRadius: 14,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  tabBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderRadius: 24,
    minHeight: 52,
  },
  activeTabCapsule: {
    borderRadius: 24,
  },
  iconBox: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  tabLabel: {
    fontSize: 11,
    lineHeight: 13,
  },
});

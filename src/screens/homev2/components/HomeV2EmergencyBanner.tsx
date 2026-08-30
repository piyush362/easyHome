import React from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import {PhoneCall, ChevronRight} from 'lucide-react-native';
import {EHText} from '../../../components';

export interface HomeV2EmergencyBannerProps {
  onPress: () => void;
}

export function HomeV2EmergencyBanner({onPress}: HomeV2EmergencyBannerProps) {
  return (
    <TouchableOpacity
      style={styles.bannerContainer}
      onPress={onPress}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityLabel="Emergency call">
      <View style={styles.iconCircle}>
        <PhoneCall size={16} color="#DC2626" />
      </View>
      <View style={styles.textCol}>
        <EHText variant="caption" weight="800" color="#FFFFFF" style={styles.titleText}>
          EMERGENCY CALL
        </EHText>
        <EHText variant="caption" color="rgba(255, 255, 255, 0.85)" style={styles.subText}>
          Tap to trigger SOS call
        </EHText>
      </View>
      <ChevronRight size={18} color="#FFFFFF" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  bannerContainer: {
    backgroundColor: '#DC2626',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    shadowColor: '#DC2626',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  iconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  textCol: {
    flex: 1,
    gap: 1,
  },
  titleText: {
    fontSize: 12,
    lineHeight: 14,
  },
  subText: {
    fontSize: 10,
    lineHeight: 12,
  },
});

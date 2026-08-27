import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Camera, User, Video} from 'lucide-react-native';
import {useTheme} from '../../../theme';
import {EHText, EHCard, EHIconButton} from '../../../components';

export interface HomeCameraSectionProps {
  onCameraAction: (mode: 'Photo' | 'Selfie' | 'Video') => void;
}

export function HomeCameraSection({onCameraAction}: HomeCameraSectionProps) {
  const {colors} = useTheme();

  return (
    <EHCard style={styles.frostedContainer} elevation="low">
      {/* Frosted Container Header */}
      <View style={styles.headerRow}>
        <EHText variant="heading2" weight="700">
          Camera & Photos
        </EHText>
      </View>

      {/* 3-Button Grid */}
      <View style={styles.grid3}>
        <EHIconButton
          icon={<Camera size={28} color={colors.primary} />}
          label="Photo"
          subtitle="Camera"
          onPress={() => onCameraAction('Photo')}
          style={styles.grid3Item}
        />
        <EHIconButton
          icon={<User size={28} color={colors.primary} />}
          label="Selfie"
          subtitle="Front Camera"
          onPress={() => onCameraAction('Selfie')}
          style={styles.grid3Item}
        />
        <EHIconButton
          icon={<Video size={28} color={colors.primary} />}
          label="Video"
          subtitle="Record"
          onPress={() => onCameraAction('Video')}
          style={styles.grid3Item}
        />
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
  grid3: {
    flexDirection: 'row',
    gap: 8,
  },
  grid3Item: {
    flex: 1,
    paddingHorizontal: 4,
  },
});

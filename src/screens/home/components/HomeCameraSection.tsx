import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Camera, User, Video} from 'lucide-react-native';
import {useTheme} from '../../../theme';
import {EHIconButton, EHSection} from '../../../components';

export interface HomeCameraSectionProps {
  onCameraAction: (mode: 'Photo' | 'Selfie' | 'Video') => void;
}

export function HomeCameraSection({onCameraAction}: HomeCameraSectionProps) {
  const {colors} = useTheme();

  return (
    <EHSection title="Camera & Photos">
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
    </EHSection>
  );
}

const styles = StyleSheet.create({
  grid3: {
    flexDirection: 'row',
    gap: 8,
  },
  grid3Item: {
    flex: 1,
    paddingHorizontal: 4,
  },
});

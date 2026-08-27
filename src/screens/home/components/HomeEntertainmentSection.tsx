import React from 'react';
import {View, StyleSheet} from 'react-native';
import {PlaySquare, Image as ImageIcon} from 'lucide-react-native';
import {useTheme} from '../../../theme';
import {EHIconButton, EHSection} from '../../../components';

export interface HomeEntertainmentSectionProps {
  onEntertainmentAction: (name: 'YouTube' | 'Gallery') => void;
}

export function HomeEntertainmentSection({
  onEntertainmentAction,
}: HomeEntertainmentSectionProps) {
  const {colors} = useTheme();

  return (
    <EHSection title="Entertainment">
      <View style={styles.grid2}>
        <EHIconButton
          icon={<PlaySquare size={32} color={colors.primary} />}
          label="YouTube"
          subtitle="Videos & Music"
          onPress={() => onEntertainmentAction('YouTube')}
        />
        <EHIconButton
          icon={<ImageIcon size={32} color={colors.primary} />}
          label="Photos"
          subtitle="My Gallery"
          onPress={() => onEntertainmentAction('Gallery')}
        />
      </View>
    </EHSection>
  );
}

const styles = StyleSheet.create({
  grid2: {
    flexDirection: 'row',
    gap: 12,
  },
});

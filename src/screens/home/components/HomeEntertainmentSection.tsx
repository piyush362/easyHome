import React from 'react';
import {View, StyleSheet} from 'react-native';
import {PlaySquare, Image as ImageIcon} from 'lucide-react-native';
import {useTheme} from '../../../theme';
import {EHText, EHCard, EHIconButton} from '../../../components';

export interface HomeEntertainmentSectionProps {
  onEntertainmentAction: (name: 'YouTube' | 'Gallery') => void;
}

export function HomeEntertainmentSection({
  onEntertainmentAction,
}: HomeEntertainmentSectionProps) {
  const {colors} = useTheme();

  return (
    <EHCard style={styles.frostedContainer} elevation="low">
      {/* Frosted Container Header */}
      <View style={styles.headerRow}>
        <EHText variant="heading2" weight="700">
          Entertainment
        </EHText>
      </View>

      {/* 2-Button Grid */}
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
  grid2: {
    flexDirection: 'row',
    gap: 12,
  },
});

import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Phone, MessageCircle} from 'lucide-react-native';
import {useTheme} from '../../../theme';
import {EHText, EHCard, EHIconButton} from '../../../components';

export interface HomeQuickCommSectionProps {
  onOpenPhone: () => void;
  onOpenWhatsApp: () => void;
}

export function HomeQuickCommSection({
  onOpenPhone,
  onOpenWhatsApp,
}: HomeQuickCommSectionProps) {
  const {colors} = useTheme();

  return (
    <EHCard style={styles.frostedContainer} elevation="low">
      {/* Frosted Container Header */}
      <View style={styles.headerRow}>
        <EHText variant="heading2" weight="700">
          Quick Actions
        </EHText>
      </View>

      {/* 2-Button Grid */}
      <View style={styles.grid2}>
        <EHIconButton
          icon={<Phone size={32} color={colors.primary} />}
          label="Phone"
          subtitle="Open phone app"
          onPress={onOpenPhone}
        />
        <EHIconButton
          icon={<MessageCircle size={32} color={colors.primary} />}
          label="WhatsApp"
          subtitle="Open WhatsApp"
          onPress={onOpenWhatsApp}
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

import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Phone, MessageCircle} from 'lucide-react-native';
import {useTheme} from '../../../theme';
import {EHIconButton, EHSection} from '../../../components';

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
    <EHSection title="Quick Communication">
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
    </EHSection>
  );
}

const styles = StyleSheet.create({
  grid2: {
    flexDirection: 'row',
    gap: 12,
  },
});

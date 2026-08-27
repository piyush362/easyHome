import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Phone, MessageCircle, Video} from 'lucide-react-native';
import {useTheme} from '../../../theme';
import {EHButton, EHBottomSheet} from '../../../components';
import {FamilyMember} from '../../../types/models';

export interface HomeContactSheetProps {
  member: FamilyMember | null;
  onClose: () => void;
  onCall: (member: FamilyMember) => void;
  onWhatsApp: (member: FamilyMember) => void;
  onVideoCall: (member: FamilyMember) => void;
}

export function HomeContactSheet({
  member,
  onClose,
  onCall,
  onWhatsApp,
  onVideoCall,
}: HomeContactSheetProps) {
  const {colors} = useTheme();

  return (
    <EHBottomSheet
      visible={!!member}
      onClose={onClose}
      height="auto"
      scrollable={false}
      title={
        member
          ? `Connect with ${member.name}`
          : 'Connect'
      }
      subtitle={
        member ? `${member.relationship} • ${member.phoneNumber}` : undefined
      }>
      {member ? (
        <View style={styles.sheetContent}>
          <EHButton
            label="Normal Phone Call"
            icon={<Phone size={18} color="#FFFFFF" />}
            variant="primary"
            onPress={() => onCall(member)}
            style={styles.sheetBtn}
          />
          <EHButton
            label="WhatsApp Message"
            icon={<MessageCircle size={18} color={colors.primary} />}
            variant="secondary"
            onPress={() => onWhatsApp(member)}
            style={styles.sheetBtn}
          />
          <EHButton
            label="Video Call"
            icon={<Video size={18} color={colors.primary} />}
            variant="outline"
            onPress={() => onVideoCall(member)}
            style={styles.sheetBtn}
          />
          <EHButton
            label="Cancel"
            variant="ghost"
            onPress={onClose}
            style={styles.sheetBtn}
          />
        </View>
      ) : null}
    </EHBottomSheet>
  );
}

const styles = StyleSheet.create({
  sheetContent: {
    gap: 12,
  },
  sheetBtn: {
    minHeight: 50,
  },
});

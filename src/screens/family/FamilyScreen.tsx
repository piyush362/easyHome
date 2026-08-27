import React, {useState} from 'react';
import {View, StyleSheet, Alert} from 'react-native';
import {Heart, Phone, MessageCircle, Video, Star, Plus} from 'lucide-react-native';
import type {RootStackScreenProps} from '../../navigation/types';
import {useAppSelector} from '../../store';
import {useTheme} from '../../theme';
import {
  ScreenWrapper,
  HeaderNavigation,
  EHText,
  EHCard,
  EHAvatar,
  EHButton,
  EHBottomSheet,
} from '../../components';
import {FamilyMember} from '../../types/models';

export default function FamilyScreen({
  navigation,
}: RootStackScreenProps<'Family'>) {
  const {colors, spacing, isDark} = useTheme();
  const familyMembers = useAppSelector(state => state.family.members);
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);

  const handleCall = (member: FamilyMember) => {
    setSelectedMember(null);
    Alert.alert('Calling ' + member.name, `Dialing ${member.phoneNumber}...`);
  };

  const handleWhatsApp = (member: FamilyMember) => {
    setSelectedMember(null);
    Alert.alert('WhatsApp with ' + member.name, `Opening WhatsApp chat...`);
  };

  const handleVideo = (member: FamilyMember) => {
    setSelectedMember(null);
    Alert.alert('Video Call with ' + member.name, `Starting video call...`);
  };

  return (
    <ScreenWrapper
      headerComponent={
        <HeaderNavigation
          label="Family Contacts"
          subtitle={`${familyMembers.length} loved ones configured`}
          onBack={() => navigation.goBack()}
        />
      }>
      <View style={[styles.container, {padding: spacing.md}]}>
        {familyMembers.map((member, index) => (
          <EHCard
            key={member.id}
            style={styles.memberCard}
            onPress={() => setSelectedMember(member)}
            elevation="low">
            <View style={styles.cardRow}>
              <View style={styles.avatarWrapper}>
                <EHAvatar source={member.photo} name={member.name} size={58} />
                {index === 0 && (
                  <View
                    style={[
                      styles.starBadge,
                      {backgroundColor: colors.primary},
                    ]}>
                    <Star size={12} color="#FFFFFF" fill="#FFFFFF" />
                  </View>
                )}
              </View>

              <View style={styles.memberInfo}>
                <EHText variant="heading2" weight="700">
                  {member.name}
                </EHText>
                <EHText variant="caption" color={colors.textSecondary}>
                  {member.relationship} • {member.phoneNumber}
                </EHText>
              </View>

              <View style={styles.actionRow}>
                <EHButton
                  label=""
                  icon={<Phone size={18} color="#FFFFFF" />}
                  variant="primary"
                  onPress={() => handleCall(member)}
                  style={styles.quickActionBtn}
                />
                <EHButton
                  label=""
                  icon={<MessageCircle size={18} color={colors.primary} />}
                  variant="secondary"
                  onPress={() => handleWhatsApp(member)}
                  style={styles.quickActionBtn}
                />
              </View>
            </View>
          </EHCard>
        ))}

        {/* Add New Contact Hint */}
        <EHButton
          label="Add or Edit Contacts in Setup Wizard"
          icon={<Plus size={18} color={colors.primary} />}
          variant="outline"
          onPress={() => navigation.navigate('FamilySetup')}
          style={styles.addBtn}
        />
      </View>

      {/* Communication Bottom Sheet */}
      <EHBottomSheet
        visible={!!selectedMember}
        onClose={() => setSelectedMember(null)}
        title={
          selectedMember
            ? `Connect with ${selectedMember.name}`
            : 'Connect'
        }>
        {selectedMember && (
          <View style={styles.sheetContent}>
            <EHButton
              label={`Call ${selectedMember.phoneNumber}`}
              icon={<Phone size={20} color="#FFFFFF" />}
              variant="primary"
              onPress={() => handleCall(selectedMember)}
              style={styles.sheetBtn}
            />
            <EHButton
              label="WhatsApp Chat"
              icon={<MessageCircle size={20} color={colors.primary} />}
              variant="secondary"
              onPress={() => handleWhatsApp(selectedMember)}
              style={styles.sheetBtn}
            />
            <EHButton
              label="Video Call"
              icon={<Video size={20} color={colors.primary} />}
              variant="outline"
              onPress={() => handleVideo(selectedMember)}
              style={styles.sheetBtn}
            />
            <EHButton
              label="Cancel"
              variant="ghost"
              onPress={() => setSelectedMember(null)}
              style={styles.sheetBtn}
            />
          </View>
        )}
      </EHBottomSheet>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  memberCard: {
    padding: 14,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: 14,
  },
  starBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberInfo: {
    flex: 1,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  quickActionBtn: {
    minHeight: 42,
    width: 42,
    paddingHorizontal: 0,
    borderRadius: 21,
  },
  addBtn: {
    marginTop: 16,
    minHeight: 52,
  },
  sheetContent: {
    gap: 12,
  },
  sheetBtn: {
    minHeight: 52,
  },
});

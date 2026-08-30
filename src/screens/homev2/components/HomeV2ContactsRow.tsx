import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {Star, Plus, UserPlus} from 'lucide-react-native';
import {useTheme} from '../../../theme';
import {EHText, EHCard, EHAvatar} from '../../../components';
import {FamilyMember} from '../../../types/models';

export interface HomeV2ContactsRowProps {
  familyMembers: FamilyMember[];
  onSelectMember: (member: FamilyMember) => void;
  onAddContact: () => void;
}

export function HomeV2ContactsRow({
  familyMembers,
  onSelectMember,
  onAddContact,
}: HomeV2ContactsRowProps) {
  const {colors, borderRadius, isDark} = useTheme();

  return (
    <EHCard style={styles.contactsCard} elevation="low">
      {/* Section Header */}
      <View style={styles.headerRow}>
        <EHText variant="heading2" weight="600">
          Quick Contacts
        </EHText>
        <TouchableOpacity
          onPress={onAddContact}
          activeOpacity={0.7}
          style={styles.addBtnHeader}
          accessibilityRole="button">
          <EHText variant="caption" color={colors.primary} weight="600">
            {familyMembers.length > 0 ? '+ Add' : 'Setup'}
          </EHText>
        </TouchableOpacity>
      </View>

      {/* Horizontal Scroll List */}
      {familyMembers.length === 0 ? (
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={onAddContact}
          style={[
            styles.emptyRow,
            {
              backgroundColor: isDark
                ? 'rgba(255, 255, 255, 0.04)'
                : 'rgba(0, 0, 0, 0.03)',
              borderColor: colors.border,
              borderRadius: borderRadius.md,
            },
          ]}>
          <View
            style={[
              styles.emptyIconCircle,
              {backgroundColor: colors.primaryLight},
            ]}>
            <UserPlus size={22} color={colors.primary} />
          </View>
          <View style={styles.emptyTextCol}>
            <EHText variant="body" weight="600">
              Add favorite family contacts
            </EHText>
            <EHText variant="caption" color={colors.textSecondary}>
              Tap to add loved ones for 1-tap calling
            </EHText>
          </View>
        </TouchableOpacity>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          {familyMembers.map((member, index) => (
            <TouchableOpacity
              key={member.id}
              activeOpacity={0.8}
              onPress={() => onSelectMember(member)}
              style={styles.contactItem}
              accessibilityRole="button"
              accessibilityLabel={`Call ${member.name}`}>
              <View style={styles.avatarWrapper}>
                <EHAvatar source={member.photo} name={member.name} size={54} />
                {index === 0 && (
                  <View
                    style={[
                      styles.starBadge,
                      {backgroundColor: colors.primary},
                    ]}>
                    <Star size={9} color="#FFFFFF" fill="#FFFFFF" />
                  </View>
                )}
              </View>
              <EHText
                variant="caption"
                weight="600"
                numberOfLines={1}
                style={styles.contactName}>
                {member.name}
              </EHText>
            </TouchableOpacity>
          ))}

          {/* "+ Add" circle at the end */}
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={onAddContact}
            style={styles.addCircleItem}
            accessibilityRole="button"
            accessibilityLabel="Add another contact">
            <View
              style={[
                styles.addCircle,
                {
                  borderColor: colors.primary,
                  backgroundColor: isDark
                    ? 'rgba(99, 102, 241, 0.12)'
                    : 'rgba(99, 102, 241, 0.08)',
                },
              ]}>
              <Plus size={22} color={colors.primary} />
            </View>
            <EHText
              variant="caption"
              weight="600"
              color={colors.primary}
              style={styles.contactName}>
              Add
            </EHText>
          </TouchableOpacity>
        </ScrollView>
      )}
    </EHCard>
  );
}

const styles = StyleSheet.create({
  contactsCard: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
    paddingHorizontal: 2,
  },
  addBtnHeader: {
    paddingVertical: 1,
    paddingHorizontal: 4,
  },
  scrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 2,
    paddingHorizontal: 2,
  },
  contactItem: {
    alignItems: 'center',
    width: 60,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 4,
  },
  starBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  contactName: {
    fontSize: 11,
    lineHeight: 14,
    textAlign: 'center',
    width: '100%',
  },
  addCircleItem: {
    alignItems: 'center',
    width: 60,
  },
  addCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  emptyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    gap: 12,
  },
  emptyIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTextCol: {
    flex: 1,
    gap: 2,
  },
});

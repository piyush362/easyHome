import React from 'react';
import {View, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import {Star, UserPlus, Plus, ChevronRight} from 'lucide-react-native';
import {useTheme} from '../../../theme';
import {EHText, EHCard, EHAvatar, EHButton} from '../../../components';
import {FamilyMember} from '../../../types/models';

export interface HomeFamilySectionProps {
  familyMembers: FamilyMember[];
  onSelectMember: (member: FamilyMember) => void;
  onSeeAll: () => void;
}

export function HomeFamilySection({
  familyMembers,
  onSelectMember,
  onSeeAll,
}: HomeFamilySectionProps) {
  const {colors, borderRadius} = useTheme();

  return (
    <EHCard style={styles.frostedContainer} elevation="low">
      {/* Frosted Container Header */}
      <View style={styles.headerRow}>
        <EHText variant="heading2" weight="700">
          Family Contacts
        </EHText>
        <TouchableOpacity
          onPress={onSeeAll}
          activeOpacity={0.7}
          style={styles.actionLink}
          accessibilityRole="button">
          <EHText variant="body" color={colors.primary} weight="600">
            {familyMembers.length > 0 ? 'See All' : '+ Add'}
          </EHText>
          {familyMembers.length > 0 && (
            <ChevronRight size={18} color={colors.primary} />
          )}
        </TouchableOpacity>
      </View>

      {/* Content */}
      {familyMembers.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View
            style={[
              styles.emptyIconCircle,
              {backgroundColor: colors.primaryLight},
            ]}>
            <UserPlus size={26} color={colors.primary} />
          </View>
          <View style={styles.emptyTextCol}>
            <EHText variant="body" weight="700">
              No family members added
            </EHText>
            <EHText variant="caption" color={colors.textSecondary}>
              Add loved ones for quick 1-tap dial
            </EHText>
          </View>
          <EHButton
            label="Add"
            icon={<Plus size={16} color="#FFFFFF" />}
            variant="primary"
            onPress={onSeeAll}
            style={styles.emptyAddBtn}
          />
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.familyScroll}>
          {familyMembers.map((member, index) => (
            <TouchableOpacity
              key={member.id}
              activeOpacity={0.8}
              onPress={() => onSelectMember(member)}
              style={[
                styles.familyCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  borderRadius: borderRadius.md,
                },
              ]}>
              <View style={styles.avatarWrapper}>
                <EHAvatar source={member.photo} name={member.name} size={58} />
                {index === 0 && (
                  <View
                    style={[
                      styles.starBadge,
                      {backgroundColor: colors.primary},
                    ]}>
                    <Star size={10} color="#FFFFFF" fill="#FFFFFF" />
                  </View>
                )}
              </View>

              <EHText
                variant="body"
                weight="700"
                numberOfLines={1}
                style={styles.familyName}>
                {member.name}
              </EHText>

              <EHText
                variant="caption"
                color={colors.textSecondary}
                numberOfLines={1}>
                {member.relationship}
              </EHText>
            </TouchableOpacity>
          ))}

          {/* Add more card at the end of horizontal list */}
          <TouchableOpacity
            style={[
              styles.addMoreCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderRadius: borderRadius.md,
              },
            ]}
            onPress={onSeeAll}
            activeOpacity={0.75}
            accessibilityRole="button"
            accessibilityLabel="Add more loved ones">
            <View
              style={[
                styles.addMoreIconCircle,
                {backgroundColor: colors.primaryLight},
              ]}>
              <Plus size={22} color={colors.primary} />
            </View>
            <EHText variant="caption" weight="700" style={styles.addMoreText}>
              Add
            </EHText>
          </TouchableOpacity>
        </ScrollView>
      )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 2,
  },
  actionLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  familyScroll: {
    paddingVertical: 2,
    gap: 10,
  },
  familyCard: {
    width: 110,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderWidth: 1,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 6,
  },
  starBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  familyName: {
    marginTop: 2,
    textAlign: 'center',
  },
  emptyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  emptyIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  emptyTextCol: {
    flex: 1,
    marginRight: 8,
  },
  emptyAddBtn: {
    minHeight: 38,
    paddingHorizontal: 14,
  },
  addMoreCard: {
    width: 90,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  addMoreIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  addMoreText: {
    textAlign: 'center',
  },
});

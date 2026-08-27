import React from 'react';
import {View, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import {Star, UserPlus, Plus} from 'lucide-react-native';
import {useTheme} from '../../../theme';
import {EHText, EHCard, EHAvatar, EHSection, EHButton} from '../../../components';
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
    <EHSection
      title="Family & Loved Ones"
      subtitle={
        familyMembers.length > 0
          ? 'Tap any photo to call or message'
          : 'Keep your important contacts 1 tap away'
      }
      action={{
        label: familyMembers.length > 0 ? 'See All →' : '+ Add',
        onPress: onSeeAll,
      }}>
      {familyMembers.length === 0 ? (
        <EHCard style={styles.emptyCard} elevation="low">
          <View
            style={[
              styles.emptyIconCircle,
              {backgroundColor: colors.primaryLight},
            ]}>
            <UserPlus size={28} color={colors.primary} />
          </View>
          <View style={styles.emptyTextCol}>
            <EHText variant="body" weight="700">
              No loved ones added yet
            </EHText>
            <EHText variant="caption" color={colors.textSecondary}>
              Add family members for quick 1-tap calls & messaging
            </EHText>
          </View>
          <EHButton
            label="Add Now"
            icon={<Plus size={16} color="#FFFFFF" />}
            variant="primary"
            onPress={onSeeAll}
            style={styles.emptyAddBtn}
          />
        </EHCard>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.familyScroll}>
          {familyMembers.map((member, index) => (
            <EHCard
              key={member.id}
              style={styles.familyCard}
              onPress={() => onSelectMember(member)}
              elevation="medium">
              <View style={styles.avatarWrapper}>
                <EHAvatar source={member.photo} name={member.name} size={64} />
                {index === 0 && (
                  <View
                    style={[
                      styles.starBadge,
                      {backgroundColor: colors.primary},
                    ]}>
                    <Star size={11} color="#FFFFFF" fill="#FFFFFF" />
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
            </EHCard>
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
              <Plus size={24} color={colors.primary} />
            </View>
            <EHText variant="caption" weight="700" style={styles.addMoreText}>
              Add Loved One
            </EHText>
          </TouchableOpacity>
        </ScrollView>
      )}
    </EHSection>
  );
}

const styles = StyleSheet.create({
  familyScroll: {
    paddingVertical: 4,
    gap: 12,
  },
  familyCard: {
    width: 120,
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 8,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 8,
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
  familyName: {
    marginTop: 2,
    textAlign: 'center',
  },
  emptyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  emptyIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  emptyTextCol: {
    flex: 1,
    marginRight: 8,
  },
  emptyAddBtn: {
    minHeight: 40,
    paddingHorizontal: 14,
  },
  addMoreCard: {
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  addMoreIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  addMoreText: {
    textAlign: 'center',
  },
});

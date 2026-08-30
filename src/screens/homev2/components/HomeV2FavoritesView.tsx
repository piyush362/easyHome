import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  Phone,
  MessageCircle,
  Plus,
  Star,
  UserPlus,
  Heart,
} from 'lucide-react-native';
import {useTheme} from '../../../theme';
import {EHText, EHCard, EHAvatar, EHButton} from '../../../components';
import {FamilyMember} from '../../../types/models';
import {ContactsService} from '../../../services';

export interface HomeV2FavoritesViewProps {
  familyMembers: FamilyMember[];
  onAddContact: () => void;
}

export function HomeV2FavoritesView({
  familyMembers,
  onAddContact,
}: HomeV2FavoritesViewProps) {
  const {colors, isDark, borderRadius} = useTheme();

  const handleCall = async (member: FamilyMember) => {
    try {
      await ContactsService.makeDirectCall(member.phoneNumber);
    } catch (error: any) {
      Alert.alert('Cannot Call', `Failed to call ${member.name}: ${error?.message}`);
    }
  };

  const handleWhatsApp = async (member: FamilyMember) => {
    try {
      await ContactsService.openWhatsApp(member.phoneNumber);
    } catch (error: any) {
      Alert.alert('Cannot Message', `Failed to message ${member.name}: ${error?.message}`);
    }
  };

  return (
    <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}>
      {/* Header Banner */}
      <EHCard style={styles.headerCard} elevation="low">
        <View style={styles.headerTitleRow}>
          <View
            style={[
              styles.headerIconBox,
              {
                backgroundColor: isDark
                  ? 'rgba(239, 68, 68, 0.18)'
                  : '#FEE2E2',
              },
            ]}>
            <Heart size={24} color="#EF4444" fill="#EF4444" />
          </View>
          <View style={styles.headerTextCol}>
            <EHText variant="heading1" weight="700">
              Favourite Contacts
            </EHText>
            <EHText variant="caption" color={colors.textSecondary}>
              1-Tap quick call and message for family
            </EHText>
          </View>
        </View>
      </EHCard>

      {/* Empty State */}
      {familyMembers.length === 0 ? (
        <EHCard style={styles.emptyCard} elevation="low">
          <View
            style={[
              styles.emptyIconCircle,
              {backgroundColor: colors.primaryLight},
            ]}>
            <UserPlus size={36} color={colors.primary} />
          </View>
          <EHText variant="heading2" weight="600" style={styles.emptyTitle}>
            No Favourites Added Yet
          </EHText>
          <EHText
            variant="body"
            color={colors.textSecondary}
            style={styles.emptyDesc}>
            Add family members and doctors here so you can reach them in 1-tap with large buttons.
          </EHText>
          <EHButton
            label="Add First Contact"
            icon={<Plus size={18} color="#FFFFFF" />}
            variant="primary"
            onPress={onAddContact}
            style={styles.emptyAddBtn}
          />
        </EHCard>
      ) : (
        /* 2-Column Grid of Big Contact Tiles */
        <View style={styles.gridContainer}>
          {familyMembers.map((member, index) => (
            <View
              key={member.id}
              style={[
                styles.bigContactTile,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}>
              {/* Star Badge for Emergency Contact */}
              {index === 0 && (
                <View
                  style={[
                    styles.primaryBadge,
                    {backgroundColor: colors.primary},
                  ]}>
                  <Star size={12} color="#FFFFFF" fill="#FFFFFF" />
                  <EHText
                    variant="caption"
                    weight="700"
                    color="#FFFFFF"
                    style={styles.primaryBadgeText}>
                    PRIMARY
                  </EHText>
                </View>
              )}

              {/* Large Avatar */}
              <View style={styles.avatarBox}>
                <EHAvatar source={member.photo} name={member.name} size={74} />
              </View>

              {/* Name & Relationship */}
              <EHText
                variant="body"
                weight="700"
                numberOfLines={1}
                style={styles.memberName}>
                {member.name}
              </EHText>
              <View
                style={[
                  styles.relationshipPill,
                  {
                    backgroundColor: isDark
                      ? 'rgba(255, 255, 255, 0.08)'
                      : 'rgba(0, 0, 0, 0.05)',
                  },
                ]}>
                <EHText
                  variant="caption"
                  color={colors.textSecondary}
                  weight="500"
                  numberOfLines={1}>
                  {member.relationship || 'Family'}
                </EHText>
              </View>

              {/* 2 Big Action Buttons: Call & WhatsApp */}
              <View style={styles.tileActionsRow}>
                {/* 1-Tap Call Button */}
                <TouchableOpacity
                  style={[
                    styles.actionBtn,
                    {backgroundColor: '#16A34A'}, // Solid Green
                  ]}
                  onPress={() => handleCall(member)}
                  activeOpacity={0.8}
                  accessibilityRole="button"
                  accessibilityLabel={`Call ${member.name}`}>
                  <Phone size={18} color="#FFFFFF" />
                  <EHText
                    variant="caption"
                    weight="800"
                    color="#FFFFFF"
                    style={styles.actionBtnText}>
                    CALL
                  </EHText>
                </TouchableOpacity>

                {/* 1-Tap WhatsApp Button */}
                <TouchableOpacity
                  style={[
                    styles.actionBtn,
                    {backgroundColor: '#059669'}, // Solid Emerald
                  ]}
                  onPress={() => handleWhatsApp(member)}
                  activeOpacity={0.8}
                  accessibilityRole="button"
                  accessibilityLabel={`WhatsApp ${member.name}`}>
                  <MessageCircle size={18} color="#FFFFFF" />
                  <EHText
                    variant="caption"
                    weight="800"
                    color="#FFFFFF"
                    style={styles.actionBtnText}>
                    CHAT
                  </EHText>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {/* "+ Add Contact" Big Tile */}
          <TouchableOpacity
            style={[
              styles.bigContactTile,
              styles.addContactTile,
              {
                backgroundColor: isDark
                  ? 'rgba(99, 102, 241, 0.06)'
                  : 'rgba(99, 102, 241, 0.04)',
                borderColor: colors.primary,
              },
            ]}
            onPress={onAddContact}
            activeOpacity={0.75}
            accessibilityRole="button"
            accessibilityLabel="Add another favourite contact">
            <View
              style={[
                styles.addCircleBox,
                {backgroundColor: colors.primaryLight},
              ]}>
              <Plus size={36} color={colors.primary} />
            </View>
            <EHText
              variant="body"
              weight="800"
              color={colors.primary}
              style={styles.addTitle}>
              Add Contact
            </EHText>
            <EHText
              variant="caption"
              color={colors.textSecondary}
              style={styles.addSubtitle}>
              Tap to add family or doctor
            </EHText>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  headerCard: {
    padding: 16,
    borderRadius: 22,
    marginBottom: 14,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIconBox: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextCol: {
    flex: 1,
    gap: 2,
  },
  emptyCard: {
    padding: 24,
    borderRadius: 22,
    alignItems: 'center',
    textAlign: 'center',
  },
  emptyIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  emptyTitle: {
    marginBottom: 6,
    textAlign: 'center',
  },
  emptyDesc: {
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 18,
  },
  emptyAddBtn: {
    minWidth: 180,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 14,
  },
  bigContactTile: {
    width: '48%',
    borderRadius: 24,
    borderWidth: 1,
    padding: 14,
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  primaryBadgeText: {
    fontSize: 9,
    lineHeight: 11,
    letterSpacing: 0.5,
  },
  avatarBox: {
    marginTop: 6,
    marginBottom: 10,
  },
  memberName: {
    fontSize: 16,
    lineHeight: 20,
    textAlign: 'center',
    width: '100%',
  },
  relationshipPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginTop: 4,
    marginBottom: 12,
  },
  tileActionsRow: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 10,
    borderRadius: 14,
  },
  actionBtnText: {
    fontSize: 12,
    lineHeight: 14,
  },
  addContactTile: {
    borderStyle: 'dashed',
    borderWidth: 1.5,
    justifyContent: 'center',
    minHeight: 200,
  },
  addCircleBox: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  addTitle: {
    fontSize: 16,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 2,
  },
  addSubtitle: {
    textAlign: 'center',
    fontSize: 11,
    lineHeight: 14,
  },
});

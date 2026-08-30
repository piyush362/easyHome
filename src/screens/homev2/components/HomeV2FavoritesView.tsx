import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
} from 'react-native';
import {
  Phone,
  Plus,
  UserPlus,
  Users,
} from 'lucide-react-native';
import {useTheme} from '../../../theme';
import {EHText, EHCard, EHButton} from '../../../components';
import {FamilyMember} from '../../../types/models';
import {ContactsService} from '../../../services';

export interface HomeV2FavoritesViewProps {
  familyMembers: FamilyMember[];
  onAddContact: () => void;
  onSelectMember?: (member: FamilyMember) => void;
}

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const CARD_WIDTH = Math.floor((SCREEN_WIDTH - 44) / 2);
const CARD_HEIGHT = Math.round(CARD_WIDTH * 1.25);

export function HomeV2FavoritesView({
  familyMembers,
  onAddContact,
  onSelectMember,
}: HomeV2FavoritesViewProps) {
  const {colors, isDark} = useTheme();

  const handleCall = async (member: FamilyMember) => {
    try {
      await ContactsService.makeDirectCall(member.phoneNumber);
    } catch (error: any) {
      Alert.alert('Cannot Call', `Failed to call ${member.name}: ${error?.message}`);
    }
  };

  const handleTilePress = (member: FamilyMember) => {
    if (onSelectMember) {
      onSelectMember(member);
    }
  };

  return (
    <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}>
      {/* Header Bar */}
      <EHCard style={styles.headerCard} elevation="none">
        <View style={styles.headerTitleRow}>
          <View
            style={[
              styles.headerIconBox,
              {
                backgroundColor: isDark
                  ? 'rgba(99, 102, 241, 0.18)'
                  : 'rgba(99, 102, 241, 0.1)',
              },
            ]}>
            <Users size={20} color={colors.primary} />
          </View>
          <View style={styles.headerTextCol}>
            <EHText variant="heading2" weight="700">
              Favourite Contacts
            </EHText>
            <EHText variant="caption" color={colors.textSecondary}>
              Tap photo for options or tap Call directly
            </EHText>
          </View>
        </View>
      </EHCard>

      {/* Empty State */}
      {familyMembers.length === 0 ? (
        <EHCard style={styles.emptyCard} elevation="none">
          <View
            style={[
              styles.emptyIconCircle,
              {backgroundColor: colors.primaryLight},
            ]}>
            <UserPlus size={32} color={colors.primary} />
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
        /* 2-Column Grid of Full-Card Image Contact Tiles */
        <View style={styles.gridContainer}>
          {familyMembers.map(member => (
            <TouchableOpacity
              key={member.id}
              activeOpacity={0.88}
              onPress={() => handleTilePress(member)}
              style={[
                styles.contactTile,
                {
                  backgroundColor: isDark ? '#1E293B' : '#E2E8F0',
                  borderColor: isDark
                    ? 'rgba(255, 255, 255, 0.14)'
                    : 'rgba(0, 0, 0, 0.08)',
                },
              ]}>
              {/* 1. Full Card Edge-to-Edge Image / Fallback Background */}
              {member.photo ? (
                <Image
                  source={{uri: member.photo}}
                  style={styles.fullImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.placeholderBg}>
                  <EHText
                    variant="heading1"
                    weight="800"
                    color={colors.primary}
                    style={styles.fallbackLetter}>
                    {member.name.charAt(0).toUpperCase()}
                  </EHText>
                </View>
              )}

              {/* 2. Frosted Dark Bottom Overlay for Text & Call Button */}
              <View style={styles.bottomOverlay}>
                {/* Contact Name (No relationship) */}
                <EHText
                  variant="body"
                  weight="800"
                  numberOfLines={1}
                  color="#FFFFFF"
                  style={styles.memberName}>
                  {member.name}
                </EHText>

                {/* 1-Tap Full-Width CALL Button */}
                <TouchableOpacity
                  style={styles.callButton}
                  onPress={() => handleCall(member)}
                  activeOpacity={0.8}
                  accessibilityRole="button"
                  accessibilityLabel={`Call ${member.name}`}>
                  <Phone size={15} color="#FFFFFF" strokeWidth={2.4} />
                  <EHText
                    variant="caption"
                    weight="800"
                    color="#FFFFFF"
                    style={styles.callButtonText}>
                    CALL
                  </EHText>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}

          {/* "+ Add Contact" Card */}
          <TouchableOpacity
            style={[
              styles.contactTile,
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
                styles.addSquareBox,
                {
                  backgroundColor: isDark
                    ? 'rgba(99, 102, 241, 0.22)'
                    : 'rgba(99, 102, 241, 0.12)',
                },
              ]}>
              <Plus size={32} color={colors.primary} strokeWidth={2.5} />
            </View>
            <EHText
              variant="body"
              weight="700"
              color={colors.primary}
              style={styles.addTitle}>
              Add Contact
            </EHText>
            <EHText
              variant="caption"
              color={colors.textSecondary}
              style={styles.addSubtitle}>
              Family or doctor
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
    paddingBottom: 24,
  },
  headerCard: {
    padding: 12,
    borderRadius: 18,
    marginBottom: 12,
    borderWidth: 1,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextCol: {
    flex: 1,
    gap: 1,
  },
  emptyCard: {
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    textAlign: 'center',
    borderWidth: 1,
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emptyTitle: {
    marginBottom: 6,
    textAlign: 'center',
  },
  emptyDesc: {
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  emptyAddBtn: {
    minWidth: 180,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
  },
  contactTile: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  fullImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  placeholderBg: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 50,
  },
  fallbackLetter: {
    fontSize: 52,
    lineHeight: 60,
  },
  bottomOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.78)',
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: 10,
    gap: 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  memberName: {
    fontSize: 15,
    lineHeight: 18,
    textAlign: 'center',
  },
  callButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 7,
    borderRadius: 12,
    backgroundColor: '#16A34A', // Direct Green Call
  },
  callButtonText: {
    fontSize: 12,
    lineHeight: 14,
    letterSpacing: 0.5,
  },
  addContactTile: {
    borderStyle: 'dashed',
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addSquareBox: {
    width: 58,
    height: 58,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  addTitle: {
    fontSize: 15,
    lineHeight: 19,
    textAlign: 'center',
    marginBottom: 2,
  },
  addSubtitle: {
    textAlign: 'center',
    fontSize: 11,
    lineHeight: 14,
  },
});

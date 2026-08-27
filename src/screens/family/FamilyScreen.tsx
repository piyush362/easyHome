import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import {
  Heart,
  Phone,
  MessageCircle,
  Video,
  MessageSquare,
  Star,
  Plus,
  Trash2,
  Edit2,
  UserPlus,
  BookOpen,
  Search,
  Check,
  X,
} from 'lucide-react-native';
import type {RootStackScreenProps} from '../../navigation/types';
import {
  useAppSelector,
  useAppDispatch,
  addMember,
  updateMember,
  removeMember,
} from '../../store';
import {useTheme} from '../../theme';
import {
  ScreenWrapper,
  HeaderNavigation,
  EHText,
  EHCard,
  EHAvatar,
  EHButton,
  EHBottomSheet,
  EHModal,
} from '../../components';
import {ContactsService} from '../../services';
import {DeviceContact} from '../../native/ContactsNativeModule';
import {FamilyMember} from '../../types/models';

const RELATIONSHIPS = [
  'Daughter',
  'Son',
  'Wife',
  'Husband',
  'Granddaughter',
  'Grandson',
  'Mother',
  'Father',
  'Brother',
  'Sister',
  'Doctor',
  'Caregiver',
  'Friend',
  'Other',
];

export default function FamilyScreen({
  navigation,
}: RootStackScreenProps<'Family'>) {
  const {colors, spacing, isDark} = useTheme();
  const dispatch = useAppDispatch();
  const familyMembers = useAppSelector(state => state.family.members);

  // Sheet / Modal states
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [pickerModalVisible, setPickerModalVisible] = useState(false);
  const [editMember, setEditMember] = useState<FamilyMember | null>(null);

  // Device contact picker states
  const [deviceContacts, setDeviceContacts] = useState<DeviceContact[]>([]);
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [contactSearchQuery, setContactSearchQuery] = useState('');

  // Form states
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formRelationship, setFormRelationship] = useState('Daughter');
  const [formPreference, setFormPreference] = useState<
    'call' | 'whatsapp' | 'video' | 'message'
  >('call');

  // Real action handlers
  const handleCall = async (member: FamilyMember) => {
    setSelectedMember(null);
    try {
      await ContactsService.makeDirectCall(member.phoneNumber);
    } catch (error: any) {
      Alert.alert('Cannot Call', `Failed to call ${member.name}: ${error?.message}`);
    }
  };

  const handleWhatsApp = async (member: FamilyMember) => {
    setSelectedMember(null);
    try {
      await ContactsService.openWhatsApp(member.phoneNumber);
    } catch (error: any) {
      Alert.alert(
        'Cannot Open WhatsApp',
        `Failed to open WhatsApp with ${member.name}: ${error?.message}`,
      );
    }
  };

  const handleSMS = async (member: FamilyMember) => {
    setSelectedMember(null);
    try {
      await ContactsService.sendSMS(member.phoneNumber);
    } catch (error: any) {
      Alert.alert('Cannot Send SMS', `Failed to send SMS to ${member.name}: ${error?.message}`);
    }
  };

  const handleVideo = async (member: FamilyMember) => {
    setSelectedMember(null);
    try {
      await ContactsService.openWhatsApp(member.phoneNumber);
    } catch (error: any) {
      Alert.alert('Video Call', `Starting video call with ${member.name}...`);
    }
  };

  // Open Device Contact Picker
  const handleOpenContactPicker = async () => {
    setPickerModalVisible(true);
    setLoadingContacts(true);
    try {
      const contacts = await ContactsService.getDeviceContacts();
      setDeviceContacts(contacts);
    } catch (error: any) {
      Alert.alert('Contacts Error', 'Could not load contacts: ' + error?.message);
    } finally {
      setLoadingContacts(false);
    }
  };

  // Select a contact from picker
  const handleSelectDeviceContact = (contact: DeviceContact) => {
    setFormName(contact.name);
    setFormPhone(contact.phoneNumber);
    setPickerModalVisible(false);
  };

  // Save new member
  const handleSaveNewMember = () => {
    if (!formName.trim() || !formPhone.trim()) {
      Alert.alert('Required Fields', 'Please enter a name and phone number.');
      return;
    }

    const newMember: FamilyMember = {
      id: 'fam-' + Date.now(),
      name: formName.trim(),
      phoneNumber: formPhone.trim(),
      relationship: formRelationship,
      photo: null,
      preferredCommunication: formPreference,
    };

    dispatch(addMember(newMember));
    setAddModalVisible(false);
    resetForm();
  };

  // Save edited member
  const handleSaveEditMember = () => {
    if (!editMember || !formName.trim() || !formPhone.trim()) {
      Alert.alert('Required Fields', 'Please enter a name and phone number.');
      return;
    }

    dispatch(
      updateMember({
        id: editMember.id,
        name: formName.trim(),
        phoneNumber: formPhone.trim(),
        relationship: formRelationship,
        preferredCommunication: formPreference,
      }),
    );
    setEditMember(null);
    resetForm();
  };

  // Delete member
  const handleDeleteMember = (member: FamilyMember) => {
    Alert.alert(
      'Remove Contact',
      `Are you sure you want to remove ${member.name} from family contacts?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            dispatch(removeMember(member.id));
            if (editMember?.id === member.id) setEditMember(null);
            if (selectedMember?.id === member.id) setSelectedMember(null);
          },
        },
      ],
    );
  };

  const openEditModal = (member: FamilyMember) => {
    setEditMember(member);
    setFormName(member.name);
    setFormPhone(member.phoneNumber);
    setFormRelationship(member.relationship);
    setFormPreference(member.preferredCommunication);
  };

  const resetForm = () => {
    setFormName('');
    setFormPhone('');
    setFormRelationship('Daughter');
    setFormPreference('call');
  };

  // Filter device contacts for picker
  const filteredDeviceContacts = deviceContacts.filter(
    c =>
      c.name.toLowerCase().includes(contactSearchQuery.toLowerCase()) ||
      c.phoneNumber.includes(contactSearchQuery),
  );

  return (
    <ScreenWrapper
      headerComponent={
        <HeaderNavigation
          label="Family Contacts"
          subtitle={`${familyMembers.length} loved ones configured`}
          onBack={() => navigation.goBack()}
          rightComponent={
            <TouchableOpacity
              style={[
                styles.headerAddBtn,
                {backgroundColor: colors.primary},
              ]}
              onPress={() => {
                resetForm();
                setAddModalVisible(true);
              }}
              activeOpacity={0.8}
              accessibilityLabel="Add family member">
              <Plus size={20} color="#FFFFFF" />
            </TouchableOpacity>
          }
        />
      }>
      <View style={[styles.container, {padding: spacing.md}]}>
        {/* Family Cards List */}
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
                <View style={styles.nameRow}>
                  <EHText variant="heading2" weight="700">
                    {member.name}
                  </EHText>
                </View>
                <EHText variant="caption" color={colors.textSecondary}>
                  {member.relationship} • {member.phoneNumber}
                </EHText>
              </View>

              {/* Quick 1-tap direct action buttons */}
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
                <TouchableOpacity
                  style={[
                    styles.editIconBtn,
                    {
                      backgroundColor: isDark
                        ? 'rgba(255, 255, 255, 0.06)'
                        : 'rgba(0, 0, 0, 0.04)',
                    },
                  ]}
                  onPress={() => openEditModal(member)}>
                  <Edit2 size={16} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>
            </View>
          </EHCard>
        ))}

        {/* Add New Contact Button */}
        <EHButton
          label="Add Family Member"
          icon={<UserPlus size={18} color="#FFFFFF" />}
          variant="primary"
          onPress={() => {
            resetForm();
            setAddModalVisible(true);
          }}
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
              label={`Direct Call (${selectedMember.phoneNumber})`}
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
              label="Send SMS Text"
              icon={<MessageSquare size={20} color={colors.primary} />}
              variant="outline"
              onPress={() => handleSMS(selectedMember)}
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

      {/* Add Member Modal */}
      <EHModal
        visible={addModalVisible}
        onClose={() => setAddModalVisible(false)}
        title="Add Family Member">
        <ScrollView style={styles.modalScroll} keyboardShouldPersistTaps="handled">
          <EHButton
            label="Import from Device Contacts"
            icon={<BookOpen size={18} color={colors.primary} />}
            variant="outline"
            onPress={handleOpenContactPicker}
            style={styles.importBtn}
          />

          <EHText variant="body" weight="700" style={styles.inputLabel}>
            Contact Name
          </EHText>
          <TextInput
            style={[
              styles.input,
              {
                color: isDark ? '#FFF' : '#000',
                borderColor: colors.border,
                backgroundColor: isDark ? '#1E293B' : '#F8FAFC',
              },
            ]}
            placeholder="e.g. Alice"
            placeholderTextColor={colors.textMuted}
            value={formName}
            onChangeText={setFormName}
          />

          <EHText variant="body" weight="700" style={styles.inputLabel}>
            Phone Number
          </EHText>
          <TextInput
            style={[
              styles.input,
              {
                color: isDark ? '#FFF' : '#000',
                borderColor: colors.border,
                backgroundColor: isDark ? '#1E293B' : '#F8FAFC',
              },
            ]}
            placeholder="e.g. +1 555 123 4567"
            placeholderTextColor={colors.textMuted}
            keyboardType="phone-pad"
            value={formPhone}
            onChangeText={setFormPhone}
          />

          <EHText variant="body" weight="700" style={styles.inputLabel}>
            Relationship
          </EHText>
          <View style={styles.relationshipWrap}>
            {RELATIONSHIPS.map(rel => (
              <TouchableOpacity
                key={rel}
                style={[
                  styles.relBadge,
                  {
                    backgroundColor:
                      formRelationship === rel
                        ? colors.primary
                        : isDark
                        ? '#1E293B'
                        : '#F1F5F9',
                    borderColor:
                      formRelationship === rel ? colors.primary : colors.border,
                  },
                ]}
                onPress={() => setFormRelationship(rel)}>
                <Text
                  style={[
                    styles.relBadgeText,
                    {color: formRelationship === rel ? '#FFF' : colors.textPrimary},
                  ]}>
                  {rel}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.modalBtnRow}>
            <EHButton
              label="Save Member"
              icon={<Check size={18} color="#FFFFFF" />}
              variant="primary"
              onPress={handleSaveNewMember}
              style={styles.modalActionBtn}
            />
            <EHButton
              label="Cancel"
              variant="ghost"
              onPress={() => setAddModalVisible(false)}
              style={styles.modalActionBtn}
            />
          </View>
        </ScrollView>
      </EHModal>

      {/* Edit Member Modal */}
      <EHModal
        visible={!!editMember}
        onClose={() => setEditMember(null)}
        title="Edit Family Member">
        <ScrollView style={styles.modalScroll} keyboardShouldPersistTaps="handled">
          <EHText variant="body" weight="700" style={styles.inputLabel}>
            Contact Name
          </EHText>
          <TextInput
            style={[
              styles.input,
              {
                color: isDark ? '#FFF' : '#000',
                borderColor: colors.border,
                backgroundColor: isDark ? '#1E293B' : '#F8FAFC',
              },
            ]}
            value={formName}
            onChangeText={setFormName}
          />

          <EHText variant="body" weight="700" style={styles.inputLabel}>
            Phone Number
          </EHText>
          <TextInput
            style={[
              styles.input,
              {
                color: isDark ? '#FFF' : '#000',
                borderColor: colors.border,
                backgroundColor: isDark ? '#1E293B' : '#F8FAFC',
              },
            ]}
            keyboardType="phone-pad"
            value={formPhone}
            onChangeText={setFormPhone}
          />

          <EHText variant="body" weight="700" style={styles.inputLabel}>
            Relationship
          </EHText>
          <View style={styles.relationshipWrap}>
            {RELATIONSHIPS.map(rel => (
              <TouchableOpacity
                key={rel}
                style={[
                  styles.relBadge,
                  {
                    backgroundColor:
                      formRelationship === rel
                        ? colors.primary
                        : isDark
                        ? '#1E293B'
                        : '#F1F5F9',
                    borderColor:
                      formRelationship === rel ? colors.primary : colors.border,
                  },
                ]}
                onPress={() => setFormRelationship(rel)}>
                <Text
                  style={[
                    styles.relBadgeText,
                    {color: formRelationship === rel ? '#FFF' : colors.textPrimary},
                  ]}>
                  {rel}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.modalBtnRow}>
            <EHButton
              label="Update"
              icon={<Check size={18} color="#FFFFFF" />}
              variant="primary"
              onPress={handleSaveEditMember}
              style={styles.modalActionBtn}
            />
            {editMember && (
              <EHButton
                label="Delete"
                icon={<Trash2 size={18} color={colors.error} />}
                variant="outline"
                onPress={() => handleDeleteMember(editMember)}
                style={styles.modalActionBtn}
              />
            )}
          </View>
        </ScrollView>
      </EHModal>

      {/* Device Contact Picker Modal */}
      <EHModal
        visible={pickerModalVisible}
        onClose={() => setPickerModalVisible(false)}
        title="Select from Contacts">
        <View style={styles.pickerContainer}>
          {/* Search bar */}
          <View
            style={[
              styles.searchBar,
              {
                backgroundColor: isDark ? '#1E293B' : '#F1F5F9',
                borderColor: colors.border,
              },
            ]}>
            <Search size={18} color={colors.textMuted} style={styles.searchIcon} />
            <TextInput
              style={[styles.searchInput, {color: isDark ? '#FFF' : '#000'}]}
              placeholder="Search contacts..."
              placeholderTextColor={colors.textMuted}
              value={contactSearchQuery}
              onChangeText={setContactSearchQuery}
            />
          </View>

          {loadingContacts ? (
            <View style={styles.centerBox}>
              <ActivityIndicator size="large" color={colors.primary} />
              <EHText variant="caption" style={styles.loaderText}>
                Loading phone contacts...
              </EHText>
            </View>
          ) : filteredDeviceContacts.length === 0 ? (
            <View style={styles.centerBox}>
              <EHText variant="body" color={colors.textSecondary}>
                No contacts found
              </EHText>
            </View>
          ) : (
            <FlatList
              data={filteredDeviceContacts}
              keyExtractor={item => item.id + item.phoneNumber}
              style={styles.contactsList}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={[
                    styles.contactItem,
                    {borderBottomColor: colors.border},
                  ]}
                  onPress={() => handleSelectDeviceContact(item)}>
                  <EHAvatar source={item.photoUri} name={item.name} size={42} />
                  <View style={styles.contactItemText}>
                    <EHText variant="body" weight="700">
                      {item.name}
                    </EHText>
                    <EHText variant="caption" color={colors.textSecondary}>
                      {item.phoneNumber}
                    </EHText>
                  </View>
                </TouchableOpacity>
              )}
            />
          )}

          <EHButton
            label="Close"
            variant="ghost"
            onPress={() => setPickerModalVisible(false)}
            style={styles.closePickerBtn}
          />
        </View>
      </EHModal>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  headerAddBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
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
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  quickActionBtn: {
    minHeight: 40,
    width: 40,
    paddingHorizontal: 0,
    borderRadius: 20,
  },
  editIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 2,
  },
  addBtn: {
    marginTop: 12,
    minHeight: 52,
  },
  sheetContent: {
    gap: 12,
  },
  sheetBtn: {
    minHeight: 52,
  },
  modalScroll: {
    maxHeight: 420,
  },
  importBtn: {
    marginBottom: 14,
  },
  inputLabel: {
    marginTop: 10,
    marginBottom: 6,
  },
  input: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 16,
  },
  relationshipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
    marginBottom: 16,
  },
  relBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  relBadgeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  modalBtnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  modalActionBtn: {
    flex: 1,
    minHeight: 48,
  },
  pickerContainer: {
    height: 380,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    height: '100%',
    paddingVertical: 0,
  },
  centerBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    marginTop: 8,
  },
  contactsList: {
    flex: 1,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  contactItemText: {
    marginLeft: 12,
    flex: 1,
  },
  closePickerBtn: {
    marginTop: 10,
  },
});

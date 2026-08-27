import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
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
  Camera,
  Image as ImageIcon,
} from 'lucide-react-native';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
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
  EHButton,
  EHCard,
  EHAvatar,
  EHBottomSheet,
} from '../../components';
import {FamilyMember, RelationshipType} from '../../types/models';
import {
  ContactsService,
  DeviceContact,
  ImageCompressorService,
} from '../../services';

const STANDARD_RELATIONSHIPS: RelationshipType[] = [
  'Son',
  'Daughter',
  'Spouse',
  'Grandchild',
  'Doctor',
  'Caregiver',
  'Friend',
  'Other',
];

export default function FamilyScreen({
  navigation,
}: RootStackScreenProps<'Family'>) {
  const {colors, spacing, isDark, borderRadius} = useTheme();
  const dispatch = useAppDispatch();
  const familyMembers = useAppSelector(state => state.family.members);

  // Active Bottom Sheet States
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editMember, setEditMember] = useState<FamilyMember | null>(null);
  const [pickerModalVisible, setPickerModalVisible] = useState(false);

  // Form State for Add / Edit
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formPhoto, setFormPhoto] = useState<string | null>(null);
  const [formRelationship, setFormRelationship] =
    useState<RelationshipType>('Son');
  const [formCustomRelationship, setFormCustomRelationship] = useState('');
  const [formPref, setFormPref] = useState<
    'call' | 'whatsapp' | 'video' | 'message'
  >('call');
  const [compressingPhoto, setCompressingPhoto] = useState(false);

  // Device Contacts State
  const [deviceContacts, setDeviceContacts] = useState<DeviceContact[]>([]);
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [contactSearchQuery, setContactSearchQuery] = useState('');

  const resetForm = useCallback(() => {
    setFormName('');
    setFormPhone('');
    setFormPhoto(null);
    setFormRelationship('Son');
    setFormCustomRelationship('');
    setFormPref('call');
    setCompressingPhoto(false);
  }, []);

  // Quick Action Callbacks
  const handleCall = async (member: FamilyMember) => {
    setSelectedMember(null);
    try {
      await ContactsService.makeDirectCall(member.phoneNumber);
    } catch (error: any) {
      Alert.alert(
        'Cannot Call',
        `Failed to call ${member.name}: ${error?.message}`,
      );
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
      Alert.alert(
        'Cannot Send SMS',
        `Failed to send SMS to ${member.name}: ${error?.message}`,
      );
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

  // Open Device Contact Picker Bottom Sheet
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
    if (contact.photoUri) {
      setFormPhoto(contact.photoUri);
    }
    setPickerModalVisible(false);
  };

  // Pick photo from Gallery & Compress natively
  const handlePickFromGallery = async () => {
    try {
      const res = await launchImageLibrary({
        mediaType: 'photo',
        quality: 1,
        selectionLimit: 1,
      });

      if (res.assets && res.assets[0]?.uri) {
        setCompressingPhoto(true);
        const compressed = await ImageCompressorService.compress(
          res.assets[0].uri,
          512,
          512,
          80,
        );
        setFormPhoto(compressed.uri);
      }
    } catch (error: any) {
      Alert.alert('Photo Error', 'Failed to pick photo: ' + error?.message);
    } finally {
      setCompressingPhoto(false);
    }
  };

  // Capture photo from Camera & Compress natively
  const handleTakePhoto = async () => {
    try {
      const res = await launchCamera({
        mediaType: 'photo',
        quality: 1,
      });

      if (res.assets && res.assets[0]?.uri) {
        setCompressingPhoto(true);
        const compressed = await ImageCompressorService.compress(
          res.assets[0].uri,
          512,
          512,
          80,
        );
        setFormPhoto(compressed.uri);
      }
    } catch (error: any) {
      Alert.alert('Camera Error', 'Failed to capture photo: ' + error?.message);
    } finally {
      setCompressingPhoto(false);
    }
  };

  // Photo Action Options
  const handlePhotoOptions = () => {
    Alert.alert('Contact Photo', 'Choose an option for the photo', [
      {text: 'Take Photo', onPress: handleTakePhoto},
      {text: 'Choose from Gallery', onPress: handlePickFromGallery},
      ...(formPhoto
        ? [
            {
              text: 'Remove Photo',
              style: 'destructive' as const,
              onPress: () => setFormPhoto(null),
            },
          ]
        : []),
      {text: 'Cancel', style: 'cancel'},
    ]);
  };

  // Save new member
  const handleSaveNewMember = () => {
    if (!formName.trim() || !formPhone.trim()) {
      Alert.alert('Required Fields', 'Please enter a name and phone number.');
      return;
    }

    const finalRelationship =
      formRelationship === 'Other' && formCustomRelationship.trim()
        ? formCustomRelationship.trim()
        : formRelationship;

    const newMember: FamilyMember = {
      id: `member-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: formName.trim(),
      relationship: finalRelationship,
      phoneNumber: formPhone.trim(),
      photo: formPhoto,
      preferredCommunication: formPref,
    };

    dispatch(addMember(newMember));
    setAddModalVisible(false);
    resetForm();
  };

  // Open Edit Bottom Sheet
  const openEditModal = (member: FamilyMember) => {
    setEditMember(member);
    setFormName(member.name);
    setFormPhone(member.phoneNumber);
    setFormPhoto(member.photo);
    if (STANDARD_RELATIONSHIPS.includes(member.relationship as RelationshipType)) {
      setFormRelationship(member.relationship as RelationshipType);
      setFormCustomRelationship('');
    } else {
      setFormRelationship('Other');
      setFormCustomRelationship(member.relationship);
    }
    setFormPref(member.preferredCommunication || 'call');
  };

  // Save edit member
  const handleSaveEditMember = () => {
    if (!editMember) return;
    if (!formName.trim() || !formPhone.trim()) {
      Alert.alert('Required Fields', 'Please enter a name and phone number.');
      return;
    }

    const finalRelationship =
      formRelationship === 'Other' && formCustomRelationship.trim()
        ? formCustomRelationship.trim()
        : formRelationship;

    dispatch(
      updateMember({
        id: editMember.id,
        name: formName.trim(),
        relationship: finalRelationship,
        phoneNumber: formPhone.trim(),
        photo: formPhoto,
        preferredCommunication: formPref,
      }),
    );
    setEditMember(null);
    resetForm();
  };

  // Delete member confirmation
  const handleDeleteMember = (member: FamilyMember) => {
    Alert.alert(
      'Remove Contact',
      `Are you sure you want to remove ${member.name} from your loved ones?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            dispatch(removeMember(member.id));
            setEditMember(null);
          },
        },
      ],
    );
  };

  // Filter contacts by search
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
          subtitle={
            familyMembers.length > 0
              ? `${familyMembers.length} loved ones configured`
              : 'Add important contacts'
          }
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
        {familyMembers.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View
              style={[
                styles.emptyIconCircle,
                {backgroundColor: colors.primaryLight},
              ]}>
              <Heart size={44} color={colors.primary} />
            </View>
            <EHText variant="heading2" weight="700" style={styles.emptyTitle}>
              No Loved Ones Added Yet
            </EHText>
            <EHText
              variant="body"
              color={colors.textSecondary}
              style={styles.emptySubtitle}>
              Add children, grandchildren, doctor or caregivers to enable 1-tap
              direct calling and WhatsApp on your Home Screen.
            </EHText>

            <EHButton
              label="Add Family Member"
              icon={<UserPlus size={18} color="#FFFFFF" />}
              variant="primary"
              onPress={() => {
                resetForm();
                setAddModalVisible(true);
              }}
              style={styles.emptyAddBtn}
            />

            <EHButton
              label="Import from Phone Contacts"
              icon={<BookOpen size={18} color={colors.primary} />}
              variant="outline"
              onPress={() => {
                resetForm();
                setAddModalVisible(true);
                handleOpenContactPicker();
              }}
              style={styles.emptyImportBtn}
            />
          </View>
        ) : (
          <>
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
          </>
        )}
      </View>

      {/* 1. Communication Bottom Sheet */}
      <EHBottomSheet
        visible={!!selectedMember}
        onClose={() => setSelectedMember(null)}
        height="auto"
        scrollable={false}
        title={
          selectedMember
            ? `Connect with ${selectedMember.name}`
            : 'Connect'
        }
        subtitle={
          selectedMember
            ? `${selectedMember.relationship} • ${selectedMember.phoneNumber}`
            : undefined
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

      {/* 2. Add Family Member Bottom Sheet */}
      <EHBottomSheet
        visible={addModalVisible && !pickerModalVisible}
        onClose={() => setAddModalVisible(false)}
        height="85%"
        title="Add Loved One"
        subtitle="Keep your family 1 tap away"
        footerComponent={
          <View style={styles.sheetBtnRow}>
            <EHButton
              label="Save Loved One"
              icon={<Check size={18} color="#FFFFFF" />}
              variant="primary"
              onPress={handleSaveNewMember}
              style={styles.sheetActionBtn}
            />
            <EHButton
              label="Cancel"
              variant="ghost"
              onPress={() => setAddModalVisible(false)}
              style={styles.sheetActionBtn}
            />
          </View>
        }>
        <EHButton
          label="Import from Phone Contacts"
          icon={<BookOpen size={18} color={colors.primary} />}
          variant="outline"
          onPress={handleOpenContactPicker}
          style={styles.importBtn}
        />

        {/* Photo Selector */}
        <View style={styles.photoPickerRow}>
          <TouchableOpacity
            style={[
              styles.avatarContainer,
              {borderColor: colors.border, backgroundColor: colors.surface},
            ]}
            onPress={handlePhotoOptions}
            activeOpacity={0.8}>
            {compressingPhoto ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <EHAvatar source={formPhoto} name={formName || 'User'} size={72} />
            )}
            <View
              style={[
                styles.photoEditBadge,
                {backgroundColor: colors.primary},
              ]}>
              <Camera size={13} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
          <View style={styles.photoTextCol}>
            <EHText variant="body" weight="700">
              Contact Photo
            </EHText>
            <EHText variant="caption" color={colors.textSecondary}>
              Auto-compressed to lightweight image
            </EHText>
            <TouchableOpacity onPress={handlePhotoOptions} style={styles.changePhotoBtn}>
              <EHText variant="caption" color={colors.primary} weight="700">
                {formPhoto ? 'Change Photo' : '+ Add Photo'}
              </EHText>
            </TouchableOpacity>
          </View>
        </View>

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
          {STANDARD_RELATIONSHIPS.map(rel => (
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
                  {
                    color:
                      formRelationship === rel ? '#FFF' : colors.textPrimary,
                  },
                ]}>
                {rel}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Custom Relationship Input when "Other" is selected */}
        {formRelationship === 'Other' && (
          <View style={styles.customRelBox}>
            <EHText variant="body" weight="700" style={styles.inputLabel}>
              Specify Relationship
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
              placeholder="e.g. Brother, Sister, Neighbor, Driver"
              placeholderTextColor={colors.textMuted}
              value={formCustomRelationship}
              onChangeText={setFormCustomRelationship}
            />
          </View>
        )}
      </EHBottomSheet>

      {/* 3. Edit Family Member Bottom Sheet */}
      <EHBottomSheet
        visible={!!editMember && !pickerModalVisible}
        onClose={() => setEditMember(null)}
        height="85%"
        title="Edit Loved One"
        subtitle={`Update details for ${editMember?.name || ''}`}
        footerComponent={
          <View style={styles.sheetBtnRow}>
            <EHButton
              label="Update"
              icon={<Check size={18} color="#FFFFFF" />}
              variant="primary"
              onPress={handleSaveEditMember}
              style={styles.sheetActionBtn}
            />
            {editMember && (
              <EHButton
                label="Delete"
                icon={<Trash2 size={18} color={colors.error} />}
                variant="outline"
                onPress={() => handleDeleteMember(editMember)}
                style={styles.sheetActionBtn}
              />
            )}
          </View>
        }>
        {/* Photo Selector */}
        <View style={styles.photoPickerRow}>
          <TouchableOpacity
            style={[
              styles.avatarContainer,
              {borderColor: colors.border, backgroundColor: colors.surface},
            ]}
            onPress={handlePhotoOptions}
            activeOpacity={0.8}>
            {compressingPhoto ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <EHAvatar source={formPhoto} name={formName || 'User'} size={72} />
            )}
            <View
              style={[
                styles.photoEditBadge,
                {backgroundColor: colors.primary},
              ]}>
              <Camera size={13} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
          <View style={styles.photoTextCol}>
            <EHText variant="body" weight="700">
              Contact Photo
            </EHText>
            <EHText variant="caption" color={colors.textSecondary}>
              Auto-compressed to lightweight image
            </EHText>
            <TouchableOpacity onPress={handlePhotoOptions} style={styles.changePhotoBtn}>
              <EHText variant="caption" color={colors.primary} weight="700">
                {formPhoto ? 'Change Photo' : '+ Add Photo'}
              </EHText>
            </TouchableOpacity>
          </View>
        </View>

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
          {STANDARD_RELATIONSHIPS.map(rel => (
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
                  {
                    color:
                      formRelationship === rel ? '#FFF' : colors.textPrimary,
                  },
                ]}>
                {rel}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Custom Relationship Input when "Other" is selected */}
        {formRelationship === 'Other' && (
          <View style={styles.customRelBox}>
            <EHText variant="body" weight="700" style={styles.inputLabel}>
              Specify Relationship
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
              placeholder="e.g. Brother, Sister, Neighbor, Driver"
              placeholderTextColor={colors.textMuted}
              value={formCustomRelationship}
              onChangeText={setFormCustomRelationship}
            />
          </View>
        )}
      </EHBottomSheet>

      {/* 4. Import from Phone Contacts Bottom Sheet */}
      <EHBottomSheet
        visible={pickerModalVisible}
        onClose={() => setPickerModalVisible(false)}
        height="85%"
        scrollable={false}
        title="Select from Phone Contacts"
        footerComponent={
          <EHButton
            label="Close"
            variant="ghost"
            onPress={() => setPickerModalVisible(false)}
          />
        }>
        {/* Search bar */}
        <View
          style={[
            styles.searchBar,
            {
              backgroundColor: isDark ? '#1E293B' : '#F1F5F9',
              borderColor: colors.border,
            },
          ]}>
          <Search
            size={18}
            color={colors.textMuted}
            style={styles.searchIcon}
          />
          <TextInput
            style={[styles.searchInput, {color: isDark ? '#FFF' : '#000'}]}
            placeholder="Search contacts..."
            placeholderTextColor={colors.textMuted}
            value={contactSearchQuery}
            onChangeText={setContactSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {contactSearchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setContactSearchQuery('')}
              hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
              <X size={16} color={colors.textMuted} />
            </TouchableOpacity>
          )}
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
            showsVerticalScrollIndicator={true}
            keyboardShouldPersistTaps="handled"
            renderItem={({item}) => (
              <TouchableOpacity
                style={[
                  styles.contactItem,
                  {borderBottomColor: colors.border},
                ]}
                onPress={() => handleSelectDeviceContact(item)}>
                <EHAvatar
                  source={item.photoUri}
                  name={item.name}
                  size={42}
                />
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
      </EHBottomSheet>
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
    minHeight: 38,
    minWidth: 38,
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 2,
  },
  addBtn: {
    marginTop: 12,
    minHeight: 52,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyIconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtitle: {
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  emptyAddBtn: {
    width: '100%',
    minHeight: 52,
    marginBottom: 12,
  },
  emptyImportBtn: {
    width: '100%',
    minHeight: 52,
  },
  sheetContent: {
    gap: 12,
  },
  sheetBtn: {
    minHeight: 52,
  },
  importBtn: {
    minHeight: 46,
    marginBottom: 14,
  },
  photoPickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 4,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 14,
    borderRadius: 36,
  },
  photoEditBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  photoTextCol: {
    flex: 1,
  },
  changePhotoBtn: {
    marginTop: 4,
  },
  inputLabel: {
    marginBottom: 6,
    marginTop: 4,
  },
  input: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 16,
    marginBottom: 12,
  },
  relationshipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  relBadge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  relBadgeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  customRelBox: {
    marginBottom: 8,
  },
  sheetBtnRow: {
    flexDirection: 'row',
    gap: 10,
  },
  sheetActionBtn: {
    flex: 1,
    minHeight: 48,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 46,
    borderRadius: 23,
    borderWidth: 1,
    paddingHorizontal: 14,
    marginBottom: 12,
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
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  contactItemText: {
    marginLeft: 12,
    flex: 1,
  },
});

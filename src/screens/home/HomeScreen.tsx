import React, {useState, useEffect, useCallback, useRef, useMemo} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  StatusBar,
  BackHandler,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  Phone,
  MessageCircle,
  Video,
  Camera,
  User,
  PlaySquare,
  Image as ImageIcon,
  Pill,
  Flashlight,
  ShieldAlert,
  LayoutGrid,
  Settings,
  Sun,
  Star,
} from 'lucide-react-native';
import {useTheme} from '../../theme';
import {
  EHText,
  EHButton,
  EHIconButton,
  EHCard,
  EHAvatar,
  EHSection,
  EHBottomSheet,
  EHModal,
} from '../../components';
import {PixelAppDrawer, PixelAppDrawerRef} from '../../components/apps';
import {useAppSelector} from '../../store';
import {FamilyMember} from '../../types/models';
import type {RootStackScreenProps} from '../../navigation/types';

export default function HomeScreen({navigation}: RootStackScreenProps<'Home'>) {
  const {colors, spacing, borderRadius, isDark} = useTheme();
  const insets = useSafeAreaInsets();
  const appDrawerRef = useRef<PixelAppDrawerRef>(null);
  const scrollViewRef = useRef<React.ElementRef<typeof ScrollView>>(null);

  // Redux state
  const parentProfile = useAppSelector(state => state.parent.profile);
  const familyMembers = useAppSelector(state => state.family.members);
  const reminders = useAppSelector(state => state.reminders.reminders);

  // Local state
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [selectedFamilyMember, setSelectedFamilyMember] =
    useState<FamilyMember | null>(null);
  const [sosModalVisible, setSosModalVisible] = useState(false);
  const [torchActive, setTorchActive] = useState(false);

  // Live Clock & Date updater
  const updateTime = useCallback(() => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes.toString().padStart(2, '0');

    setCurrentTime(`${displayHours}:${displayMinutes} ${ampm}`);

    const days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    setCurrentDate(
      `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}`,
    );
  }, []);

  useEffect(() => {
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [updateTime]);

  // Primary emergency contact
  const primaryContact: FamilyMember = useMemo(() => {
    return (
      familyMembers[0] || {
        id: 'primary-default',
        name: 'Family',
        relationship: 'Primary Contact',
        phoneNumber: '911',
        photo: null,
        preferredCommunication: 'call',
      }
    );
  }, [familyMembers]);

  // Next active reminder
  const nextReminder = useMemo(() => {
    return (
      reminders.find(r => r.enabled) || {
        id: 'default',
        title: 'Blood Pressure Tablet',
        description: 'Scheduled reminder',
        time: '1:00 PM',
        type: 'medicine',
        enabled: true,
      }
    );
  }, [reminders]);

  // Auto scroll to top & prevent exiting launcher when on root Home screen
  useFocusEffect(
    useCallback(() => {
      // Always scroll to top when navigating to or focusing main home screen
      scrollViewRef.current?.scrollTo({y: 0, animated: false});

      const onBackPress = () => {
        if (appDrawerRef.current?.isOpen()) {
          appDrawerRef.current.close();
          return true;
        }
        if (selectedFamilyMember) {
          setSelectedFamilyMember(null);
          return true;
        }
        if (sosModalVisible) {
          setSosModalVisible(false);
          return true;
        }
        return true; // Consume event on root Home screen
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => subscription.remove();
    }, [selectedFamilyMember, sosModalVisible]),
  );

  // Action handlers (mock calls)
  const handleCall = (member: FamilyMember) => {
    console.log(`[Home Call] Calling ${member.name} (${member.phoneNumber})`);
    setSelectedFamilyMember(null);
    Alert.alert(
      'Calling ' + member.name,
      `Dialing ${member.phoneNumber}...\n\n(Native dialer integration in Phase 8)`,
    );
  };

  const handleWhatsApp = (member: FamilyMember) => {
    console.log(`[Home WhatsApp] Opening chat with ${member.name}`);
    setSelectedFamilyMember(null);
    Alert.alert(
      'WhatsApp with ' + member.name,
      `Opening WhatsApp conversation...\n\n(Native WhatsApp integration in Phase 8)`,
    );
  };

  const handleVideoCall = (member: FamilyMember) => {
    console.log(`[Home Video Call] Video calling ${member.name}`);
    setSelectedFamilyMember(null);
    Alert.alert(
      'Video Call with ' + member.name,
      `Starting video call with ${member.name}...\n\n(Native Video call in Phase 8)`,
    );
  };

  const handleCameraAction = (mode: string) => {
    console.log(`[Camera] Opening camera in ${mode} mode`);
    Alert.alert(
      'Camera — ' + mode,
      `Launching ${mode} mode...\n\n(Native Camera Module in Phase 9)`,
    );
  };

  const handleEntertainmentAction = (name: string) => {
    console.log(`[Entertainment] Opening ${name}`);
    Alert.alert(
      name,
      `Opening ${name}...\n\n(Direct app launcher in Phase 7)`,
    );
  };

  const handleSosTrigger = () => {
    console.log(`[Emergency SOS] Alerting ${primaryContact.name}`);
    setSosModalVisible(false);
    Alert.alert(
      '🚨 Calling ' + primaryContact.name,
      `Calling emergency contact ${primaryContact.name} (${primaryContact.phoneNumber}) and sending location alerts!`,
    );
  };

  const topPadding = insets.top > 0 ? insets.top + 10 : 28;
  const bottomPadding = insets.bottom > 0 ? insets.bottom + 60 : 80;

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <StatusBar barStyle={colors.statusBar} />

      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingHorizontal: spacing.md,
            paddingTop: topPadding,
            paddingBottom: bottomPadding,
          },
        ]}
        showsVerticalScrollIndicator={false}>
        {/* 1. Header: Greeting, Live Clock & Weather */}
        <View style={styles.topSection}>
          {parentProfile?.name && (
            <EHText
              variant="caption"
              color={colors.textSecondary}
              style={styles.greetingText}>
              Welcome, {parentProfile.name}
            </EHText>
          )}

          <EHText variant="heading1" weight="800" style={styles.clockText}>
            {currentTime}
          </EHText>

          <EHText variant="body" color={colors.textSecondary} weight="500">
            {currentDate}
          </EHText>

          {/* Weather pill badge */}
          <View
            style={[
              styles.weatherPill,
              {
                backgroundColor: isDark
                  ? 'rgba(30, 41, 59, 0.8)'
                  : 'rgba(241, 245, 249, 0.9)',
                borderColor: colors.border,
              },
            ]}>
            <Sun size={15} color={colors.warning} style={styles.weatherIcon} />
            <EHText variant="caption" weight="600">
              29°C • Sunny • Home
            </EHText>
          </View>
        </View>

        {/* 2. Family Contacts Row */}
        <EHSection
          title="Family & Loved Ones"
          subtitle="Tap any photo to call or message"
          action={{
            label: 'See All →',
            onPress: () => navigation.navigate('Family'),
          }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.familyScroll}>
            {familyMembers.map((member, index) => (
              <EHCard
                key={member.id}
                style={styles.familyCard}
                onPress={() => setSelectedFamilyMember(member)}
                elevation="medium">
                <View style={styles.avatarWrapper}>
                  <EHAvatar
                    source={member.photo}
                    name={member.name}
                    size={64}
                  />
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
          </ScrollView>
        </EHSection>

        {/* 3. Primary Communication Grid */}
        <EHSection title="Quick Communication">
          <View style={styles.grid2}>
            <EHIconButton
              icon={<Phone size={32} color={colors.primary} />}
              label="Phone Call"
              subtitle={`Call ${primaryContact.name}`}
              onPress={() => handleCall(primaryContact)}
            />
            <EHIconButton
              icon={<MessageCircle size={32} color={colors.primary} />}
              label="WhatsApp"
              subtitle="Send Message"
              onPress={() => handleWhatsApp(primaryContact)}
            />
          </View>
        </EHSection>

        {/* 4. Camera Suite */}
        <EHSection title="Camera & Photos">
          <View style={styles.grid3}>
            <EHIconButton
              icon={<Camera size={28} color={colors.primary} />}
              label="Photo"
              subtitle="Camera"
              onPress={() => handleCameraAction('Photo')}
              style={styles.grid3Item}
            />
            <EHIconButton
              icon={<User size={28} color={colors.primary} />}
              label="Selfie"
              subtitle="Front Camera"
              onPress={() => handleCameraAction('Selfie')}
              style={styles.grid3Item}
            />
            <EHIconButton
              icon={<Video size={28} color={colors.primary} />}
              label="Video"
              subtitle="Record"
              onPress={() => handleCameraAction('Video')}
              style={styles.grid3Item}
            />
          </View>
        </EHSection>

        {/* 5. Entertainment Suite */}
        <EHSection title="Entertainment">
          <View style={styles.grid2}>
            <EHIconButton
              icon={<PlaySquare size={32} color={colors.primary} />}
              label="YouTube"
              subtitle="Videos & Music"
              onPress={() => handleEntertainmentAction('YouTube')}
            />
            <EHIconButton
              icon={<ImageIcon size={32} color={colors.primary} />}
              label="Photos"
              subtitle="My Gallery"
              onPress={() => handleEntertainmentAction('Gallery')}
            />
          </View>
        </EHSection>

        {/* 6. Daily Utilities & Medication Reminder */}
        <EHSection title="Daily Utilities">
          <View style={styles.utilitiesStack}>
            {/* Medication Card */}
            <EHCard style={styles.reminderCard} elevation="low">
              <View style={styles.reminderRow}>
                <View
                  style={[
                    styles.reminderIconCircle,
                    {backgroundColor: colors.primaryLight},
                  ]}>
                  <Pill size={24} color={colors.primary} />
                </View>
                <View style={styles.reminderTextCol}>
                  <EHText variant="caption" color={colors.primary} weight="700">
                    UPCOMING REMINDER
                  </EHText>
                  <EHText variant="body" weight="700">
                    {nextReminder.title}
                  </EHText>
                  <EHText variant="caption" color={colors.textSecondary}>
                    Scheduled for {nextReminder.time}
                  </EHText>
                </View>
                <EHButton
                  label="Done"
                  variant="outline"
                  onPress={() =>
                    Alert.alert('Reminder Marked Done', 'Great job taking care!')
                  }
                  style={styles.reminderDoneBtn}
                />
              </View>
            </EHCard>

            {/* Torch Tile */}
            <EHIconButton
              icon={
                <Flashlight
                  size={32}
                  color={torchActive ? colors.warning : colors.textPrimary}
                />
              }
              label={torchActive ? 'Torch ON' : 'Torch OFF'}
              subtitle={torchActive ? 'Tap to turn off' : 'Tap to turn on'}
              backgroundColor={
                torchActive ? colors.warningLight : colors.surface
              }
              onPress={() => setTorchActive(!torchActive)}
            />
          </View>
        </EHSection>

        {/* 7. Emergency SOS Section */}
        <EHSection title="Safety & Support">
          <EHButton
            label="EMERGENCY HELP / SOS"
            icon={<ShieldAlert size={22} color="#FFFFFF" />}
            variant="danger"
            onPress={() => setSosModalVisible(true)}
            style={styles.sosButton}
          />
        </EHSection>

        {/* 8. Bottom Launcher Navigation */}
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={[
              styles.bottomBarBtn,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderRadius: borderRadius.lg,
              },
            ]}
            onPress={() => appDrawerRef.current?.open()}
            activeOpacity={0.75}>
            <LayoutGrid size={28} color={colors.primary} style={styles.bottomBarIcon} />
            <EHText variant="body" weight="700">
              All Apps
            </EHText>
            <EHText variant="caption" color={colors.textSecondary}>
              Swipe up or tap
            </EHText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.bottomBarBtn,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderRadius: borderRadius.lg,
              },
            ]}
            onPress={() => navigation.navigate('Settings')}
            activeOpacity={0.75}>
            <Settings size={28} color={colors.primary} style={styles.bottomBarIcon} />
            <EHText variant="body" weight="700">
              Settings
            </EHText>
            <EHText variant="caption" color={colors.textSecondary}>
              Theme & layout
            </EHText>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Communication Bottom Sheet for Selected Family Member */}
      <EHBottomSheet
        visible={!!selectedFamilyMember}
        onClose={() => setSelectedFamilyMember(null)}
        title={
          selectedFamilyMember
            ? `Contact ${selectedFamilyMember.name} (${selectedFamilyMember.relationship})`
            : 'Contact'
        }>
        {selectedFamilyMember && (
          <View style={styles.sheetContent}>
            <EHButton
              label={`Normal Phone Call`}
              icon={<Phone size={18} color="#FFFFFF" />}
              variant="primary"
              onPress={() => handleCall(selectedFamilyMember)}
              style={styles.sheetBtn}
            />
            <EHButton
              label={`WhatsApp Message`}
              icon={<MessageCircle size={18} color={colors.primary} />}
              variant="secondary"
              onPress={() => handleWhatsApp(selectedFamilyMember)}
              style={styles.sheetBtn}
            />
            <EHButton
              label={`Video Call`}
              icon={<Video size={18} color={colors.primary} />}
              variant="outline"
              onPress={() => handleVideoCall(selectedFamilyMember)}
              style={styles.sheetBtn}
            />
            <EHButton
              label="Cancel"
              variant="ghost"
              onPress={() => setSelectedFamilyMember(null)}
              style={styles.sheetBtn}
            />
          </View>
        )}
      </EHBottomSheet>

      {/* Emergency SOS Confirmation Modal */}
      <EHModal
        visible={sosModalVisible}
        onClose={() => setSosModalVisible(false)}
        title="Emergency SOS">
        <View style={styles.modalContent}>
          <EHText variant="body" style={styles.modalText}>
            Are you sure you want to trigger Emergency SOS? This will immediately
            call your primary contact{' '}
            <EHText variant="body" weight="700">
              {primaryContact.name} ({primaryContact.phoneNumber})
            </EHText>{' '}
            and notify family members with your location.
          </EHText>

          <EHButton
            label={`Yes, Call ${primaryContact.name}`}
            icon={<Phone size={18} color="#FFFFFF" />}
            variant="danger"
            onPress={handleSosTrigger}
            style={styles.modalActionBtn}
          />
          <EHButton
            label="Cancel / I'm Okay"
            variant="outline"
            onPress={() => setSosModalVisible(false)}
            style={styles.modalActionBtn}
          />
        </View>
      </EHModal>

      {/* Pixel UI App Drawer BottomSheet */}
      <PixelAppDrawer ref={appDrawerRef} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {},
  topSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  greetingText: {
    marginBottom: 4,
  },
  clockText: {
    letterSpacing: 1,
    marginVertical: 2,
  },
  weatherPill: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  weatherIcon: {
    marginRight: 6,
  },
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
  grid2: {
    flexDirection: 'row',
    gap: 12,
  },
  grid3: {
    flexDirection: 'row',
    gap: 8,
  },
  grid3Item: {
    flex: 1,
    paddingHorizontal: 4,
  },
  utilitiesStack: {
    gap: 12,
  },
  reminderCard: {
    padding: 14,
  },
  reminderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reminderIconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  reminderTextCol: {
    flex: 1,
  },
  reminderDoneBtn: {
    minHeight: 40,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  sosButton: {
    minHeight: 64,
  },
  bottomBar: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  bottomBarBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderWidth: 1,
  },
  bottomBarIcon: {
    marginBottom: 6,
  },
  sheetContent: {
    gap: 12,
  },
  sheetBtn: {
    minHeight: 52,
  },
  modalContent: {
    gap: 12,
  },
  modalText: {
    marginBottom: 8,
    lineHeight: 24,
  },
  modalActionBtn: {
    minHeight: 52,
  },
});

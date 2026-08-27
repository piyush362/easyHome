import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  StatusBar,
  BackHandler,
  Alert,
  Linking,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme';
import { PixelAppDrawer, PixelAppDrawerRef } from '../../components/apps';
import { useAppSelector } from '../../store';
import {
  ContactsService,
  CameraService,
  GalleryService,
  TorchService,
  AppsService,
  ReminderService,
} from '../../services';
import { FamilyMember, Reminder } from '../../types/models';
import type { RootStackScreenProps } from '../../navigation/types';
import { WallpaperWrapper } from '../../components';
import {
  HomeHeader,
  HomeFamilySection,
  HomeQuickCommSection,
  HomeCameraSection,
  HomeEntertainmentSection,
  HomeUtilitiesSection,
  HomeSosSection,
  HomeBottomBar,
  HomeSosModal,
  HomeContactSheet,
} from './components';

export default function HomeScreen({
  navigation,
}: RootStackScreenProps<'Home'>) {
  const { colors, spacing } = useTheme();
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
    TorchService.isTorchActive()
      .then(setTorchActive)
      .catch(() => {});
    return () => clearInterval(interval);
  }, [updateTime]);

  // Primary emergency contact (null if no family added yet)
  const primaryContact: FamilyMember | null = useMemo(() => {
    return familyMembers[0] || null;
  }, [familyMembers]);

  // Next active reminder
  const nextReminder: Reminder | null = useMemo(() => {
    return (
      ReminderService.getNextUpcomingReminder(reminders) ||
      (reminders.length === 0
        ? {
            id: 'default',
            title: 'Blood Pressure Tablet',
            description: 'Daily medication reminder',
            time: '1:00 PM',
            type: 'medicine',
            recurring: true,
            recurringPattern: 'daily',
            enabled: true,
          }
        : null)
    );
  }, [reminders]);

  // Auto scroll to top & prevent exiting launcher when on root Home screen
  useFocusEffect(
    useCallback(() => {
      requestAnimationFrame(() => {
        scrollViewRef.current?.scrollTo({ y: 0, animated: false });
      });

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

  // Quick direct app openers (Phone dialer & WhatsApp)
  const handleOpenPhone = async () => {
    try {
      await ContactsService.openDialer();
    } catch (error: any) {
      Alert.alert('Phone App', 'Could not open Phone app: ' + error?.message);
    }
  };

  const handleOpenWhatsApp = async () => {
    try {
      await AppsService.launchApp('com.whatsapp');
    } catch (error: any) {
      try {
        await Linking.openURL('whatsapp://app');
      } catch {
        Alert.alert(
          'WhatsApp Not Found',
          'Please install WhatsApp from the Google Play Store.',
        );
      }
    }
  };

  // Real Action handlers with native calling and messaging
  const handleCall = async (member: FamilyMember | null) => {
    setSelectedFamilyMember(null);
    if (!member) {
      return;
    }
    try {
      await ContactsService.makeDirectCall(member.phoneNumber);
    } catch (error: any) {
      Alert.alert(
        'Cannot Call',
        `Failed to call ${member.name}.\n\nError: ${
          error?.message || 'Unknown'
        }`,
      );
    }
  };

  const handleWhatsApp = async (member: FamilyMember | null) => {
    setSelectedFamilyMember(null);
    if (!member) {
      return;
    }
    try {
      await ContactsService.openWhatsApp(member.phoneNumber);
    } catch (error: any) {
      Alert.alert(
        'Cannot Open WhatsApp',
        `Failed to open WhatsApp with ${member.name}.\n\nError: ${
          error?.message || 'Please make sure WhatsApp is installed.'
        }`,
      );
    }
  };

  const handleVideoCall = async (member: FamilyMember) => {
    setSelectedFamilyMember(null);
    try {
      await ContactsService.openWhatsApp(member.phoneNumber);
    } catch (error: any) {
      Alert.alert(
        'Video Call',
        `Starting video call with ${member.name}...\n\nError: ${error?.message}`,
      );
    }
  };

  // Direct Native Camera Actions (Photo, Selfie, Video)
  const handleCameraAction = async (mode: 'Photo' | 'Selfie' | 'Video') => {
    try {
      if (mode === 'Photo') {
        await CameraService.takePhoto();
      } else if (mode === 'Selfie') {
        await CameraService.takeSelfie();
      } else if (mode === 'Video') {
        await CameraService.recordVideo();
      }
    } catch (error: any) {
      Alert.alert('Camera', 'Could not open camera: ' + error?.message);
    }
  };

  // Entertainment Actions (YouTube & Gallery)
  const handleEntertainmentAction = async (name: 'YouTube' | 'Gallery') => {
    try {
      if (name === 'YouTube') {
        const isInstalled = await AppsService.isAppInstalled(
          'com.google.android.youtube',
        );
        if (isInstalled) {
          await AppsService.launchApp('com.google.android.youtube');
        } else {
          await AppsService.launchApp('com.android.chrome');
        }
      } else if (name === 'Gallery') {
        await GalleryService.openGallery();
      }
    } catch (error: any) {
      Alert.alert(name, 'Could not open ' + name + ': ' + error?.message);
    }
  };

  // Torch Toggle
  const handleTorchToggle = async () => {
    try {
      const isAvailable = await TorchService.isAvailable();
      if (!isAvailable) {
        Alert.alert(
          'Flashlight',
          'Flashlight hardware is not available on this device.',
        );
        return;
      }
      const newState = await TorchService.toggle();
      setTorchActive(newState);
    } catch (error: any) {
      Alert.alert(
        'Flashlight',
        'Could not toggle flashlight: ' + error?.message,
      );
    }
  };

  const handleSosTrigger = async () => {
    setSosModalVisible(false);
    const targetNumber = primaryContact?.phoneNumber || '112';
    try {
      await ContactsService.makeDirectCall(targetNumber);
    } catch (error: any) {
      Alert.alert('Emergency Alert', `Calling emergency (${targetNumber})...`);
    }
  };

  const bottomPadding = insets.bottom > 0 ? insets.bottom + 60 : 80;

  return (
    <WallpaperWrapper style={styles.container}>
      <StatusBar barStyle={colors.statusBar} />

      {/* to keep statusbar area uncovered */}
      <View style={{ height: insets.top }} />

      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingHorizontal: spacing.md,
            paddingTop: 10,
            paddingBottom: bottomPadding,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. Header: Greeting, Live Clock & Weather */}
        <HomeHeader
          parentName={parentProfile?.name}
          currentTime={currentTime}
          currentDate={currentDate}
        />

        {/* 2. Family Contacts Row */}
        <HomeFamilySection
          familyMembers={familyMembers}
          onSelectMember={setSelectedFamilyMember}
          onSeeAll={() => navigation.navigate('Family')}
        />

        {/* 3. Primary Communication Grid */}
        <HomeQuickCommSection
          onOpenPhone={handleOpenPhone}
          onOpenWhatsApp={handleOpenWhatsApp}
        />

        {/* 4. Camera Suite */}
        <HomeCameraSection onCameraAction={handleCameraAction} />

        {/* 5. Entertainment Suite */}
        <HomeEntertainmentSection
          onEntertainmentAction={handleEntertainmentAction}
        />

        {/* 6. Daily Utilities & Medication Reminder */}
        <HomeUtilitiesSection
          reminder={nextReminder}
          torchActive={torchActive}
          onTorchToggle={handleTorchToggle}
          onReminderPress={() => navigation.navigate('ReminderList')}
        />

        {/* 7. Emergency SOS Section */}
        <HomeSosSection onSosPress={() => setSosModalVisible(true)} />

        {/* 8. Bottom Launcher Navigation */}
        <HomeBottomBar
          onOpenDrawer={() => appDrawerRef.current?.open()}
          onOpenSettings={() => navigation.navigate('Settings')}
        />
      </ScrollView>

      {/* Communication Bottom Sheet for Selected Family Member */}
      <HomeContactSheet
        member={selectedFamilyMember}
        onClose={() => setSelectedFamilyMember(null)}
        onCall={handleCall}
        onWhatsApp={handleWhatsApp}
        onVideoCall={handleVideoCall}
      />

      {/* Emergency SOS Confirmation Modal */}
      <HomeSosModal
        visible={sosModalVisible}
        primaryContact={primaryContact}
        onClose={() => setSosModalVisible(false)}
        onConfirm={handleSosTrigger}
        onConfigureContacts={() => navigation.navigate('Family')}
      />

      {/* Pixel UI App Drawer BottomSheet */}
      <PixelAppDrawer ref={appDrawerRef} />
    </WallpaperWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    gap: 12,
  },
});

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  BackHandler,
  Alert,
  Linking,
  Keyboard,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from '../../theme';
import {PixelAppDrawer, PixelAppDrawerRef} from '../../components/apps';
import {useAppSelector, useAppDispatch, fetchInstalledApps} from '../../store';
import {
  ContactsService,
  CameraService,
  GalleryService,
  TorchService,
  AppsService,
  LauncherService,
} from '../../services';
import {FamilyMember} from '../../types/models';
import type {RootStackScreenProps} from '../../navigation/types';
import {WallpaperWrapper} from '../../components';
import {
  HomeContactSheet,
  HomeSosModal,
} from '../home/components';
import {
  HomeV2BottomBar,
  HomeV2BottomTab,
  HomeV2MainView,
  HomeV2FavoritesView,
  HomeV2AppsView,
  HomeV2SettingsView,
  FavoriteAppSlot,
} from './components';

export default function HomeScreenV2({
  navigation,
}: RootStackScreenProps<'Home'>) {
  const {colors, spacing} = useTheme();
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();

  const appDrawerRef = useRef<PixelAppDrawerRef>(null);

  // Redux state
  const parentProfile = useAppSelector(state => state.parent.profile);
  const familyMembers = useAppSelector(state => state.family.members);
  const installedApps = useAppSelector(state => state.apps.installedApps);
  const appsLoading = useAppSelector(state => state.apps.isLoading);
  const reminders = useAppSelector(state => state.reminders.reminders);

  // Tab state
  const [activeTab, setActiveTab] = useState<HomeV2BottomTab>('home');

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
      `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`,
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

  // Load apps on startup
  useEffect(() => {
    if (installedApps.length === 0) {
      dispatch(fetchInstalledApps(false));
    }
  }, [dispatch, installedApps.length]);

  // Primary emergency contact
  const primaryContact: FamilyMember | null = useMemo(() => {
    return familyMembers[0] || null;
  }, [familyMembers]);

  // Auto handle back button: If on a sub-tab, return to home tab; else consume
  useFocusEffect(
    useCallback(() => {
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
        if (activeTab !== 'home') {
          setActiveTab('home');
          return true;
        }
        return true; // Consume event on root Home screen
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => subscription.remove();
    }, [activeTab, selectedFamilyMember, sosModalVisible]),
  );

  // Handle Home button / gesture: Always return to 'home' tab immediately
  useEffect(() => {
    const unsubscribe = LauncherService.addHomeButtonPressedListener(() => {
      if (appDrawerRef.current?.isOpen()) {
        appDrawerRef.current.close();
      }
      setSelectedFamilyMember(null);
      setSosModalVisible(false);
      Keyboard.dismiss();
      setActiveTab('home');
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Action handlers
  const handleTorchToggle = async () => {
    try {
      const newState = await TorchService.toggle();
      setTorchActive(newState);
    } catch (error: any) {
      Alert.alert('Flashlight Error', error?.message || 'Could not toggle torch');
    }
  };

  const handleLaunchSlotApp = async (slot: FavoriteAppSlot) => {
    try {
      if (slot.type === 'app' && slot.packageName) {
        await AppsService.launchApp(slot.packageName);
        return;
      }

      switch (slot.actionKey) {
        case 'phone':
          await ContactsService.openDialer();
          break;
        case 'contacts':
          setActiveTab('fav');
          break;
        case 'messages':
          try {
            await Linking.openURL('sms:');
          } catch {
            await AppsService.launchApp('com.google.android.apps.messaging');
          }
          break;
        case 'whatsapp':
          try {
            await AppsService.launchApp('com.whatsapp');
          } catch {
            await Linking.openURL('whatsapp://app');
          }
          break;
        case 'camera':
          await CameraService.takePhoto();
          break;
        case 'youtube':
          try {
            await AppsService.launchApp('com.google.android.youtube');
          } catch {
            await Linking.openURL('https://youtube.com');
          }
          break;
        case 'gallery':
          await GalleryService.openGallery();
          break;
        case 'radio':
          try {
            await Linking.openURL('https://google.com');
          } catch {
            Alert.alert('FM Radio / Browser', 'Browser launched');
          }
          break;
        case 'drawer':
          setActiveTab('apps');
          break;
        default:
          setActiveTab('apps');
          break;
      }
    } catch (error: any) {
      Alert.alert('Cannot Open App', error?.message || 'Failed to open application');
    }
  };

  const handleCall = async (member: FamilyMember | null) => {
    setSelectedFamilyMember(null);
    if (!member) return;
    try {
      await ContactsService.makeDirectCall(member.phoneNumber);
    } catch (error: any) {
      Alert.alert('Cannot Call', `Failed to call ${member.name}: ${error?.message}`);
    }
  };

  const handleWhatsApp = async (member: FamilyMember | null) => {
    setSelectedFamilyMember(null);
    if (!member) return;
    try {
      await ContactsService.openWhatsApp(member.phoneNumber);
    } catch (error: any) {
      Alert.alert('Cannot Message', `Failed to message ${member.name}: ${error?.message}`);
    }
  };

  const handleVideoCall = async (member: FamilyMember | null) => {
    setSelectedFamilyMember(null);
    if (!member) return;
    try {
      await ContactsService.openWhatsApp(member.phoneNumber);
    } catch (error: any) {
      Alert.alert('Cannot Video Call', `Failed to video call ${member.name}: ${error?.message}`);
    }
  };

  const handleSosConfirm = async () => {
    setSosModalVisible(false);
    if (primaryContact) {
      handleCall(primaryContact);
    } else {
      try {
        await ContactsService.makeDirectCall('112');
      } catch {
        await ContactsService.openDialer();
      }
    }
  };

  return (
    <WallpaperWrapper>
      <View style={styles.screenRoot}>
        <StatusBar barStyle={colors.statusBar} />

        {/* View Container with Safe Area Padding */}
        <View
          style={[
            styles.viewContainer,
            {
              paddingTop: insets.top + 4,
              paddingHorizontal: spacing.md,
            },
          ]}>
          {/* Active Tab View */}
          {activeTab === 'fav' && (
            <HomeV2FavoritesView
              familyMembers={familyMembers}
              onAddContact={() => navigation.navigate('Family')}
              onSelectMember={setSelectedFamilyMember}
            />
          )}

          {activeTab === 'home' && (
            <HomeV2MainView
              parentName={parentProfile?.name}
              currentTime={currentTime}
              currentDate={currentDate}
              familyMembers={familyMembers}
              installedApps={installedApps}
              reminders={reminders}
              torchActive={torchActive}
              onSelectMember={setSelectedFamilyMember}
              onAddContact={() => navigation.navigate('Family')}
              onLaunchApp={handleLaunchSlotApp}
              onOpenDrawer={() => setActiveTab('apps')}
              onTorchToggle={handleTorchToggle}
              onOpenReminders={() => navigation.navigate('ReminderList')}
            />
          )}

          {activeTab === 'apps' && (
            <HomeV2AppsView
              installedApps={installedApps}
              isLoading={appsLoading}
            />
          )}

          {activeTab === 'settings' && (
            <HomeV2SettingsView
              onNavigateTo={screen => navigation.navigate(screen as any)}
            />
          )}
        </View>

        {/* Floating iOS Glass Tab Bar */}
        <HomeV2BottomBar
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Contact Action Sheet Modal */}
        <HomeContactSheet
          member={selectedFamilyMember}
          onClose={() => setSelectedFamilyMember(null)}
          onCall={(m: FamilyMember) => handleCall(m)}
          onWhatsApp={(m: FamilyMember) => handleWhatsApp(m)}
          onVideoCall={(m: FamilyMember) => handleVideoCall(m)}
        />

        {/* SOS Emergency Confirmation Modal */}
        <HomeSosModal
          visible={sosModalVisible}
          primaryContact={primaryContact}
          onClose={() => setSosModalVisible(false)}
          onConfirm={handleSosConfirm}
        />

        {/* Pixel / Modern App Drawer Bottom Sheet */}
        <PixelAppDrawer ref={appDrawerRef} />
      </View>
    </WallpaperWrapper>
  );
}

const styles = StyleSheet.create({
  screenRoot: {
    flex: 1,
  },
  viewContainer: {
    flex: 1,
  },
});

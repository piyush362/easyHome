import React from 'react';
import {View, StyleSheet} from 'react-native';
import {FamilyMember, InstalledApp, Reminder} from '../../../types/models';
import {
  HomeV2ClockWidget,
  HomeV2ContactsRow,
  HomeV2FavoriteAppsGrid,
  HomeV2ToolsRow,
  FavoriteAppSlot,
} from './index';

export interface HomeV2MainViewProps {
  parentName?: string;
  currentTime: string;
  currentDate: string;
  familyMembers: FamilyMember[];
  installedApps: InstalledApp[];
  reminders?: Reminder[];
  torchActive: boolean;
  onSelectMember: (member: FamilyMember) => void;
  onAddContact: () => void;
  onLaunchApp: (slot: FavoriteAppSlot) => void;
  onOpenDrawer: () => void;
  onTorchToggle: () => void;
  onOpenReminders?: () => void;
}

export function HomeV2MainView({
  parentName,
  currentTime,
  currentDate,
  familyMembers,
  installedApps,
  reminders = [],
  torchActive,
  onSelectMember,
  onAddContact,
  onLaunchApp,
  onOpenDrawer,
  onTorchToggle,
  onOpenReminders,
}: HomeV2MainViewProps) {
  return (
    <View style={styles.fixedContainer}>
      {/* 1. Swipeable Clock & Reminders Widget */}
      <HomeV2ClockWidget
        parentName={parentName}
        currentTime={currentTime}
        currentDate={currentDate}
        reminders={reminders}
        onOpenReminders={onOpenReminders}
      />

      {/* 2. Quick Tools Row (Torch, Ringer, Battery %, Theme) */}
      <HomeV2ToolsRow
        torchActive={torchActive}
        onTorchToggle={onTorchToggle}
      />

      {/* 3. Quick Contacts 1-Row */}
      <HomeV2ContactsRow
        familyMembers={familyMembers}
        onSelectMember={onSelectMember}
        onAddContact={onAddContact}
      />

      {/* 4. Favorite Apps (3 Rows) */}
      <HomeV2FavoriteAppsGrid
        installedApps={installedApps}
        onLaunchApp={onLaunchApp}
        onOpenDrawer={onOpenDrawer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fixedContainer: {
    flex: 1,
    gap: 10,
    paddingBottom: 2,
  },
});

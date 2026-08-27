import {FamilyMember, Parent, Reminder, HomeAction} from '../types/models';

export const MOCK_PARENT: Parent | null = null;

export const MOCK_FAMILY_MEMBERS: FamilyMember[] = [];

export const MOCK_REMINDERS: Reminder[] = [
  {
    id: 'rem-1',
    type: 'medicine',
    title: 'Blood Pressure Tablet',
    description: 'Take 1 pill with warm water after lunch',
    time: '13:00',
    recurring: true,
    recurringPattern: 'daily',
    enabled: true,
  },
  {
    id: 'rem-2',
    type: 'water',
    title: 'Drink a Glass of Water',
    description: 'Stay hydrated throughout the day',
    time: '15:30',
    recurring: true,
    recurringPattern: 'daily',
    enabled: true,
  },
  {
    id: 'rem-3',
    type: 'exercise',
    title: 'Evening Walk in Garden',
    description: '15 minutes fresh air walk',
    time: '18:30',
    recurring: true,
    recurringPattern: 'daily',
    enabled: true,
  },
];

export const MOCK_HOME_ACTIONS: HomeAction[] = [
  {
    id: 'action-call',
    type: 'call',
    label: 'Phone Call',
    order: 0,
    enabled: true,
  },
  {
    id: 'action-whatsapp',
    type: 'whatsapp',
    label: 'WhatsApp',
    order: 1,
    enabled: true,
  },
  {
    id: 'action-camera',
    type: 'camera',
    label: 'Camera',
    order: 2,
    enabled: true,
  },
  {
    id: 'action-youtube',
    type: 'youtube',
    label: 'YouTube',
    order: 3,
    enabled: true,
  },
  {
    id: 'action-torch',
    type: 'torch',
    label: 'Torch',
    order: 4,
    enabled: true,
  },
  {
    id: 'action-help',
    type: 'help',
    label: 'Emergency Help',
    order: 5,
    enabled: true,
  },
];
